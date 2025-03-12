export function expandArgs(args: any, values: Record<string, any> = {}): any {
  if (typeof args === "string") {
    return expandString(args, values);
  } else if (Array.isArray(args)) {
    return Promise.all(args.map((item) => expandArgs(item, values)));
  } else if (args !== null && typeof args === "object") {
    const result: Record<string, any> = {};
    for (const key of Object.keys(args))
      result[key] = expandArgs(args[key], values);
    return result;
  }
  return args;
}

function expandString(str: string, values: Record<string, any>): string {
  return str.replace(/\${([^}]+)}/g, (_, path) => {
    const parts = path.split(".");
    let value = values;
    for (const part of parts) {
      if (value == null)
        throw new Error(
          `Cannot expand variable '${path}': path not found. Available values: ${JSON.stringify(
            values
          )}`
        );
      value = value[part];
    }
    if (value == null || typeof value === "object")
      throw new Error(
        `Cannot expand variable '${path}': value is ${
          value === null ? "null" : "an object"
        }. Available values: ${JSON.stringify(values)}`
      );
    return String(value);
  });
}
