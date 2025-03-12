import {
  type TypescriptPackage,
  type JavascriptPackage,
  type TomlPackage,
  type JsonPackage,
  LOADER_SUGGESTIONS,
  type YamlPackage,
} from "@cfgkit/shared";
import { type NonEmptyArray } from "@cfgkit/utils";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { glob } from "glob";
import { extname, resolve } from "path";
import { validate } from "./validate";

/**
 * The package name of the loader.
 */
export type LoaderPackage =
  | TypescriptPackage
  | JavascriptPackage
  | JsonPackage
  | TomlPackage
  | YamlPackage
  | string;

export interface Loader {
  /**
   * The package name of the loader.
   */
  readonly __package: LoaderPackage;

  /**
   * The extensions of the config files.
   */
  extensions: string | string[];

  /**
   * Loads the config file.
   * @param path - The path to the config file.
   */
  load(config: Config, path: string): Promise<any>;
}

export interface Config<Data = any> {
  /**
   * The loaders to use to load the config files.
   * You can also pass package names to load the default loader for that package
   * and let it throw if the package has to be installed.
   */
  loaders?: (string | Loader)[];

  /**
   * The glob pattern to include in the config search.
   */
  include: string | NonEmptyArray<string>;

  /**
   * The current working directory of the config file.
   * If not provided, the current working directory will be used.
   */
  cwd?: string;

  /**
   * The data to pass to the config file.
   */
  data?: Data;

  /**
   * The schema to validate the config file against.
   */
  validate?: StandardSchemaV1;
}

/**
 * Loads the config files.
 * @param config - The config to load the config files.
 * @returns The loaded config.
 */
export async function config<Result = any, Data = any>(config: Config<Data>) {
  const cwd = config.cwd ?? process.cwd();
  const include = await glob(config.include, { cwd: config.cwd });

  if (include.length === 0) {
    throw new Error(`No config files found for ${config.include}`);
  }

  const loaders = config.loaders || [];

  for (const path of include) {
    const ext = extname(path);
    const suggestedLoader = LOADER_SUGGESTIONS.find((l) =>
      l.extensions.includes(ext)
    );
    if (!suggestedLoader || loaders.includes(suggestedLoader.package)) continue;
    loaders.push(suggestedLoader.package);
  }

  const results: Result[] = [];

  for (const path of include) {
    const ext = extname(path);

    for (const anyLoader of loaders) {
      if (typeof anyLoader === "string") {
        const loader = await import(anyLoader);
        const data = await loader.default();

        if (data.extensions.includes(ext)) {
          const resolved = resolve(cwd, path);
          const result = await data.load(config, resolved);
          results.push(result as Result);
        }
      } else {
        if (anyLoader.extensions.includes(ext)) {
          const resolved = resolve(cwd, path);
          const result = await anyLoader.load(config, resolved);
          results.push(result as Result);
        }
      }
    }
  }

  const allKeys = new Set<string>();
  const duplicateKeys = new Set<string>();

  for (const result of results) {
    const keys = Object.keys(result || {});
    for (const key of keys) {
      if (allKeys.has(key)) {
        duplicateKeys.add(key);
      } else {
        allKeys.add(key);
      }
    }
  }

  if (duplicateKeys.size > 0) {
    throw new Error(
      `Duplicate configuration keys found across multiple files: ${Array.from(
        duplicateKeys
      ).join(", ")}`
    );
  }

  const result = results.reduce((acc, result) => {
    if (!result) return acc;
    return { ...acc, ...result };
  }, {} as Result);

  if (config.validate) {
    return validate(config.validate, result) as Result;
  }

  return result as Result;
}
