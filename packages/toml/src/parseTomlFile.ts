import { readFile } from "fs/promises";
import { parse } from "smol-toml";

export async function parseTomlFile(path: string) {
  const contents = await readFile(path, "utf8");
  if (contents.trim() === "") return {};
  return parse(contents);
}
