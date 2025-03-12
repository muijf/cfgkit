import type { Loader } from "@cfgkit/core";
import { parseTomlFile } from "./parseTomlFile";
import {
  TOML_EXTENSIONS,
  TOML_PACKAGE,
  type TomlPackage,
} from "@cfgkit/shared";

export interface TomlLoader extends Loader {
  __package: TomlPackage;
}

export function toml(): TomlLoader {
  return {
    __package: TOML_PACKAGE,
    extensions: TOML_EXTENSIONS,
    load({ path }) {
      return parseTomlFile(path);
    },
  };
}
