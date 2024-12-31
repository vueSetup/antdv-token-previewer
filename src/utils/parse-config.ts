import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { theme } from 'ant-design-vue'

export type Algorithm = 'dark' | 'compact'

export interface PlainThemeConfig extends Omit<ThemeConfig, 'algorithm'> {
  algorithm?: Algorithm | Algorithm[]
}

export const algorithmMap: {
  [key in Algorithm]: typeof theme.darkAlgorithm
} = {
  dark: theme.darkAlgorithm,
  compact: theme.compactAlgorithm,
}

export const getAlgorithmString = (algorithm: typeof theme.darkAlgorithm) => {
  return Object.entries(algorithmMap).find(([, value]) => value === algorithm)?.[0] as Algorithm
}

export const parsePlainConfig = (config: ThemeConfig): PlainThemeConfig => {
  const { algorithm, ...rest } = config
  if (!algorithm) return rest

  const parsedAlgorithms = Array.isArray(algorithm)
    ? algorithm.map(getAlgorithmString)
    : getAlgorithmString(algorithm)
  return {
    ...rest,
    algorithm: parsedAlgorithms,
  }
}

export const parseThemeConfig = (config: PlainThemeConfig): ThemeConfig => {
  const { algorithm, ...rest } = config
  if (!algorithm) return rest

  const parsedAlgorithms = Array.isArray(algorithm)
    ? algorithm.map((item) => algorithmMap[item]).filter(Boolean)
    : algorithmMap[algorithm]
  return {
    ...rest,
    algorithm: parsedAlgorithms,
  }
}
