<script setup lang="ts">
  import type { MutableTheme, SelectedToken } from '../interface'
  import type { TokenGroup } from '../../meta'

  const props = defineProps<{
    theme: MutableTheme
    group: TokenGroup<string>
    selectedTokens?: SelectedToken
  }>()
</script>
<template></template>
