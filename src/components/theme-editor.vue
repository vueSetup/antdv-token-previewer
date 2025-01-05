<script setup lang="ts">
import GlobalTokenEditor from './global-token-editor.vue'
import { LocaleContext, zhCN } from '../locale'
import { useControlledTheme } from '../composables'
import { getPrefixCls } from '../utils/makeStyle'
import { useStyle } from './theme-editor.vue.ts'
import type { VNode } from 'vue'
import type { DerivativeFunc } from 'ant-design-vue/es/_util/cssinjs'
import type { SeedToken, MapToken } from 'ant-design-vue/es/theme/interface'
import type { Theme } from './interface'
import type { Locale } from '../locale'

export type ThemeEditorProps = {
  theme?: Theme
  darkAlgorithm?: DerivativeFunc<SeedToken, MapToken>
  locale?: Locale
  // onThemeChange?: (theme: Theme) => void
  'update:theme'?: (theme: Theme) => void
}

export type ThemeEditorMode = 'global' | 'component'

const defaultTheme: Theme = {
  name: '默认主题',
  key: 'default',
  config: {}
}

// const theme = defineModel<Theme>('theme')

const { theme: customTheme, locale = zhCN } = defineProps<{
  theme?: Theme
  locale?: Locale
  darkAlgorithm?: DerivativeFunc<SeedToken, MapToken>
  actions?: VNode
  mode?: ThemeEditorMode
  advanced?: boolean
  hideAdvancedSwitcher?: boolean
}>()

const emit = defineEmits<{
  modeChange: [mode: ThemeEditorMode]
  // themeChange: [theme: Theme]
  'update:theme': [theme: Theme]
  advancedChange: [advanced: boolean]
}>()

const { theme, infoFollowPrimary, onInfoFollowPrimaryChange, updateRef } =
  useControlledTheme({
    theme: customTheme,
    defaultTheme,
    onChange: (theme) => emit('update:theme', theme)
    // darkAlgorithm,
  })

const className = getPrefixCls('theme-editor')
const [, hashId] = useStyle(className)
</script>
<template>
  <LocaleContext.Provider :value="locale">
    <div :class="[className, hashId]">
      <div :class="`${className}-header`">
        <div :class="`${className}-header-actions`"></div>
      </div>
      <div :class="`${className}-body`">
        <global-token-editor :theme="theme" v-model:info-follow-primary="infoFollowPrimary" />
      </div>
    </div>
  </LocaleContext.Provider>
</template>
