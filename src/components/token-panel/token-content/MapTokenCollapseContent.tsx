import { defineComponent, toRefs, type PropType } from 'vue'
import { TokenPreview } from './TokenPreview'
import { SeedTokenPreview } from './SeedTokenPreview'
import { ResetTokenButton } from './ResetTokenButton'
import { useLocale } from '../../../locale'
import getDesignToken from '../../../utils/getDesignToken'
import tokenMeta from 'ant-design-vue/es/version/token-meta.json'
import { HIGHLIGHT_COLOR } from '../../../utils/constants'
import type { AliasToken, MutableTheme, SelectedToken } from '../../interface'

export type MapTokenCollapseContentProps = {
  theme: MutableTheme
  mapTokens?: string[]
  selectedTokens?: SelectedToken // ???
  type?: string
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void // ???
}

export const MapTokenCollapseContent = defineComponent({
  name: 'MapTokenCollapseContent',
  props: {
    theme: { type: Object as PropType<MutableTheme>, required: true },
    mapTokens: { type: Array as PropType<string[]> },
    selectedTokens: { type: Object as PropType<SelectedToken> }, // ???
    type: { type: String }
  },
  emits: {
    tokenSelect: (token: string | string[], type: keyof SelectedToken) => true // ???
  },
  setup(props, { emit }) {
    const { theme, mapTokens, type } = toRefs(props)

    const locale = useLocale()

    const getMapTokenColor = (token: string) =>
      !!theme.value.config.token?.[token as keyof AliasToken] ? HIGHLIGHT_COLOR : ''

    // ???
    const onTokenSelect = (token: string | string[], type: keyof SelectedToken) => {
      emit('tokenSelect', token, type)
    }

    return () => (
      <>
        {mapTokens.value?.map((mapToken) => (
          <div
            class="token-panel-pro-token-collapse-map"
            style={{ display: 'flex', alignItems: 'center' }}
            key={mapToken}
          >
            <div
              style={{
                flex: 1,
                whiteSpace: 'nowrap',
                width: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                marginRight: 8
              }}
            >
              {locale.value._lang === 'zh-CN' && (
                <span
                  style={{
                    fontWeight: 500,
                    flex: 'none',
                    color: getMapTokenColor(mapToken)
                  }}
                >
                  {(tokenMeta.global as any)[mapToken]?.name}
                </span>
              )}
              <span
                class="token-panel-pro-token-collapse-map-collapse-token"
                style={{ flex: 'none', color: getMapTokenColor(mapToken) }}
              >
                {mapToken}
              </span>
              <ResetTokenButton theme={theme} tokenName={mapToken} />
            </div>
            <span
              title={getDesignToken(theme.value.config)[mapToken]}
              class="token-panel-pro-token-collapse-map-collapse-count"
            >
              {getDesignToken(theme.value.config)[mapToken]}
            </span>
            <SeedTokenPreview theme={theme.value} tokenName={mapToken}>
              <div class="token-panel-pro-token-collapse-map-collapse-preview">
                <div class="token-panel-pro-token-collapse-map-collapse-preview-color">
                  <TokenPreview
                    theme={theme.value.config}
                    tokenName={mapToken}
                    type={type.value}
                  />
                </div>
              </div>
            </SeedTokenPreview>
          </div>
        ))}
      </>
    )
  }
})
