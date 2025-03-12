import { readFileSync } from "fs";
import JSON5 from "json5";

export function parseJsonFile(filePath: string) {
  const contents = readFileSync(filePath, "utf8");

  if (contents.trim() === "") {
    return {};
  }

  return JSON5.parse(contents);
}
