import path from "path";
import { realpathSync } from "./realPath";

const Module = require("module");

export const resolveFrom = (
  fromDirectory: string,
  moduleId: string,
  silent?: boolean
) => {
  if (typeof fromDirectory !== "string") {
    throw new TypeError(
      `Expected \`fromDir\` to be of type \`string\`, got \`${typeof fromDirectory}\``
    );
  }

  if (typeof moduleId !== "string") {
    throw new TypeError(
      `Expected \`moduleId\` to be of type \`string\`, got \`${typeof moduleId}\``
    );
  }

  fromDirectory = realpathSync(fromDirectory);

  const fromFile = path.join(fromDirectory, "noop.js");

  const resolveFileName = () =>
    Module._resolveFilename(moduleId, {
      id: fromFile,
      filename: fromFile,
      paths: Module._nodeModulePaths(fromDirectory),
    });

  if (silent) {
    try {
      return resolveFileName();
    } catch (error) {
      return;
    }
  }

  return resolveFileName();
};
