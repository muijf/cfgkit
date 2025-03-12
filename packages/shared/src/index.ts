export const JAVASCRIPT_EXTENSIONS = [".js", ".jsx", ".mjs", ".cjs"];
export const TYPESCRIPT_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts"];
export const TOML_EXTENSIONS = [".toml"];
export const JSON_EXTENSIONS = [".json", ".json5"];
export const YAML_EXTENSIONS = [".yaml", ".yml"];
export const JAVASCRIPT_PACKAGE = "@cfgkit/javascript";
export const TYPESCRIPT_PACKAGE = "@cfgkit/typescript";
export const TOML_PACKAGE = "@cfgkit/toml";
export const JSON_PACKAGE = "@cfgkit/json";
export const YAML_PACKAGE = "@cfgkit/yaml";

export type JavascriptPackage = typeof JAVASCRIPT_PACKAGE;
export type TypescriptPackage = typeof TYPESCRIPT_PACKAGE;
export type TomlPackage = typeof TOML_PACKAGE;
export type JsonPackage = typeof JSON_PACKAGE;
export type YamlPackage = typeof YAML_PACKAGE;

export interface LoaderSuggestion {
  extensions: string[];
  package: string;
}

export const LOADER_SUGGESTIONS: LoaderSuggestion[] = [
  {
    extensions: TYPESCRIPT_EXTENSIONS,
    package: TYPESCRIPT_PACKAGE,
  },
  {
    extensions: JAVASCRIPT_EXTENSIONS,
    package: JAVASCRIPT_PACKAGE,
  },
  {
    extensions: TOML_EXTENSIONS,
    package: TOML_PACKAGE,
  },
  {
    extensions: JSON_EXTENSIONS,
    package: JSON_PACKAGE,
  },
  {
    extensions: YAML_EXTENSIONS,
    package: YAML_PACKAGE,
  },
];
