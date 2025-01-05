<script setup lang="ts">
  import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
  import type { MutableTheme } from '../interface'

  const props = defineProps<{
    theme: MutableTheme
    tokenName: string
    disabled?: boolean
  }>()
</script>
<template></template>
