import type { Config, Loader } from "@cfgkit/core";
import { parseTomlFile } from "./parseTomlFile";
import {
  TOML_EXTENSIONS,
  TOML_PACKAGE,
  type TomlPackage,
} from "@cfgkit/shared";
import { expandArgs } from "@cfgkit/utils";

export interface TomlLoader extends Loader {
  __package: TomlPackage;
}

export function toml(): TomlLoader {
  return {
    __package: TOML_PACKAGE,
    extensions: TOML_EXTENSIONS,
    async load(config: Config, path: string) {
      const t = await parseTomlFile(path);
      const expanded = await expandArgs(t, config.data);
      return expanded;
    },
  };
}
