import { config } from "@cfgkit/core";
import { resolve } from "path";
import { z } from "zod";

interface Config {
  default: () => { hello: "world" };
}

const validation = z.object({
  hello: z.string(),
});

interface Args {
  hello: string;
}

const cwd = resolve(process.cwd(), "src");

const toml = await config<Config, Args>({
  include: "cfgkit.config.toml",
  cwd,
  data: {
    hello: "world",
  },
  validate: validation,
});

console.log(toml);

const json = await config<Config, Args>({
  include: "cfgkit.config.json",
  cwd,
  data: {
    hello: "world",
  },
  validate: validation,
});

console.log(json);

const js = await config<Config, Args>({
  include: "cfgkit.config.js",
  cwd,
  data: {
    hello: "world",
  },
  validate: validation,
});

console.log(js);

const yaml = await config<Config, Args>({
  include: "cfgkit.config.yaml",
  cwd,
  data: {
    hello: "world",
  },
  validate: validation,
});

console.log(yaml);

const ts = await config<Config, Args>({
  include: "cfgkit.config.ts",
  cwd,
  data: {
    hello: "world",
  },
  validate: validation,
});

console.log(ts);

interface MergedConfig {
  hello: string;
  world: string;
}

const mergedValidation = z.object({
  hello: z.string(),
  world: z.string(),
});

interface MergedArgs {
  hello: string;
  world: string;
}

const merged = await config<MergedConfig, MergedArgs>({
  include: ["cfgkit.merged.ts", "cfgkit.merged.yaml"],
  cwd,
  data: {
    hello: "world",
    world: "hello",
  },
  validate: mergedValidation,
});

console.log(merged);
