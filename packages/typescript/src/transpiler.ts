import { type Options as SWCOptions, transform } from "@swc/core";
import type { CompilerOptions } from "typescript";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { deregisterHook, registerHook, requireFromString } from "./requireHook";
import { parseJsonFile } from "@cfgkit/utils";
function resolveSWCOptions(
  cwd: string,
  compilerOptions: CompilerOptions
): SWCOptions {
  const resolvedBaseUrl = join(cwd, compilerOptions.baseUrl ?? ".");
  return {
    jsc: {
      target: "es5",
      parser: {
        syntax: "typescript",
      },
      paths: compilerOptions.paths,
      baseUrl: resolvedBaseUrl,
    },
    module: {
      type: "commonjs",
    },
    isModule: "unknown",
  } satisfies SWCOptions;
}

async function lazilyGetTSConfig(cwd: string) {
  let tsConfig: { compilerOptions: CompilerOptions };
  try {
    tsConfig = await parseJsonFile(join(cwd, "tsconfig.json"));
  } catch (error) {
    // ignore if tsconfig.json does not exist
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    tsConfig = { compilerOptions: {} };
  }

  return tsConfig;
}

export async function transpile(path: string, cwd?: string) {
  cwd = cwd ?? process.cwd();
  let hasRequire = false;
  try {
    const { compilerOptions } = await lazilyGetTSConfig(cwd);
    const swcOptions = resolveSWCOptions(cwd, compilerOptions);

    const nextConfigString = await readFile(path, "utf8");
    const { code } = await transform(nextConfigString, swcOptions);

    // register require hook only if require exists
    if (code.includes("require(")) {
      registerHook(swcOptions);
      hasRequire = true;
    }

    // filename & extension don't matter here
    return requireFromString(code, join(cwd, "extkit.config.compiled.js"));
  } catch (error) {
    throw error;
  } finally {
    if (hasRequire) {
      deregisterHook();
    }
  }
}
