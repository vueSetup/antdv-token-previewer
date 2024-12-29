import type { PropType } from 'vue'
import { defineComponent, toRefs, ref } from 'vue'
import type { SelectedToken, Theme } from './interface'
import type { TokenPanelProps } from './token-panel-pro'
import TokenPanelPro from './token-panel-pro'
// import ComponentDemoPro from './token-panel/ComponentDemoPro'
import makeStyle from './utils/makeStyle'

const useStyle = makeStyle('GlobalTokenEditor', (token) => ({
  [token.componentCls]: {
    display: 'flex',
    height: '100%',
    [`${token.componentCls}-token-panel-wrapper`]: {
      backgroundColor: token.colorBgContainer,
      height: '100%',
      backgroundImage:
        'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0, 0, 0, 0.02) 100%)',
      display: 'flex',
      transition: 'all 0.3s',
    }
  }
}))

export type GlobalTokenEditorProps = {
  theme: Theme
  infoFollowPrimary?: boolean
  onInfoFollowPrimaryChange?: (checked: boolean) => void
}

const GlobalTokenEditor = defineComponent({
  name: 'GlobalTokenEditor',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<Theme>, required: true },
    infoFollowPrimary: { type: Boolean },
  },
  emits: {
    'infoFollowPrimaryChange': (checked: boolean) => true,
  },
  setup(props, { emit }) {
    const prefixCls = 'antd-global-token-editor'
    const [, hashId] = useStyle(prefixCls)

    const { theme, infoFollowPrimary } = toRefs(props)

    const selectedTokens = ref<SelectedToken>({
      seed: ['colorPrimary'],
    })

    const onTokenSelect: TokenPanelProps['onTokenSelect'] = (token, type) => {
      const setSelectedTokens = (prev: SelectedToken) => {
        const tokens = typeof token === 'string' ? (token ? [token] : []) : token

        if (type === 'seed') {
          return {
            seed: tokens,
          }
        }

        let newSelectedTokens = { ...prev }
        tokens.forEach((newToken) => {
          newSelectedTokens = {
            ...prev,
            [type]: prev[type]?.includes(newToken)
              ? prev[type]?.filter((t) => t !== newToken)
              : [...(prev[type] ?? []), newToken],
          }
        })
        if (type === 'map') {
          delete newSelectedTokens.alias
        }
        return newSelectedTokens
      }

      selectedTokens.value = setSelectedTokens(selectedTokens.value)
    }

    const onInfoFollowPrimaryChange = (checked: boolean) => {
      emit('infoFollowPrimaryChange', checked)
    }

    return () => (
      <div class={[prefixCls, hashId.value]}>
        <div style={{ flex: `0 0 480px` }} class={`${prefixCls}-token-panel-wrapper`}>
          <TokenPanelPro
            theme={theme.value}
            style={{ flex: 1 }}
            selectedTokens={selectedTokens.value}
            infoFollowPrimary={infoFollowPrimary.value}
            onTokenSelect={onTokenSelect}
            onInfoFollowPrimaryChange={onInfoFollowPrimaryChange}
          />
        </div>
        {/* 
        {children || (
          <ComponentDemoPro
            theme={theme}
            style={{ flex: 1, overflow: 'auto', height: '100%' }}
          />
        )} 
         */}
        <div>Component Demo Pro</div>
      </div>
    )
  },
})

export default GlobalTokenEditor
