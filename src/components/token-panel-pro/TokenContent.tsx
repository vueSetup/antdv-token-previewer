import { CaretRightOutlined, ExpandOutlined } from '@ant-design/icons-vue'
import {
  Collapse,
  ConfigProvider,
  Input,
  Popover,
  Segmented,
  Switch,
  theme as antdTheme,
  Tooltip,
} from 'ant-design-vue'
import type { AliasToken, MutableTheme, SelectedToken } from '../interface'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import seed from 'ant-design-vue/es/theme/themes/seed'
import tokenMeta from 'ant-design-vue/es/version/token-meta.json'
import type { PropType } from 'vue'
import { toRefs, defineComponent, watchEffect, computed, watch, ref } from 'vue'
import { debounce } from 'lodash'
// TODO :: ColorPicker
// import ColorPicker from '../ColorPicker' 
import type { ThemeCode } from '../../composables/useControlledTheme'
import { themeMap } from '../../composables/useControlledTheme'
import { CompactTheme, DarkTheme, Light } from '../icons'
import { useLocale, type Locale } from '../locale'
import type { TokenCategory, TokenGroup } from '../meta/interface'
import { HIGHLIGHT_COLOR } from '../utils/constants'
import getDesignToken from '../utils/getDesignToken'
import makeStyle from '../utils/makeStyle'
import InputNumberPlus from './InputNumberPlus'
import ResetTokenButton from './ResetTokenButton'
import TokenPreview from './TokenPreview'
import IconSwitch from './IconSwitch'

type TokenMeta = Record<string, {
  name: string,
  nameEn: string,
  desc: string,
  descEn: string
}>

const { Panel } = Collapse

export type SeedTokenProps = {
  theme: MutableTheme
  tokenName: string
  disabled?: boolean
}

const SeedTokenPreview = defineComponent({
  props: {
    theme: { type: Object as PropType<MutableTheme>, required: true },
    tokenName: { type: String, required: true },
    disabled: { type: Boolean },
  },
  setup(props, { slots }) {
    const { theme, tokenName, disabled } = toRefs(props)

    const getSeedValue = (config: ThemeConfig, token: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return config.token?.[token] || seed[token] || getDesignToken(config)[token]
    }

    const seedRange: Record<string, { min: number; max: number }> = {
      borderRadius: {
        min: 0,
        max: 16,
      },
      fontSize: {
        min: 12,
        max: 32,
      },
      sizeStep: {
        min: 0,
        max: 16,
      },
      sizeUnit: {
        min: 0,
        max: 16,
      },
      margin: {
        min: 0,
        max: 32,
      },
      padding: {
        min: 0,
        max: 32,
      },
    }

    // const tokenPath = computed(() => ['token', tokenName.value]);
    const tokenValue = ref(getSeedValue(theme.value.config, tokenName.value))
    // const showReset = computed(() => theme.value.getCanReset?.(tokenPath.value));

    const onThemeChange = (newValue: number | string) => {
      theme.value.onThemeChange?.(
        {
          ...theme.value.config,
          token: {
            ...theme.value.config.token,
            [tokenName.value]: newValue,
          },
        },
        ['token', tokenName.value],
      )
    }

    const debouncedOnChange = debounce(onThemeChange, 200)

    const onChange = (value: number | string) => {
      tokenValue.value = value
      debouncedOnChange(value)
    }

    watchEffect(() => {
      tokenValue.value = getSeedValue(theme.value.config, tokenName.value)
    })

    const tokenGroup = computed(() =>
      ['fontSize', 'sizeUnit', 'sizeStep', 'borderRadius', 'margin', 'padding'].find(
        (prefix) => tokenName.value.startsWith(prefix),
      ),
    )

    const nonColorInput = (
      <>
        {tokenGroup.value && (
          <InputNumberPlus
            value={tokenValue}
            onChange={onChange}
            min={seedRange[tokenGroup.value].min}
            max={seedRange[tokenGroup.value].max}
          />
        )}
        {['boxShadow', 'lineHeight'].some((prefix) =>
          tokenName.value.startsWith(prefix),
        ) && (
            <div>
              <Input.TextArea
                value={tokenValue}
                onChange={({ target: { value } }) => onChange(value!)}
                style={{ width: 200 }}
              />
            </div>
          )}
        {tokenName.value === 'wireframe' && (
          <Switch checked={tokenValue} onChange={onChange} />
        )}
      </>
    )

    // ???
    if (slots.default) {
      return (
        <>
          {tokenName.value.startsWith('color') ? (
            <ColorPicker
              onChangeComplete={(newColor) =>
                onThemeChange(newColor.toHexString())
              }
              value={tokenValue}
            >
              {slots.default()}
            </ColorPicker>
          ) : (
            <Popover
              arrow={false}
              placement="bottomRight"
              trigger="click"
              content={nonColorInput}
            >
              {slots.default()}
            </Popover>
          )}
        </>
      );
    }

    return () => (
      <div class="token-panel-pro-token-list-seed-block-sample">
        {tokenName.value.startsWith('color') && (
          <ColorPicker
            onChangeComplete={(newColor) => onThemeChange(newColor.toHexString())}
            value={tokenValue}
          >
            {
              <div
                class="token-panel-pro-token-list-seed-block-sample-card"
                style={{ pointerEvents: disabled.value ? 'none' : 'auto' }}
              >
                <div
                  style={{
                    backgroundColor: tokenValue,
                    width: 48,
                    height: 32,
                    borderRadius: 6,
                    marginRight: 10,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.09)',
                  }}
                />
                <div class="token-panel-pro-token-list-seed-block-sample-card-value">
                  {tokenValue}
                </div>
              </div>
            }
          </ColorPicker>
        )}
        {nonColorInput}
      </div>
    )
  },
})

export type MapTokenCollapseContentProps = {
  theme: MutableTheme
  mapTokens?: string[]
  selectedTokens?: SelectedToken // ???
  type?: string
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void // ???
}

const MapTokenCollapseContent = defineComponent({
  props: {
    theme: { type: Object as PropType<MutableTheme>, required: true },
    mapTokens: { type: Array as PropType<string[]> },
    selectedTokens: { type: Object as PropType<SelectedToken> }, // ???
    type: { type: String },
  },
  emits: {
    'tokenSelect': (token: string | string[], type: keyof SelectedToken) => true, // ???
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
                marginRight: 8,
              }}
            >
              {locale.value._lang === 'zh-CN' && (
                <span
                  style={{
                    fontWeight: 500,
                    flex: 'none',
                    color: getMapTokenColor(mapToken),
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
                    type={type}
                  />
                </div>
              </div>
            </SeedTokenPreview>
          </div>
        ))}
      </>
    )
  },
})

export type MapTokenCollapseProps = {
  theme: MutableTheme
  group: TokenGroup<string>
  selectedTokens?: SelectedToken
  groupFn?: (token: string) => string
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void
}

const MapTokenCollapse = defineComponent({
  props: {
    theme: { type: Object as PropType<MutableTheme>, required: true },
    group: { type: Object as PropType<TokenGroup<string>>, required: true },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    groupFn: { type: Function as PropType<(token: string) => string> },
  },
  emits: {
    'tokenSelect': (token: string | string[], type: keyof SelectedToken) => true,
  },
  setup(props, { emit }) {
    const { theme, group, selectedTokens, groupFn } = toRefs(props)

    const locale = useLocale()

    const groupedTokens = computed(() => {
      const grouped: Record<string, string[]> = {}
      if (groupFn.value) {
        group.value.mapToken?.forEach((token) => {
          const key = groupFn.value?.(token) ?? 'default'
          grouped[key] = [...(grouped[key] ?? []), token]
        })
      }
      return grouped
    })

    const onTokenSelect = (token: string | string[], type: keyof SelectedToken) => {
      emit('tokenSelect', token, type)
    }

    if (groupFn.value) {
      return () => (
        <Collapse
          class="token-panel-pro-grouped-map-collapse"
          defaultActiveKey={Object.keys(groupedTokens)}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 450 : 360} style={{ fontSize: 12 }} />
          )}
        >
          {(group.value.mapTokenGroups ?? Object.keys(groupedTokens)).map((key) => (
            <Panel key={key} header={locale.value[key as keyof Locale] ?? ''}>
              <MapTokenCollapseContent
                mapTokens={groupedTokens.value[key]}
                theme={theme.value}
                selectedTokens={selectedTokens.value}
                onTokenSelect={onTokenSelect}
                type={group.value.type}
              />
            </Panel>
          ))}
        </Collapse>
      )
    }

    if (group.value.groups) {
      return (
        <Collapse
          class="token-panel-pro-grouped-map-collapse"
          defaultActiveKey={group.value.groups.map((item) => item.key)}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 450 : 360} style={{ fontSize: 12 }} />
          )}
        >
          {group.value.groups.map((item) => (
            <Panel key={item.key} header={item.name}>
              <MapTokenCollapseContent
                mapTokens={item.mapToken}
                theme={theme.value}
                selectedTokens={selectedTokens.value}
                onTokenSelect={onTokenSelect}
                type={item.type}
              />
            </Panel>
          ))}
        </Collapse>
      )
    }

    return () => (
      <MapTokenCollapseContent
        mapTokens={group.value.mapToken ?? []}
        theme={theme}
        selectedTokens={selectedTokens}
        onTokenSelect={onTokenSelect}
        type={group.value.type}
      />
    )
  },
})

const groupMapToken = (token: string): string => {
  if (token.startsWith('colorFill')) {
    return 'fill'
  }
  if (token.startsWith('colorBorder') || token.startsWith('colorSplit')) {
    return 'border'
  }
  if (token.startsWith('colorBg')) {
    return 'background'
  }
  if (token.startsWith('colorText')) {
    return 'text'
  }
  return ''
}

const useStyle = makeStyle('ColorTokenContent', (token) => ({
  [token.componentCls]: {
    height: 'auto',
    display: 'flex',
    [`${token.componentCls}-seeds`]: {
      height: '100%',
      flex: 1,
      width: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderBottom: `1px solid ${token.colorBorderSecondary}`,

      [`${token.componentCls}-themes`]: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        flex: '0 0 60px',
        borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorText,
        fontWeight: token.fontWeightStrong,

        '> span': {
          fontSize: token.fontSizeLG
        },
      },
    },
    '.token-panel-pro-token-list': {
      flex: 1,
      overflow: 'auto',

      '.token-panel-pro-token-item': {
        display: 'flex',
        flexWrap: 'wrap',

        '&-seed': {
          width: '100%',
          padding: '18px 18px 8px 14px',
        },

        [`&:not(:last-child)`]: {
          borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
        },
      },

      '.token-panel-pro-token-item-header': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',

        '> *': {
          marginBottom: 10,
        },

        '.token-panel-pro-token-item-header-title': {
          marginInlineEnd: 4,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          color: token.colorText,
        },

        '&-follow-primary': {
          marginLeft: 'auto',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          color: token.colorText,
        },
      },

      '.token-panel-pro-token-list-description': {
        color: token.colorTextTertiary,
        marginBottom: 16,
      },

      '.token-panel-pro-token-list-subtitle': {
        color: token.colorTextSecondary,
        fontSize: 12,
      },

      '.token-panel-pro-token-list-seed-block': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',

        '+ .token-panel-pro-token-list-seed-block': {
          marginTop: 12,
        },

        '&-name-cn': {
          fontSize: token.fontSize,
          fontWeight: token.fontWeightStrong,
          marginInlineEnd: 4,
          color: token.colorText,
        },

        '&-subtitle': {
          fontSize: token.fontSizeSM,
          color: token.colorTextTertiary,
          marginInlineEnd: 4,
        },

        '&-sample': {
          flex: 'none',
          position: 'relative',

          '&:not(:last-child)': {
            marginInlineEnd: 16,
          },

          '&-theme': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: -8,
            margin: 'auto',
            transform: 'translateX(-100%)',
            height: 22,
          },

          '&-card': {
            cursor: 'pointer',
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',

            '&-value': {
              fontFamily: 'Monaco,Monospace'.concat(token.fontFamily),
              fontSize: 14,
              color: token.colorTextSecondary,
            },
          },
        },
      },

      [`.token-panel-pro-token-list-map-collapse${token.rootCls}-collapse`]: {
        borderRadius: 0,
        borderTop: `1px solid ${token.colorBorderSecondary}`,

        [`> ${token.rootCls}-collapse-item`]: {
          [`> ${token.rootCls}-collapse-header`]: {
            padding: `8px 15px`,
            color: token.colorTextSecondary,
            [`> ${token.rootCls}-collapse-expand-icon`]: {
              paddingInlineEnd: 4,
            },
          },

          '.token-panel-pro-token-list-map-collapse-grouped': {
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            fontSize: 12,
            justifyContent: 'flex-end',
            color: token.colorTextTertiary,
          },

          [`&${token.rootCls}-collapse-item-active`]: {
            '.token-panel-pro-token-list-map-collapse-grouped': {
              opacity: 1,
              pointerEvents: 'auto',
            },
          },
        },
      },

      [`.token-panel-pro-token-collapse-map`]: {
        borderRadius: 0,
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorSplit}`,
        paddingLeft: 12,
        fontSize: 12,

        '&:not(:last-child)': {
          borderBottom: 'none',
        },

        '.token-panel-pro-token-collapse-map-collapse-token': {
          color: token.colorTextSecondary,
          marginInlineStart: 4,
          marginInlineEnd: 8,
        },

        '.token-panel-pro-token-collapse-map-collapse-preview': {
          display: 'flex',
          flex: 'none',
          borderLeft: `1px solid ${token.colorSplit}`,
          cursor: 'pointer',
          '.token-panel-pro-token-collapse-map-collapse-preview-color': {
            height: 40,
            width: 40,
            position: 'relative',
          },
        },
      },
    },

    '.token-panel-pro-token-collapse-map-collapse-count': {
      color: token.colorTextTertiary,
      display: 'inline-block',
      fontSize: 12,
      lineHeight: '16px',
      padding: '0 6px',
      backgroundColor: token.colorFillTertiary,
      borderRadius: 4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginLeft: 'auto',
      marginRight: 12,
      maxWidth: 100,
      flex: 'none',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    },

    '.token-panel-pro-token-pick': {
      transition: 'color 0.3s',
    },

    '.token-panel-pro-token-picked': {
      color: token.colorPrimary,
    },

    [`.token-panel-pro-grouped-map-collapse${token.rootCls}-collapse`]: {
      borderRadius: `4px 4px 0 0`,
      [`> ${token.rootCls}-collapse-item`]: {
        [`&:last-child`]: {
          borderRadius: 0,
        },
        [`> ${token.rootCls}-collapse-header`]: {
          padding: '6px 12px',
          color: token.colorIcon,
          fontSize: 12,
          lineHeight: token.lineHeightSM,
          [`${token.rootCls}-collapse-expand-icon`]: {
            lineHeight: '20px',
            height: 20,
          },
        },
        [`> ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
          padding: 0,

          '.token-panel-pro-token-collapse-map': {
            borderInline: 0,
            '&:last-child': {
              borderBottom: 0,
            },
            '&:first-child': {
              borderTop: 0,
            },
          },
        },
      },
    },
  },
}))

export type ColorTokenContentProps = {
  id: string
  category: TokenCategory<string>
  theme: MutableTheme
  selectedTokens?: SelectedToken
  infoFollowPrimary?: boolean
  activeGroup: string // ???
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void
  onInfoFollowPrimaryChange?: (value: boolean) => void
  onActiveGroupChange: (value: string) => void // ???
}

const TokenContent = defineComponent({
  props: {
    id: { type: String, required: true },
    category: { type: Object as PropType<TokenCategory<string>>, required: true },
    theme: { type: Object as PropType<MutableTheme>, required: true },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    infoFollowPrimary: { type: Boolean },
    activeGroup: { type: String } // ???
  },
  emits: {
    'tokenSelect': (token: string | string[], type: keyof SelectedToken) => true,
    'infoFollowPrimaryChange': (value: boolean) => true,
    'activeGroupChange': (value: string) => true // ???
  },
  setup(props, { emit }) {
    const prefixCls = 'token-panel-pro-color'
    const [wrapSSR, hashId] = useStyle(prefixCls)

    const { id, category, theme, selectedTokens, infoFollowPrimary } =
      toRefs(props)

    const locale = useLocale()

    const { token } = antdTheme.useToken()

    const grouped = ref(true)

    const switchAlgorithm = (themeStr: 'dark' | 'compact') => () => {
      let newAlgorithm = theme.value.config.algorithm
      if (!newAlgorithm) {
        newAlgorithm = themeMap[themeStr]
      } else if (Array.isArray(newAlgorithm)) {
        newAlgorithm = newAlgorithm.includes(themeMap[themeStr])
          ? newAlgorithm.filter((item) => item !== themeMap[themeStr])
          : [...newAlgorithm, themeMap[themeStr]]
      } else {
        newAlgorithm =
          newAlgorithm === themeMap[themeStr]
            ? undefined
            : [newAlgorithm, themeMap[themeStr]]
      }
      theme.value.onThemeChange?.({ ...theme.value.config, algorithm: newAlgorithm }, [
        'config',
        'algorithm',
      ])
    }

    const isLeftChecked = (str: ThemeCode) => {
      if (!theme.value?.config?.algorithm) {
        return true
      }
      return Array.isArray(theme.value.config.algorithm)
        ? !theme.value.config.algorithm.includes(themeMap[str])
        : theme.value.config.algorithm !== themeMap[str]
    }

    const onTokenSelect = (token: string | string[], type: keyof SelectedToken) => {
      emit('tokenSelect', token, type)
    }

    const onInfoFollowPrimaryChange = (value: boolean) => {
      emit('infoFollowPrimaryChange', value)
    }

    const onActiveGroupChange = (value: string) => {
      emit('activeGroupChange', value)
    }

    // TODO :: Context Provider
    const advanced = false

    return () => wrapSSR(
      <div
        id={id.value}
        class={[prefixCls, hashId.value]}
      >
        <div class={`${prefixCls}-seeds`}>
          <div class={`${prefixCls}-themes`}>
            <span style={{ marginRight: 12 }}>
              {locale.value._lang === 'zh-CN' ? category.value.name : category.value.nameEn}
            </span>
            {/* {category.value.nameEn === 'Color' && (
              <Segmented
                options={[
                  { label: <Light style={{ fontSize: 16 }} />, value: 'light' },
                  { label: <DarkTheme style={{ fontSize: 16 }} />, value: 'dark' },
                ]}
                onChange={switchAlgorithm('dark')}
                value={isLeftChecked('dark') ? 'light' : 'dark'}
                style={{ marginLeft: 'auto' }}
              />
            )} */}
            {category.value.nameEn === 'Color' && (
              <IconSwitch
                onChange={switchAlgorithm('dark')}
                leftChecked={isLeftChecked('dark')}
                v-slots={{
                  leftIcon: () => <Light />,
                  rightIcon: () => <DarkTheme />,
                }}
                style={{ marginLeft: 'auto' }}
              />
            )}
            {/* {category.value.nameEn === 'Size' && (
              <Segmented
                options={[
                  {
                    label: <ExpandOutlined style={{ fontSize: 13, marginTop: 1 }} />,
                    value: 'normal',
                  },
                  {
                    label: <CompactTheme style={{ fontSize: 16 }} />,
                    value: 'compact',
                  },
                ]}
                onChange={switchAlgorithm('compact')}
                value={isLeftChecked('compact') ? 'normal' : 'compact'}
                style={{ marginLeft: 'auto' }}
              />
            )} */}
            {category.value.nameEn === 'Size' && (
              <IconSwitch
                onChange={switchAlgorithm('compact')}
                leftChecked={isLeftChecked('compact')}
                v-slots={{
                  leftIcon: () => <ExpandOutlined />,
                  rightIcon: () => <CompactTheme />,
                }}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </div>
          <ConfigProvider
            theme={{
              components: {
                Collapse: {
                  colorBorder: token.value.colorSplit,
                },
              },
            }}
          >
            <div class="token-panel-pro-token-list">
              {category.value.groups.map((group) => {
                const groupDesc =
                  locale.value._lang === 'zh-CN' ? group.desc : group.descEn;
                return (
                  (!!group.seedToken || advanced) && (
                    <div class="token-panel-pro-token-item" key={group.key}>
                      <div class="token-panel-pro-token-item-seed">
                        <div class="token-panel-pro-token-item-header">
                          <Tooltip
                            mouseEnterDelay={0.5}
                            placement="right"
                            arrow={{ pointAtCenter: true }}
                            title={groupDesc}
                          >
                            <div class="token-panel-pro-token-item-header-title">
                              <span>
                                {locale.value._lang === 'zh-CN'
                                  ? group.name
                                  : group.nameEn}
                              </span>
                            </div>
                          </Tooltip>
                          {group.seedToken?.[0] === 'colorInfo' && (
                            <div
                              key={group.seedToken[0]}
                              class="token-panel-pro-token-item-header-follow-primary"
                            >
                              <span>{locale.followPrimary}</span>
                              <Switch
                                size="small"
                                style={{ marginLeft: 8 }}
                                checked={infoFollowPrimary}
                                onChange={(e) => onInfoFollowPrimaryChange?.(e)}
                              />
                            </div>
                          )}
                        </div>
                        {group.seedToken?.map((seedToken) => {
                          const multipleSeeds =
                            group.seedToken && group.seedToken.length > 1;
                          return (
                            (seedToken !== 'colorInfo' || !infoFollowPrimary.value) && (
                              <div
                                key={seedToken}
                                class="token-panel-pro-token-list-seed-block"
                              >
                                <div style={{ marginRight: 'auto' }}>
                                  <div>
                                    <span>
                                      <Tooltip
                                        mouseEnterDelay={0.5}
                                        placement="right"
                                        title={
                                          (tokenMeta as TokenMeta)[seedToken]?.[
                                          locale.value._lang === 'zh-CN'
                                            ? 'desc'
                                            : 'descEn'
                                          ]
                                        }
                                      >
                                        <span>
                                          {multipleSeeds && (
                                            <span
                                              class="token-panel-pro-token-list-seed-block-name-cn"
                                              style={{
                                                marginRight: 4,
                                                color: !!(
                                                  theme.value.config.token as Record<string, unknown>
                                                )?.[seedToken]
                                                  ? HIGHLIGHT_COLOR
                                                  : '',
                                              }}
                                            >
                                              {
                                                (tokenMeta as TokenMeta)[seedToken]?.[
                                                locale.value._lang === 'zh-CN'
                                                  ? 'name'
                                                  : 'nameEn'
                                                ]
                                              }
                                            </span>
                                          )}
                                          <span
                                            class={
                                              multipleSeeds
                                                ? 'token-panel-pro-token-list-seed-block-subtitle'
                                                : 'token-panel-pro-token-list-seed-block-name-cn'
                                            }
                                            style={{
                                              color: !!(theme.value.config.token as Record<string, unknown>)?.[
                                                seedToken
                                              ] ? HIGHLIGHT_COLOR
                                                : '',
                                            }}
                                          >
                                            {seedToken}
                                          </span>
                                        </span>
                                      </Tooltip>
                                      <ResetTokenButton
                                        theme={theme}
                                        tokenName={seedToken}
                                        style={{ marginLeft: 8 }}
                                      />
                                    </span>
                                  </div>
                                </div>
                                <SeedTokenPreview
                                  theme={theme.value}
                                  tokenName={seedToken}
                                  disabled={
                                    seedToken === 'colorInfo' && infoFollowPrimary.value
                                  }
                                />
                              </div>
                            )
                          );
                        })}
                      </div>
                      {(group.mapToken || group.groups) &&
                        advanced &&
                        (!group.seedToken?.includes('colorInfo') ||
                          !infoFollowPrimary.value) && (
                          <Collapse
                            bordered={false}
                            expandIcon={({ isActive }) => (
                              <CaretRightOutlined rotate={isActive ? 90 : 0} />
                            )}
                            style={{ width: '100%', marginBlockStart: 10 }}
                            class="token-panel-pro-token-list-map-collapse"
                          >
                            <Panel
                              header={
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <span
                                    style={{
                                      color: group.mapToken?.some(
                                        (t) => !!theme.value.config.token?.[t as keyof AliasToken],
                                      )
                                        ? HIGHLIGHT_COLOR
                                        : '',
                                    }}
                                  >
                                    {locale.value._lang === 'zh-CN'
                                      ? '梯度变量 Map Token'
                                      : 'Map Token'}
                                  </span>
                                  {group.mapTokenGroups && (
                                    <div
                                      class="token-panel-pro-token-list-map-collapse-grouped"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <label style={{ marginRight: 4 }}>
                                        {locale.groupView}
                                      </label>
                                      <Switch
                                        checked={grouped.value}
                                        onChange={(value) => grouped.value = value}
                                        size="small"
                                      />
                                    </div>
                                  )}
                                </div>
                              }
                              key={group.key}
                            >
                              <MapTokenCollapse
                                group={group}
                                theme={theme.value}
                                selectedTokens={selectedTokens.value}
                                onTokenSelect={onTokenSelect}
                                groupFn={
                                  group.mapTokenGroups && grouped
                                    ? groupMapToken
                                    : undefined
                                }
                              />
                            </Panel>
                          </Collapse>
                        )}
                    </div>
                  )
                );
              })}
            </div>
          </ConfigProvider>
        </div>
      </div>,
    )
  },
})

export default TokenContent
