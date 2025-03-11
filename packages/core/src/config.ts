import path from "path";
import fs from "fs";
import { transpile } from "../../typescript/src/transpiler";

const extensions = [".ts", ".js", ".cjs", ".mjs"];

function findConfigPath(cwd?: string): string | null {
  const workingDir = cwd ? path.resolve(process.cwd(), cwd) : process.cwd();
  for (const ext of extensions) {
    const configPath = path.join(workingDir, `extkit.config${ext}`);
    if (fs.existsSync(configPath)) return configPath;
  }
  const extkitDir = path.join(workingDir, ".extkit");
  if (fs.existsSync(extkitDir)) {
    for (const ext of extensions) {
      const configPath = path.join(extkitDir, `extkit.config${ext}`);
      if (fs.existsSync(configPath)) return configPath;
      const altConfigPath = path.join(extkitDir, `config${ext}`);
      if (fs.existsSync(altConfigPath)) return altConfigPath;
    }
  }
  return null;
}

export async function getConfig(configPath?: string, cwd?: string) {
  const configFilePath = configPath ?? findConfigPath(cwd);
  if (!configFilePath) throw new Error("No config file found.");
  let config: any;
  if (configFilePath.endsWith(".ts")) {
    config = await transpile(configFilePath, cwd);
  } else {
    config = await import(configFilePath);
  }
  return config;
}
