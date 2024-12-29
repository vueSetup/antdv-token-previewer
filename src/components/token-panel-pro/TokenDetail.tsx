import type { GlobalToken } from 'ant-design-vue/es/theme'
import type { MutableTheme, TokenValue } from '../interface'
import { Tooltip } from 'ant-design-vue'
import tokenMeta from 'ant-design-vue/es/version/token-meta.json'
import type { PropType } from 'vue'
import { defineComponent, computed, toRefs } from 'vue'
import { useLocale } from '../locale'
import { mapRelatedAlias } from '../meta/TokenRelation'
import TokenInput from '../TokenInput'
import deepUpdateObj from '../utils/deepUpdateObj'
import getDesignToken from '../utils/getDesignToken'
import getValueByPath from '../utils/getValueByPath'
import makeStyle from '../utils/makeStyle'
import { getRelatedComponents } from '../utils/statistic'

type TokenMeta = Record<string, {
  name: string,
  nameEn: string,
  desc: string,
  descEn: string
}>

const useStyle = makeStyle('TokenDetail', (token) => ({
  [token.componentCls]: {
    '.token-panel-pro-token-collapse-map-collapse-token-description': {
      color: token.colorTextPlaceholder,
      marginBottom: 8,
      fontSize: 12,
    },

    '.token-panel-pro-token-collapse-map-collapse-token-usage-tag-container': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      color: token.colorTextSecondary,
    },

    '.token-panel-pro-token-collapse-map-collapse-token-usage-tag': {
      display: 'inline-block',
      marginInlineEnd: 8,
      borderRadius: 4,
      height: 20,
      padding: '0 8px',
      fontSize: 12,
      lineHeight: '20px',
      backgroundColor: 'rgba(0,0,0,0.015)',
    },

    '.token-panel-pro-token-collapse-map-collapse-token-inputs': {
      padding: '8px 10px',
      backgroundColor: 'rgba(0,0,0,0.02)',
      marginTop: 12,
      '> *:not(:last-child)': {
        marginBottom: 8,
      },
    }
  },
}))

export type TokenDetailProps = {
  themes: MutableTheme[]
  path: string[]
  tokenName: string
}

const TokenDetail = defineComponent({
  props: {
    themes: { type: Array as PropType<MutableTheme[]>, required: true },
    path: { type: Array as PropType<string[]>, required: true },
    tokenName: { type: String, required: true }
  },
  setup(props) {
    const prefixCls = 'token-panel-token-detail'
    const [wrapSSR, hashId] = useStyle(prefixCls)

    const { themes, path, tokenName } = toRefs(props)

    const locale = useLocale()

    const tokenPath = computed(() => [...path.value, tokenName.value])

    const relatedComponents = computed(() => getRelatedComponents([
      tokenName.value, ...(mapRelatedAlias[tokenName.value] ?? [])
    ]))

    const onTokenChange = (theme: MutableTheme) => (value: TokenValue) => {
      theme.onThemeChange?.(
        deepUpdateObj(theme.config, [...path.value, tokenName], value),
        [...path.value, tokenName.value],
      )
    }

    return () => wrapSSR(
      <div
        class={[prefixCls, hashId.value]}
      >
        <div class="token-panel-pro-token-collapse-map-collapse-token-description">
          {
            (tokenMeta as TokenMeta)[tokenName.value]?.[
            locale.value._lang === 'zh-CN' ? 'desc' : 'descEn'
            ]
          }
        </div>
        {relatedComponents.value.length > 0 && (
          <Tooltip
            title={getRelatedComponents(tokenName.value).join(', ')}
            placement="topLeft"
          >
            <div class="token-panel-pro-token-collapse-map-collapse-token-usage-tag-container">
              {relatedComponents.value.map((item) => (
                <span
                  key={item}
                  class="token-panel-pro-token-collapse-map-collapse-token-usage-tag"
                >
                  {item}
                </span>
              ))}
            </div>
          </Tooltip>
        )}
        <div class="token-panel-pro-token-collapse-map-collapse-token-inputs">
          {themes.value.map((themeItem) => {
            return (
              <div key={themeItem.key}>
                <TokenInput
                  hideTheme={themes.value.length === 1}
                  theme={themeItem}
                  canReset={themeItem.getCanReset?.(tokenPath.value)}
                  onReset={() => themeItem.onReset?.(tokenPath.value)}
                  onChange={onTokenChange(themeItem)}
                  value={
                    getValueByPath(themeItem.config, tokenPath) ??
                    getDesignToken(themeItem.config)[tokenName.value as keyof GlobalToken]
                  }
                />
              </div>
            );
          })}
        </div>
      </div>,
    )
  }
})

export default TokenDetail
