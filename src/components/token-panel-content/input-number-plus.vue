<script setup lang="ts">
  import { Slider, InputNumber } from 'ant-design-vue'

  const { min, max } = defineProps<{
    min: number
    max: number
  }>()

  const value = defineModel<number>('value')
</script>
<template>
  <div :style="{ display: 'flex', width: 200 }">
    <slider
      :style="{ flex: '0 0 120px', marginRight: 12 }"
      :min="min"
      :max="max"
      v-model:value="value"
    />
    <input-number
      :style="{ flex: '1' }"
      :min="min"
      :max="max"
      v-model:value="value"
    />
  </div>
</template>
