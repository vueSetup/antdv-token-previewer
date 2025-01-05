<script setup lang="ts">
  import { Typography } from 'ant-design-vue'
  import { useLocale } from '../../locale'
  import type { AliasToken, MutableTheme } from '../interface'

  const { theme, tokenName } = defineProps<{
    theme: MutableTheme
    tokenName: keyof AliasToken
  }>()

  const locale = useLocale()
  const showReset = theme.config.token?.[tokenName]

  const onResetToken = () => {
    theme.onAbort?.(['token', tokenName])
  }
</script>
<template>
  <div :style="{ display: 'inline-block' }">
    <Typography.Link
      :style="{
        fontSize: 12,
        padding: 0,
        opacity: showReset ? 1 : 0,
        pointerEvents: showReset ? 'auto' : 'none'
      }"
      @click="onResetToken"
    >
      {{ locale.reset }}
    </Typography.Link>
  </div>
</template>
