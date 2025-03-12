import type { Config, Loader } from "@cfgkit/core";
import { JAVASCRIPT_EXTENSIONS, type JavascriptPackage } from "@cfgkit/shared";
import { JAVASCRIPT_PACKAGE } from "@cfgkit/shared";

export interface JavascriptLoader extends Loader {
  __package: JavascriptPackage;
}

export function javascript(): JavascriptLoader {
  return {
    __package: JAVASCRIPT_PACKAGE,
    extensions: JAVASCRIPT_EXTENSIONS,
    async load(config: Config, path: string): Promise<any> {
      const imported = await import(path);

      if (imported.default) {
        if (typeof imported.default === "function")
          return imported.default(config.data);

        return imported.default;
      }

      return imported;
    },
  };
}
