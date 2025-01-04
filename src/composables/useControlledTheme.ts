import type { DerivativeFunc } from 'ant-design-vue/es/_util/cssinjs'
import type { SeedToken, MapToken } from 'ant-design-vue/es/theme/interface'
import { theme as antTheme } from 'ant-design-vue'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import type { Ref } from 'vue'
import { watchEffect, ref, computed } from 'vue'
import type { MutableTheme, Theme } from '../components/interface'
import deepUpdateObj from '../utils/deepUpdateObj'
import getValueByPath from '../utils/getValueByPath'

const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = antTheme

export type ThemeCode = 'default' | 'dark' | 'compact'
export const themeMap: Record<ThemeCode, DerivativeFunc<SeedToken, MapToken>> = {
  default: defaultAlgorithm,
  dark: darkAlgorithm,
  compact: compactAlgorithm
}

export type SetThemeState = (
  theme: Theme,
  modifiedPath: string[],
  updated?: boolean
) => void

export type UseControlledTheme = (options: {
  theme?: Ref<Theme | undefined>
  defaultTheme: Theme
  onChange?: (theme: Theme) => void
  darkAlgorithm?: Ref<DerivativeFunc<SeedToken, MapToken>>
}) => {
  theme: Ref<MutableTheme>
  infoFollowPrimary: Ref<boolean>
  onInfoFollowPrimaryChange: (value: boolean) => void
  updateRef: () => void
}

const useControlledTheme: UseControlledTheme = ({
  theme: customTheme,
  defaultTheme,
  onChange
}) => {
  const theme = ref<Theme>(customTheme?.value ?? defaultTheme)
  const infoFollowPrimary = ref<boolean>(false)
  const themeRef = ref<Theme>(theme.value)
  const renderHolder = ref(0)

  const forceUpdate = () => (renderHolder.value = renderHolder.value + 1)

  const getNewTheme = (newTheme: Theme, force?: boolean): Theme => {
    const result = { ...newTheme }
    if (infoFollowPrimary.value || force) {
      const newToken = { ...newTheme.config.token }
      if (newToken.colorPrimary) {
        newToken.colorInfo = newToken.colorPrimary
      } else {
        delete newToken.colorInfo
      }
      if (Object.keys(newToken).length > 0) {
        result.config = {
          ...newTheme.config,
          token: newToken
        }
      } else {
        delete result.config.token
      }
    }
    return result
  }

  const onSetTheme: SetThemeState = (newTheme) => {
    // ??? if (customTheme.value) { onChange?.(getNewTheme(newTheme)) } else { ... }
    onChange?.(getNewTheme(newTheme))
    if (!customTheme) {
      theme.value = getNewTheme(newTheme)
    }
  }

  const onResetTheme = (path: string[]) => {
    let newConfig = { ...theme.value.config }
    newConfig = deepUpdateObj(newConfig, path, getValueByPath(themeRef.value?.config, path))
    onSetTheme({ ...theme.value, config: newConfig }, path)
  }

  const onAbortTheme = (path: string[]) => {
    let newConfig = { ...theme.value.config }
    newConfig = deepUpdateObj(newConfig, path, undefined)
    onSetTheme({ ...theme.value, config: newConfig }, path)
  }

  const getCanReset = (origin: ThemeConfig, current: ThemeConfig) => (path: string[]) => {
    return getValueByPath(origin, path) !== getValueByPath(current, path)
  }

  // Controlled theme change
  watchEffect(() => {
    if (customTheme?.value) {
      theme.value = customTheme?.value
    }
  })

  const onInfoFollowPrimaryChange = (value: boolean) => {
    infoFollowPrimary.value = value
    if (value) {
      theme.value = getNewTheme(theme.value, true)
    }
  }

  return {
    theme: computed(() => ({
      ...theme.value,
      onThemeChange: (config, path) => onSetTheme({ ...theme.value, config }, path),
      onReset: onResetTheme,
      onAbort: onAbortTheme,
      getCanReset: getCanReset(themeRef.value?.config, theme.value.config)
    })),
    infoFollowPrimary,
    onInfoFollowPrimaryChange: onInfoFollowPrimaryChange,
    updateRef: () => {
      themeRef.value = theme.value
      forceUpdate()
    }
  }
}

export default useControlledTheme
