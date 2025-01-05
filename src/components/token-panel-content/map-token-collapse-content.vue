<script setup lang="ts">
  import { SeedTokenPreview } from './SeedTokenPreview'
  import { HIGHLIGHT_COLOR } from '../../utils/constants'
  import tokenMeta from 'ant-design-vue/es/version/token-meta.json'
  import getDesignToken from '../../utils/getDesignToken'
  import type { GlobalToken } from 'ant-design-vue/es/theme'
  import type { AliasToken, MutableTheme, SelectedToken } from '../interface'

  const { theme, mapTokens, type, selectedTokens } = defineProps<{
    theme: MutableTheme
    mapTokens?: string[]

    type?: string
    selectedTokens?: SelectedToken // ???
  }>()

  const prefixCls = 'antdv-token-panel-content'

  const getTokenValue = (tokenName: string) =>
    getDesignToken(theme.config)[tokenName as keyof GlobalToken] as string

  const getTokenColor = (tokenName: string) =>
    !!theme.config.token?.[tokenName as keyof AliasToken] ? HIGHLIGHT_COLOR : ''
</script>
<template>
  <div
    v-for="mapToken in mapTokens"
    :key="mapToken"
    :class="[`${prefixCls}-token-collapse-map`]"
    :style="{ display: 'flex', alignItems: 'center' }"
  >
    <div
      :style="{
        flex: 1,
        whiteSpace: 'nowrap',
        width: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        marginRight: 8
      }"
    >
      <span
        :style="{
          fontWeight: 500,
          flex: 'none',
          color: getTokenColor(mapToken)
        }"
      >
        {{ tokenMeta[mapToken as keyof typeof tokenMeta]?.name }}
      </span>
      <span
        :class="`${prefixCls}-token-collapse-map-collapse-token`"
        :style="{
          flex: 'none',
          color: getTokenColor(mapToken)
        }"
      >
        {{ mapToken }}
      </span>
      <reset-token-button
        :theme="theme"
        :tokenName="mapToken"
      />
    </div>
    <span
      :class="`${prefixCls}-token-collapse-map-collapse-count`"
      :title="getTokenValue(mapToken)"
    >
      {{ getTokenValue(mapToken) }}
    </span>
    <seed-token-preview
      :theme="theme"
      :tokenName="mapToken"
    >
      <div :class="`${prefixCls}-token-collapse-map-collapse-preview`">
        <div :class="`${prefixCls}-token-collapse-map-collapse-preview-color`">
          <token-preview
            :theme="theme.config"
            :tokenName="mapToken"
            :type="type"
          />
        </div>
      </div>
    </seed-token-preview>
  </div>
</template>
