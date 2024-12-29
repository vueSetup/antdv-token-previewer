const deepUpdateObj = (
  obj: Record<string, unknown>,
  path: string[],
  value: unknown,
): Record<string, unknown> => {
  if (path.length === 0) {
    return obj
  }
  if (path.length === 1) {
    if (value === null || value === undefined) {
      const newObj = { ...obj }
      delete newObj[path[0]]
      return newObj
    }
    return {
      ...obj,
      [path[0]]: value,
    }
  }

  const pathValue = deepUpdateObj(obj[path[0]] ?? {}, path.slice(1), value)
  if (pathValue === null || pathValue === undefined || Object.keys(pathValue).length === 0) {
    const newObj = { ...obj }
    delete newObj[path[0]]
    return newObj
  }
  return {
    ...obj,
    [path[0]]: pathValue,
  }
}

export default deepUpdateObj
