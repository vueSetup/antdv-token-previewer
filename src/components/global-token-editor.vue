<script setup lang="ts">
import { ref } from 'vue'
// import { TokenPanel } from '../token-panel'
import TokenPanel from './token-panel/token-panel.vue'
import { getPrefixCls } from '../utils/makeStyle'
import { useStyle } from './global-token-editor.vue.ts'
import type { SelectedToken, Theme } from './interface'

export type GlobalTokenEditorProps = {
  theme: Theme
  infoFollowPrimary?: boolean
  // onInfoFollowPrimaryChange?: (checked: boolean) => void
  'update:infoFollowPrimaryChange'?: (checked: boolean) => void
}

const infoFollowPrimary = defineModel<boolean>('infoFollowPrimary')

const { theme } = defineProps<{ theme: Theme }>()

const selectedTokens = ref<SelectedToken>({ seed: ['colorPrimary'] })

const onTokenSelect = (token: string | string[], type: keyof SelectedToken) => {
  const setSelectedTokens = (prev: SelectedToken) => {
    const tokens = typeof token === 'string' ? (token ? [token] : []) : token
    if (type === 'seed') {
      return {
        seed: tokens
      }
    }
    let newSelectedTokens = { ...prev }
    tokens.forEach((newToken) => {
      newSelectedTokens = {
        ...prev,
        [type]: prev[type]?.includes(newToken)
          ? prev[type]?.filter((t) => t !== newToken)
          : [...(prev[type] ?? []), newToken]
      }
    })
    if (type === 'map') {
      delete newSelectedTokens.alias
    }
    return newSelectedTokens
  }
  selectedTokens.value = setSelectedTokens(selectedTokens.value)
}

const className = getPrefixCls('global-token-editor')
const [, hashId] = useStyle(className)
</script>
<template>
  <div :class="[className, hashId]">
    <div :style="{ flex: `0 0 480px` }" :class="`${className}-token-panel-wrapper`">
      <token-panel :style="{ flex: 1 }" :theme="theme" :selected-tokens="selectedTokens" @token-select="onTokenSelect"
        v-model:info-follow-primary="infoFollowPrimary" />
    </div>
    <div>
      <slot>ComponentDemoPro</slot>
    </div>
  </div>
</template>
