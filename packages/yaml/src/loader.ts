import type { Config, Loader } from "@cfgkit/core";
import { expandArgs, parseJsonFile } from "@cfgkit/utils";
import {
  YAML_EXTENSIONS,
  YAML_PACKAGE,
  type YamlPackage,
} from "@cfgkit/shared";
import { parseYamlFile } from "./parseTomlFile";

export interface YamlLoader extends Loader {
  __package: YamlPackage;
}

export function yaml(): YamlLoader {
  return {
    __package: YAML_PACKAGE,
    extensions: YAML_EXTENSIONS,
    async load(config: Config, path: string): Promise<any> {
      const yaml = await parseYamlFile(path);
      const expanded = expandArgs(yaml, config.data);
      return expanded;
    },
  };
}
