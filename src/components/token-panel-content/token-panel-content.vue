<script setup lang="ts">
  import { defineComponent, ref, toRefs } from 'vue'
  import {
    Collapse,
    ConfigProvider,
    Switch,
    theme as antdvTheme,
    Tooltip
  } from 'ant-design-vue'
  import { CaretRightOutlined, ExpandOutlined } from '@ant-design/icons-vue'
  import { Light, DarkTheme, CompactTheme } from '../icons'
  import { getPrefixCls, useStyle } from './style'
  import type { TokenCategory } from '../../meta'
  import type { AliasToken, MutableTheme, SelectedToken } from '../interface'

  const { Panel } = Collapse

  type TokenMeta = Record<
    string,
    {
      name: string
      nameEn: string
      desc: string
      descEn: string
    }
  >

  const { id } = defineProps<{
    id: string
    category: TokenCategory<string>
    theme: MutableTheme
    selectedTokens?: SelectedToken
    infoFollowPrimary?: boolean
    activeGroup: string
  }>()

  const className = getPrefixCls('token-panel-content')
  const [, hashId] = useStyle(className)
</script>
<template>
  <div
    :id="id"
    :class="[`${className}-color`, hashId]"
  ></div>
</template>
