import type { Loader } from "@cfgkit/core";
import { transpile } from "./transpiler";

export interface TypescriptLoader extends Loader {
  __package: "@cfgkit/typescript";
}

export function typescript(): TypescriptLoader {
  return {
    __package: "@cfgkit/typescript",
    extensions: [".ts"],
    load(path: string): Promise<any> {
      return transpile(path);
    },
  };
}
