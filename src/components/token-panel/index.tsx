import {
  defineComponent,
  ref,
  computed,
  watchEffect,
  type PropType,
  type CSSProperties
} from 'vue'
import type { Theme, SelectedToken } from '../interface'
import { tokenCategory, type TokenGroup } from '../meta'
import { Anchor } from 'ant-design-vue'
import TokenContent from '../token-panel-pro/TokenContent'
import { useLocale } from '../locale'
import { getPrefixCls, useStyle } from './style'

export type TokenPanelProps = {
  theme: Theme
  selectedTokens?: SelectedToken
  infoFollowPrimary?: boolean
  activeTheme?: string
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void
  onInfoFollowPrimaryChange?: (value: boolean) => void
  onAliasOpenChange?: (value: boolean) => void // ???
}

export const TokenPanel = defineComponent({
  name: 'TokenPanel',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<Theme>, required: true },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    infoFollowPrimary: { type: Boolean },
    activeTheme: { type: String } // ???
  },
  emits: {
    tokenSelect: (token: string | string[], type: keyof SelectedToken) => true,
    infoFollowPrimaryChange: (value: boolean) => true,
    aliasOpenChange: (value: boolean) => true // ???
  },
  setup(props, { attrs, emit }) {
    const prefixCls = getPrefixCls('token-panel')
    const [wrapSSR, hashId] = useStyle(prefixCls)

    // const { theme, selectedTokens, infoFollowPrimary } = toRefs(props)

    const locale = useLocale()
    const tokenListRef = ref<HTMLElement>()
    const activeGroup = ref<string>('brandColor')

    const activeCategory = computed(() => {
      return tokenCategory.reduce<TokenGroup<string> | undefined>((result, category) => {
        return result ?? category.groups.find((group) => group.key === activeGroup.value)
      }, undefined)
    })

    const onTokenSelect = (token: string | string[], type: keyof SelectedToken) => {
      emit('tokenSelect', token, type)
    }

    const onInfoFollowPrimaryChange = (value: boolean) => {
      emit('infoFollowPrimaryChange', value)
    }

    // ???
    const onAliasOpenChange = (value: boolean) => {
      emit('aliasOpenChange', value)
    }

    watchEffect(() => {
      onTokenSelect(activeCategory.value?.seedToken ?? [], 'seed')
    })

    return () =>
      wrapSSR(
        <div
          class={[prefixCls, hashId.value, attrs.class]}
          style={attrs.style as CSSProperties}
        >
          <div class={`${prefixCls}-content`}>
            <Anchor
              affix={false}
              direction="horizontal"
              getContainer={() => tokenListRef.value!}
              onChange={(key) => {
                activeGroup.value =
                  tokenCategory.find((category) => category.nameEn === key)?.groups[0]
                    .key ?? ''
              }}
              items={tokenCategory.map((category) => ({
                key: category.nameEn,
                title: locale.value._lang === 'zh-CN' ? category.name : category.nameEn,
                href: `#${category.nameEn}`
              }))}
            />
            <div class={`${prefixCls}-list`} ref={tokenListRef}>
              {tokenCategory.map((category) => (
                <TokenContent
                  id={category.nameEn}
                  key={category.nameEn}
                  category={category}
                  theme={props.theme}
                  selectedTokens={props.selectedTokens}
                  infoFollowPrimary={props.infoFollowPrimary}
                  activeGroup={activeGroup.value}
                  onTokenSelect={onTokenSelect}
                  onInfoFollowPrimaryChange={onInfoFollowPrimaryChange}
                  onActiveGroupChange={(value) => (activeGroup.value = value)}
                />
              ))}
            </div>
          </div>
        </div>
      )
  }
})
