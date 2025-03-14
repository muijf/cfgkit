import { readFile } from "fs/promises";
import JSON5 from "json5";

export async function parseJsonFile(path: string) {
  const contents = await readFile(path, "utf8");
  if (contents.trim() === "") return {};
  return JSON5.parse(contents);
}
