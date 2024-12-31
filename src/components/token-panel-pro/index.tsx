import { Anchor } from 'ant-design-vue'
import type { Theme, SelectedToken } from '../interface'
import type { PropType, CSSProperties } from 'vue'
import { defineComponent, toRefs, ref, computed, watchEffect } from 'vue'
import { useLocale } from '../../locale'
import { tokenCategory } from '../../meta'
import type { TokenGroup } from '../../meta/interface'
import makeStyle from '../../utils/makeStyle'
import TokenContent from './TokenContent'

const useStyle = makeStyle('TokenPanelPro', (token) => ({
  [token.componentCls]: {
    width: '100%',
    height: '100%',
    display: 'flex',
    borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
    [`${token.componentCls}-content`]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',

      [`${token.rootCls}-anchor-wrapper`]: {
        padding: '0px 16px'
      },

      [`${token.rootCls}-anchor`]: {
        padding: '10px 0'
      },

      [`${token.componentCls}-list`]: {
        overflow: 'auto'
      }
    }
  }
}))

export type TokenPanelProps = {
  theme: Theme
  selectedTokens?: SelectedToken
  infoFollowPrimary?: boolean
  activeTheme?: string
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void
  onInfoFollowPrimaryChange?: (value: boolean) => void
  onAliasOpenChange?: (value: boolean) => void // ???
}

const TokenPanelPro = defineComponent({
  name: 'TokenPanelPro',
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
    const prefixCls = 'token-panel-pro'
    const [wrapSSR, hashId] = useStyle(prefixCls)

    const { theme, selectedTokens, infoFollowPrimary } = toRefs(props)

    const locale = useLocale()

    const activeGroup = ref<string>('brandColor')

    const tokenListRef = ref<HTMLDivElement>()

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
          <div class="token-panel-pro-content">
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
            <div class="token-panel-pro-list" ref={tokenListRef}>
              {tokenCategory.map((category) => (
                <TokenContent
                  id={category.nameEn}
                  key={category.nameEn}
                  category={category}
                  theme={theme}
                  selectedTokens={selectedTokens}
                  infoFollowPrimary={infoFollowPrimary}
                  activeGroup={activeGroup}
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

export default TokenPanelPro
