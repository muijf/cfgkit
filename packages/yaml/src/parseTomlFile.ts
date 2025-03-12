import { readFile } from "fs/promises";
import { parse } from "yaml";

export async function parseYamlFile(path: string) {
  const contents = await readFile(path, "utf8");
  if (contents.trim() === "") return {};
  return parse(contents);
}
