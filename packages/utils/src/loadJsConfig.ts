import path from "path";
import fs from "fs";
import { getTypeScriptConfiguration } from "../../typescript/src/getTypescriptConfiguration";
import { readFileSync } from "fs";
import { hasNecessaryDependencies } from "./hasMissingDependencies";
import JSON5 from "json5";

let TSCONFIG_WARNED = false;

export function parseJsonFile(filePath: string) {
  const contents = readFileSync(filePath, "utf8");

  if (contents.trim() === "") {
    return {};
  }

  return JSON5.parse(contents);
}

export type ResolvedBaseUrl =
  | { baseUrl: string; isImplicit: boolean }
  | undefined;

export type JsConfig = { compilerOptions: Record<string, any> } | undefined;

export default async function loadJsConfig(
  dir: string,
  config: any
): Promise<{
  useTypeScript: boolean;
  jsConfig: JsConfig;
  jsConfigPath?: string;
  resolvedBaseUrl: ResolvedBaseUrl;
}> {
  let typeScriptPath: string | undefined;
  try {
    const deps = await hasNecessaryDependencies(dir, [
      {
        pkg: "typescript",
        file: "typescript/lib/typescript.js",
        exportsRestrict: true,
      },
    ]);
    typeScriptPath = deps.resolved.get("typescript");
  } catch {}
  const tsConfigPath = path.join(dir, config.typescript.tsconfigPath);
  const useTypeScript = Boolean(typeScriptPath && fs.existsSync(tsConfigPath));

  let implicitBaseurl;
  let jsConfig: { compilerOptions: Record<string, any> } | undefined;
  // jsconfig is a subset of tsconfig
  if (useTypeScript) {
    if (
      config.typescript.tsconfigPath !== "tsconfig.json" &&
      TSCONFIG_WARNED === false
    ) {
      TSCONFIG_WARNED = true;
      console.info(`Using tsconfig file: ${config.typescript.tsconfigPath}`);
    }

    const ts = (await Promise.resolve(
      require(typeScriptPath!)
    )) as typeof import("typescript");
    const tsConfig = await getTypeScriptConfiguration(ts, tsConfigPath, true);
    jsConfig = { compilerOptions: tsConfig.options };
    implicitBaseurl = path.dirname(tsConfigPath);
  }

  const jsConfigPath = path.join(dir, "jsconfig.json");
  if (!useTypeScript && fs.existsSync(jsConfigPath)) {
    jsConfig = parseJsonFile(jsConfigPath);
    implicitBaseurl = path.dirname(jsConfigPath);
  }

  let resolvedBaseUrl: ResolvedBaseUrl;
  if (jsConfig?.compilerOptions["baseUrl"]) {
    resolvedBaseUrl = {
      baseUrl: path.resolve(dir, jsConfig.compilerOptions["baseUrl"]),
      isImplicit: false,
    };
  } else {
    if (implicitBaseurl) {
      resolvedBaseUrl = {
        baseUrl: implicitBaseurl,
        isImplicit: true,
      };
    }
  }

  return {
    useTypeScript,
    jsConfig,
    resolvedBaseUrl,
    jsConfigPath: useTypeScript
      ? tsConfigPath
      : fs.existsSync(jsConfigPath)
      ? jsConfigPath
      : undefined,
  };
}
