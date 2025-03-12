<img src="https://github.com/muijf/cfgkit/blob/main/.github/banner.png?raw=true">

<p align="center">
  <a href="https://docs.muijf.com/cfgkit">Docs</a>
</p>

# Packages

- [Core](./packages/core) - The core package for cfgkit
- [Typescript](./packages/typescript) - The TypeScript package for cfgkit
- [Javascript](./packages/javascript) - The JavaScript package for cfgkit
- [Json](./packages/json) - The JSON package for cfgkit
- [Toml](./packages/toml) - The TOML package for cfgkit
- [Yaml](./packages/yaml) - The YAML package for cfgkit
- [Utils](./packages/utils) - The utils package for cfgkit

# Usage

```ts
import { config } from "@cfgkit/core";

interface Config {
  hello: string;
}

interface Data {
  world: string;
}

const cfg = await config<Config, Data>({
  loaders: ["@cfgkit/typescript"],
  include: ["cfgkit.config.ts"],
  cwd: process.cwd(),
  data: {
    world: "world",
  },
});

console.log(cfg.hello);
```
