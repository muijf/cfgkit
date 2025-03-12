import type { Loader } from "@cfgkit/core";
import { transpile } from "./transpiler";
import {
  TYPESCRIPT_EXTENSIONS,
  TYPESCRIPT_PACKAGE,
  type TypescriptPackage,
} from "@cfgkit/shared";

export interface TypescriptLoader extends Loader {
  __package: TypescriptPackage;
}

export function typescript(): TypescriptLoader {
  return {
    __package: TYPESCRIPT_PACKAGE,
    extensions: TYPESCRIPT_EXTENSIONS,
    async load({ config, path }): Promise<any> {
      const transpiled = await transpile(path);

      if (transpiled.default) {
        if (typeof transpiled.default === "function")
          return transpiled.default(config.data);

        return transpiled.default;
      }

      return transpiled;
    },
  };
}
