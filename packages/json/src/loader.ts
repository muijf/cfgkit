import type { Config, Loader } from "@cfgkit/core";
import { expandArgs, parseJsonFile } from "@cfgkit/utils";
import { JSON_EXTENSIONS } from "@cfgkit/shared";
import { JSON_PACKAGE, type JsonPackage } from "@cfgkit/shared";

export interface JsonLoader extends Loader {
  __package: JsonPackage;
}

export function json(): JsonLoader {
  return {
    __package: JSON_PACKAGE,
    extensions: JSON_EXTENSIONS,
    async load(config: Config, path: string): Promise<any> {
      const json = await parseJsonFile(path);
      const expanded = expandArgs(json, config.data);
      return expanded;
    },
  };
}
