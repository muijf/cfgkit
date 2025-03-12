import type { Config, Loader } from "@cfgkit/core";
import { parseJsonFile } from "@cfgkit/utils";
import { JSON_EXTENSIONS } from "@cfgkit/shared";
import { JSON_PACKAGE, type JsonPackage } from "@cfgkit/shared";

export interface JsonLoader extends Loader {
  __package: JsonPackage;
}

export function json(): JsonLoader {
  return {
    __package: JSON_PACKAGE,
    extensions: JSON_EXTENSIONS,
    load(config: Config, path: string) {
      return parseJsonFile(path);
    },
  };
}
