<script setup lang="ts">
  import { TinyColor } from '@ctrl/tinycolor'
  import getDesignToken from '../../utils/getDesignToken'
  import getColorBgImg from '../../utils/getColorBgImg'
  import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
  import type { GlobalToken } from 'ant-design-vue/es/theme'

  const { theme, tokenName, type } = defineProps<{
    theme: ThemeConfig
    tokenName: keyof GlobalToken
    type?: string
  }>()

  const { colorBgContainer } = getDesignToken(theme)
  const isDark = new TinyColor(colorBgContainer).getBrightness() < 50
  const colorBgImg = getColorBgImg(isDark)
  const tokenValue = getDesignToken(theme)[tokenName] as string
</script>
<template>
  <template v-if="type === 'Color'">
    <div
      :style="{
        background: `${colorBgImg} 0% 0% / 28px`,
        width: '100%',
        height: '100%',
        position: 'relative'
      }"
    >
      <div
        :style="{
          height: '100%',
          width: '100%',
          backgroundColor: tokenValue,
          transition: 'background-color 0.2s'
        }"
      />
    </div>
  </template>
  <template v-if="type === 'LineHeight'">
    <div
      :style="{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        overflow: 'hidden',
        background: `${colorBgImg} 0% 0% / 28px`
      }"
    >
      <span
        :style="{
          fontSize: getDesignToken(theme)[
            tokenName.replace('lineHeight', 'fontSize') as keyof GlobalToken
          ] as number,
          lineHeight: tokenValue,
          background: '#fff2f0',
          paddingInline: 8
        }"
      >
        Aa
      </span>
    </div>
  </template>
  <template v-if="type === 'Margin'">
    <div
      :style="{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `${colorBgImg} 0% 0% / 28px`
      }"
    >
      <div
        :style="{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#fff1b8',
          transform: 'translate(10%, 10%) scale(0.8)'
        }"
      >
        <div
          :style="{
            marginLeft: tokenValue,
            marginTop: tokenValue,
            width: `calc(100% - ${tokenValue}px)`,
            height: `calc(100% - ${tokenValue}px)`,
            background: '#bae0ff'
          }"
        />
      </div>
    </div>
  </template>
  <template v-if="type === 'Padding'">
    <div
      :style="{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `${colorBgImg} 0% 0% / 28px`
      }"
    >
      <div
        :style="{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#d9f7be',
          transform: 'translate(10%, 10%) scale(0.8)',
          paddingLeft: tokenValue,
          paddingTop: tokenValue
        }"
      >
        <div
          :style="{
            width: `100%`,
            height: `100%`,
            background: '#bae0ff'
          }"
        />
      </div>
    </div>
  </template>
  <template v-if="type === 'BorderRadius'">
    <div
      :style="{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `${colorBgImg} 0% 0% / 28px`
      }"
    >
      <div
        :style="{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          transform: 'translate(30%, 30%)',
          border: '2px solid rgba(0,0,0,0.45)',
          background: '#fff',
          borderRadius: tokenValue
        }"
      />
    </div>
  </template>
  <template v-if="type === 'BoxShadow'">
    <div
      :style="{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${colorBgImg} 0% 0% / 28px`
      }"
    >
      <div
        :style="{
          width: '60%',
          height: '50%',
          borderRadius: 6,
          background: '#fff',
          border: '1px solid #d9d9d9',
          boxShadow: tokenValue
        }"
      />
    </div>
  </template>
</template>
