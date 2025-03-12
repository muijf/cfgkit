<img src="https://github.com/muijf/cfgkit/blob/main/.github/banner.png?raw=true">

<p align="center">
  <a href="https://docs.muijf.com/cfgkit">Docs</a>
</p>

# Packages

- [Core](./packages/core) - The core package for cfgkit
- [Typescript](./packages/typescript) - The TypeScript package for cfgkit
- [Javascript](./packages/javascript) - The JavaScript package for cfgkit
- [Utils](./packages/utils) - The utils package for cfgkit

# Usage

```ts
import { config } from "@cfgkit/core";

interface Config {
  default: () => { hello: "world" };
}

const cfg = await config<Config>({
  loaders: ["@cfgkit/typescript", "@cfgkit/javascript"],
  include: [".cfgkit/config.{ts,js,.cjs}", "cfgkit.config.{ts,js}"],
  cwd: process.cwd(),
  throwOnMultiple: true,
});

console.log(cfg.default().hello);
```
