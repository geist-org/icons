
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

