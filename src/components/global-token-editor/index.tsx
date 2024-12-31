import { defineComponent, ref, type PropType } from 'vue'
import { default as TokenPanelPro, type TokenPanelProps } from '../token-panel-pro'
import type { SelectedToken, Theme } from '../interface'
import { getPrefixCls, useStyle } from './style'

export type GlobalTokenEditorProps = {
  theme: Theme
  infoFollowPrimary?: boolean
  onInfoFollowPrimaryChange?: (checked: boolean) => void
}

export const GlobalTokenEditor = defineComponent({
  name: 'GlobalTokenEditor',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<Theme>, required: true },
    infoFollowPrimary: { type: Boolean }
  },
  emits: {
    infoFollowPrimaryChange: (checked: boolean) => true
  },
  setup(props, { slots, emit }) {
    const prefixCls = getPrefixCls('global-token-editor')
    const [, hashId] = useStyle(prefixCls)

    const selectedTokens = ref<SelectedToken>({ seed: ['colorPrimary'] })

    const onTokenSelect: TokenPanelProps['onTokenSelect'] = (token, type) => {
      const setSelectedTokens = (prev: SelectedToken) => {
        const tokens = typeof token === 'string' ? (token ? [token] : []) : token
        if (type === 'seed') {
          return {
            seed: tokens
          }
        }
        let newSelectedTokens = { ...prev }
        tokens.forEach((newToken) => {
          newSelectedTokens = {
            ...prev,
            [type]: prev[type]?.includes(newToken)
              ? prev[type]?.filter((t) => t !== newToken)
              : [...(prev[type] ?? []), newToken]
          }
        })
        if (type === 'map') {
          delete newSelectedTokens.alias
        }
        return newSelectedTokens
      }
      selectedTokens.value = setSelectedTokens(selectedTokens.value)
    }

    return () => (
      <div class={[prefixCls, hashId.value]}>
        <div style={{ flex: `0 0 480px` }} class={`${prefixCls}-token-panel-wrapper`}>
          <TokenPanelPro
            theme={props.theme}
            style={{ flex: 1 }}
            selectedTokens={selectedTokens.value}
            infoFollowPrimary={props.infoFollowPrimary}
            onTokenSelect={onTokenSelect}
            onInfoFollowPrimaryChange={(checked) =>
              emit('infoFollowPrimaryChange', checked)
            }
          />
        </div>
        <div>{slots.default ? slots.default() : <h1>ComponentDemoPro</h1>}</div>
      </div>
    )
  }
})
