import type { Loader } from "@cfgkit/core";

export interface JavascriptLoader extends Loader {
  __package: "@cfgkit/javascript";
}

export function javascript(): JavascriptLoader {
  return {
    __package: "@cfgkit/javascript",
    extensions: [".js", ".cjs", ".mjs"],
    load(path: string): Promise<any> {
      return import(path);
    },
  };
}
