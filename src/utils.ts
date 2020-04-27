
export const moduleBabelConfig = {
  presets: ['@babel/preset-react', '@babel/preset-env'],
  minified: true
}

export const allModulesBabelConfig = {
  presets: ['@babel/preset-env'],
  minified: true
}

export const replaceAll = (
  target: string,
  find: string,
  replace: string,
): string => {
  return target.split(find).join(replace)
}

export const toHumpName = (name: string): string => {
  return name.replace(/-(.)/g, (g) => g[1].toUpperCase())
}

export const toComponentName = (name: string): string => {
  const first = name.slice(0, 1).toUpperCase()
  const last = toHumpName(name.slice(1))
  return `${first}${last}`
}


