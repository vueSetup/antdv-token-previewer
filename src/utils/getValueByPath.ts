export default function getValueByPath(
  obj: Record<string, unknown>,
  path: string[],
): unknown {
  if (!obj) {
    return undefined
  }
  return path.reduce((prev, key) => {
    if (prev) {
      return prev[key]
    }
    return undefined
  }, obj)
}
