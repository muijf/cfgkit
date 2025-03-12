import type { Loader } from "@cfgkit/core";
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
    load({ path }) {
      return parseYamlFile(path);
    },
  };
}
