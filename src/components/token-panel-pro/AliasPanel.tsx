import {
  CaretRightOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  ShrinkOutlined,
} from '@ant-design/icons-vue'
import { Button, Collapse, Empty, Tooltip } from 'ant-design-vue'
import type { MutableTheme, AliasToken, SelectedToken } from '../interface'
import type { PropType } from 'vue'
import { defineComponent, toRefs, ref, computed, watchEffect } from 'vue'
import { Pick } from '../icons'
import { mapRelatedAlias, seedRelatedAlias } from '../meta/TokenRelation'
import makeStyle from '../utils/makeStyle'
import { getRelatedComponents } from '../utils/statistic'
import TokenDetail from './TokenDetail'

const { Panel } = Collapse

const useStyle = makeStyle('TokenPanelProAlias', (token) => ({
  [token.componentCls]: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 45,
    borderTop: `1px solid ${token.colorSplit}`,

    [`${token.componentCls}-title`]: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      flex: '0 0 60px',

      '&-text': {
        fontSize: token.fontSizeLG,
        fontWeight: token.fontWeightStrong,
      },
    },

    [`${token.componentCls}-description`]: {
      color: token.colorTextTertiary,
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeightSM,
      padding: '0 16px 12px',
    },

    [`.token-panel-pro-alias-collapse${token.rootCls}-collapse`]: {
      [`> ${token.rootCls}-collapse-item > ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]:
      {
        paddingBlock: '0',
      },

      [`> ${token.rootCls}-collapse-item`]: {
        [`> ${token.rootCls}-collapse-header`]: {
          alignItems: 'center',
          padding: '8px 16px',
          [`> ${token.rootCls}-collapse-header-text`]: {
            flex: 1,

            '.token-panel-pro-token-collapse-map-collapse-count': {
              color: token.colorTextSecondary,
              display: 'inline-block',
              fontSize: 12,
              lineHeight: '16px',
              padding: '0 6px',
              backgroundColor: token.colorFillAlter,
              borderRadius: 999,
            },
          },

          '.token-panel-pro-token-picked': {
            color: token.colorPrimary,
          },
        },
      },
    },

    [`${token.componentCls}-expand`]: {
      height: '100%',
      width: 20,
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '&:hover': {
        [`${token.componentCls}-expand-handler`]: {
          opacity: 1,
        },
      },

      [`${token.componentCls}-expand-handler`]: {
        height: 100,
        width: 16,
        borderRadius: 999,
        border: `1px solid ${token.colorSplit}`,
        backgroundColor: '#fff',
        margin: 'auto',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'box-shadow 0.2s',

        '&:hover': {
          boxShadow: token.boxShadow,
        },
      },
    },
  }
}))

export type AliasPanelProps = {
  theme: MutableTheme
  activeSeeds?: string[]
  selectedTokens?: SelectedToken
  open?: boolean
  description?: string
  onTokenSelect?: (token: string, type: keyof SelectedToken) => void
  onOpenChange?: (open: boolean) => void // ??
}

const AliasPanel = defineComponent({
  name: 'AliasPanel',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<MutableTheme>, required: true },
    activeSeeds: { type: Array as PropType<string[]> },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    open: { type: Boolean },
    description: { type: String },
  },
  emits: {
    'token-select': (token: string, type: keyof SelectedToken) => true,
    'open-change': (open: boolean) => true,
  },
  setup(props, { attrs, emit }) {
    const prefixCls = 'token-panel-pro-color-alias'
    const [wrapSSR, hashId] = useStyle(prefixCls)

    const {
      theme,
      activeSeeds,
      selectedTokens,
      open: customOpen,
      description,
    } = toRefs(props)

    const open = ref(customOpen.value ?? true)

    watchEffect(() => {
      open.value = customOpen.value
      emit('open-change', customOpen.value)
    })

    const shownAlias = computed(() =>
      selectedTokens.value?.map?.length
        ? Array.from(
          new Set(
            selectedTokens.value?.map.reduce<string[]>((result, map) => {
              return result.concat(...(mapRelatedAlias[map] ?? []))
            }, []),
          ),
        )
        : activeSeeds.value?.reduce<(keyof AliasToken)[]>(
          (result, item) => result.concat(seedRelatedAlias[item] ?? []),
          [],
        ),
    )

    const onTokenSelect = (token: string, type: keyof SelectedToken) => {
      emit('token-select', token, type)
    }

    return () =>
      wrapSSR(
        <div
          {...attrs}
          class={[prefixCls, hashId.value]}
        >
          {open.value ? (
            <>
              <div class={`${prefixCls}-title`}>
                <span class={`${prefixCls}-title-text`}>Alias Token</span>
                <Tooltip
                  placement="topLeft"
                  arrowPointAtCenter
                  title="别名变量（Alias Token）是 Map Token 的别名。Alias Token 用于批量控制某些共性组件的样式。"
                >
                  <QuestionCircleOutlined style={{ fontSize: 14, marginLeft: 4 }} />
                </Tooltip>
                <Button
                  type="text"
                  icon={<ShrinkOutlined />}
                  style={{ marginLeft: 'auto' }}
                  onClick={() => {
                    open.value = false
                  }}
                />
              </div>
              {description.value && (
                <div class={`${prefixCls}-description`}>{description}</div>
              )}
              <div style={{ flex: 1, overflow: 'auto' }}>
                <Collapse
                  class="token-panel-pro-alias-collapse"
                  ghost
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined
                      rotate={isActive ? 90 : 0}
                      style={{ fontSize: 12 }}
                    />
                  )}
                >
                  {shownAlias.value?.map((aliasToken) => (
                    <Panel
                      header={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: 8 }}>{aliasToken}</span>
                          <span class="token-panel-pro-token-collapse-map-collapse-count">
                            {getRelatedComponents(aliasToken).length}
                          </span>
                          <div
                            style={{ padding: 4, marginLeft: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onTokenSelect?.(aliasToken, 'alias')
                            }}
                          >
                            <Pick
                              class={[
                                'token-panel-pro-token-pick',
                                {
                                  'token-panel-pro-token-picked':
                                    selectedTokens.value?.alias?.includes(aliasToken),
                                },
                              ]}
                            />
                          </div>
                        </div>
                      }
                      key={aliasToken}
                    >
                      <TokenDetail
                        style={{ paddingBottom: 10 }}
                        themes={[theme]}
                        path={['token']}
                        tokenName={aliasToken as keyof AliasToken}
                      />
                    </Panel>
                  ))}
                </Collapse>
                {!shownAlias.value?.length && (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无相关 Alias Token"
                  />
                )}
              </div>
            </>
          ) : (
            <div class={`${prefixCls}-expand`}>
              <div
                class={`${prefixCls}-expand-handler`}
                onClick={() => {
                  open.value = true
                }}
              >
                <RightOutlined style={{ fontSize: 12 }} />
              </div>
            </div>
          )}
        </div>,
      )
  },
})

export default AliasPanel
