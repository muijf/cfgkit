import { bold, cyan } from "@cfgkit/utils";
import os from "os";
import path from "path";
import type { ParsedCommandLine, FormatDiagnosticsHost } from "typescript";

export async function getConfig(
  ts: typeof import("typescript"),
  tsConfigPath: string,
  metaOnly?: boolean
): Promise<ParsedCommandLine> {
  try {
    const formatDiagnosticsHost: FormatDiagnosticsHost = {
      getCanonicalFileName: (fileName: string) => fileName,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => os.EOL,
    };

    const { config, error } = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    if (error) {
      throw new Error(ts.formatDiagnostic(error, formatDiagnosticsHost));
    }

    let configToParse: any = config;

    const result = ts.parseJsonConfigFileContent(
      configToParse,
      metaOnly
        ? {
            ...ts.sys,
            readDirectory(_path, extensions, _excludes, _includes, _depth) {
              return [extensions ? `file${extensions[0]}` : `file.ts`];
            },
          }
        : ts.sys,
      path.dirname(tsConfigPath)
    );

    if (result.errors) {
      result.errors = result.errors.filter(({ code }) => code !== 18003);
    }

    if (result.errors?.length) {
      throw new Error(
        ts.formatDiagnostic(result.errors[0], formatDiagnosticsHost)
      );
    }

    return result;
  } catch (err: any) {
    if (err.name === "SyntaxError") {
      const reason = "\n" + (err.message ?? "");
      throw new Error(
        bold(
          "Could not parse" +
            cyan("tsconfig.json") +
            "." +
            " Please make sure it contains syntactically correct JSON."
        ) + reason
      );
    }
    throw err;
  }
}
