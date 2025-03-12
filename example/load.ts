import { config } from "@cfgkit/core";

const data = await config({
  loaders: ["@cfgkit/typescript", "@cfgkit/javascript"],
  include: [".cfgkit/config.{ts,js,.cjs}", "cfgkit.config.{ts,js}"],
  cwd: process.cwd(),
  throwOnMultiple: false,
});

console.log(data.default);
