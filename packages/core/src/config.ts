import { type NonEmptyArray } from "@cfgkit/utils";
import { glob } from "glob";
import { extname, resolve } from "path";

const loaderSuggestions: Record<string, string[]> = {
  ".ts": ["@cfgkit/typescript"],
  ".js": ["@cfgkit/javascript"],
  ".cjs": ["@cfgkit/javascript"],
  ".mjs": ["@cfgkit/javascript"],
};

/**
 * The package name of the loader.
 */
export type LoaderPackage =
  | "@cfgkit/typescript"
  | "@cfgkit/javascript"
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
  load(path: any): Promise<any>;
}

export interface Config {
  /**
   * The loaders to use to load the config files.
   * You can also pass package names to load the default loader for that package
   * and let it throw if the package has to be installed. By default,
   * the loaders will be `['@cfgkit/typescript', '@cfgkit/javascript']`.
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
   * Whether to throw an error if multiple config files are found.
   * @default true
   */
  throwOnMultiple?: boolean;
}

/**
 * Loads the config files.
 * @param config - The config to load the config files.
 * @returns The loaded config.
 */
export async function config<T = any>(config: Config) {
  const cwd = config.cwd ?? process.cwd();
  const throwOnMultiple = config.throwOnMultiple ?? true;
  const include = await glob(config.include, { cwd: config.cwd });
  const loaders = config.loaders ?? [
    "@cfgkit/typescript",
    "@cfgkit/javascript",
  ];

  if (include.length === 0)
    throw new Error("No config files found: " + include.join(", "));

  if (include.length > 1 && throwOnMultiple)
    throw new Error("Multiple config files found: " + include.join(", "));

  for (const file of include) {
    const path = resolve(cwd, file);
    const ext = extname(file);

    for (const anyLoader of config.loaders ?? []) {
      if (typeof anyLoader === "string") {
        try {
          const loader = await import(anyLoader);

          if (loader.default().extensions.includes(ext)) {
            return loader.default().load(path) as Promise<T>;
          }
        } catch {
          const suggestions = loaderSuggestions[ext]?.join(", ");

          console.error(
            `No loader found for ${ext} (${path})\n${
              suggestions
                ? `Install the following package: ${suggestions}, or any other packages supporting ${ext}`
                : ""
            }`
          );
        }
      } else if (anyLoader.extensions.includes(ext)) {
        return anyLoader.load(path) as Promise<T>;
      }
    }
  }
  throw new Error(`No loader found`);
}
