<script setup lang="ts">
  import { ref, computed, watchEffect, useTemplateRef } from 'vue'
  import { Anchor, Tabs, TabPane } from 'ant-design-vue'
  import { TokenPanelContent } from '../token-panel-content'
  import { useLocale } from '../../locale'
  import { getPrefixCls, useStyle } from './style'
  import { tokenCategory as categories, type TokenGroup } from '../../meta'
  import type { Theme, SelectedToken } from '../interface'

  defineProps<{
    theme: Theme
    selectedTokens?: SelectedToken
    infoFollowPrimary?: boolean
    activeTheme?: string
  }>()

  const emit = defineEmits<{
    tokenSelect: [token: string | string[], type: keyof SelectedToken]
    infoFollowPrimaryChange: [checked: boolean]
  }>()

  const className = getPrefixCls('token-panel')
  const [, hashId] = useStyle(className)
  const locale = useLocale()

  const listRef = useTemplateRef<HTMLDivElement>('list')
  const activeGroup = ref<string>('brandColor')

  const activeCategory = computed(() => {
    return categories.reduce<TokenGroup<string> | undefined>((result, category) => {
      return result ?? category.groups.find((group) => group.key === activeGroup.value)
    }, undefined)
  })

  const onTokenSelect = (token: string | string[], type: keyof SelectedToken) => {
    emit('tokenSelect', token, type)
  }
  const onInfoFollowPrimaryChange = (checked: boolean) => {
    emit('infoFollowPrimaryChange', checked)
  }
  const onActiveGroupChange = (group: string) => {
    activeGroup.value = group
  }

  watchEffect(() => {
    onTokenSelect(activeCategory.value?.seedToken ?? [], 'seed')
  })
</script>
<template>
  <div :class="[className, hashId]">
    <div :class="`${className}-content`">
      <anchor
        direction="horizontal"
        :affix="false"
        :getContainer="() => listRef!"
        :items="
          categories.map((category) => ({
            key: category.nameEn,
            title: locale._lang === 'zh-CN' ? category.name : category.nameEn,
            href: `#${category.nameEn}`
          }))
        "
        @change="
          (key: string) => {
            activeGroup =
              categories.find((category) => category.nameEn === key)?.groups[0].key ?? ''
          }
        "
      />
      <div
        :class="`${className}-list`"
        ref="list"
      >
        <token-panel-content
          v-for="category in categories"
          :id="category.nameEn"
          :key="category.nameEn"
          :category="category"
          :theme="theme"
          :selected-tokens="selectedTokens"
          :info-follow-primary="infoFollowPrimary"
          :activeGroup="activeGroup"
          @token-select="onTokenSelect"
          @info-follow-primary-change="onInfoFollowPrimaryChange"
          @active-group-change="onActiveGroupChange"
        />
      </div>
      <!-- <tabs
        :tab-bar-gutter="18"
        :tab-bar-style="{ padding: '0 16px', margin: 0 }"
        :style="{ height: '100%', flex: '0 0 540px' }"
      >
        <tab-pane
          v-for="category in categories"
          :key="category.nameEn"
          :tab="locale._lang === 'zh-CN' ? category.name : category.nameEn"
        >
          <token-panel-content
            :id="category.nameEn"
            :category="category"
            :theme="theme"
            :selected-tokens="selectedTokens"
            :info-follow-primary="infoFollowPrimary"
            :activeGroup="activeGroup"
            @token-select="onTokenSelect"
            @info-follow-primary-change="onInfoFollowPrimaryChange"
            @active-group-change="onActiveGroupChange"
          />
        </tab-pane>
      </tabs> -->
    </div>
  </div>
</template>
