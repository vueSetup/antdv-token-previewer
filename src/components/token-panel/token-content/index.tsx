import { defineComponent, ref, toRefs, type PropType } from 'vue'
import {
  Collapse,
  ConfigProvider,
  Switch,
  theme as antdvTheme,
  Tooltip
} from 'ant-design-vue'
import tokenMeta from 'ant-design-vue/es/version/token-meta.json'
import { CaretRightOutlined, ExpandOutlined } from '@ant-design/icons-vue'
import { Light, DarkTheme, CompactTheme } from '../../icons'
import { MapTokenCollapse } from './MapTokenCollapse'
import { SeedTokenPreview } from './SeedTokenPreview'
import { ResetTokenButton } from './ResetTokenButton'
import { IconSwitch } from './icon-switch'
import { themeMap, type ThemeCode } from '../../../composables/useControlledTheme'
import { HIGHLIGHT_COLOR } from '../../utils/constants'
import { useLocale } from '../../locale'
import { getPrefixCls, useStyle } from './style'
import type { AliasToken, MutableTheme, SelectedToken } from '../../interface'
import type { TokenCategory } from '../../meta'

type TokenMeta = Record<
  string,
  {
    name: string
    nameEn: string
    desc: string
    descEn: string
  }
>

const { Panel } = Collapse

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

export const TokenContent = defineComponent({
  name: 'TokenContent',
  props: {
    id: { type: String, required: true },
    category: { type: Object as PropType<TokenCategory<string>>, required: true },
    theme: { type: Object as PropType<MutableTheme>, required: true },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    infoFollowPrimary: { type: Boolean },
    activeGroup: { type: String } // ???
  },
  emits: {
    tokenSelect: (token: string | string[], type: keyof SelectedToken) => true,
    infoFollowPrimaryChange: (value: boolean) => true,
    activeGroupChange: (value: string) => true // ???
  },
  setup(props, { emit }) {
    // const prefixCls = 'token-panel-pro'
    const prefixCls = getPrefixCls('token-content')
    const [wrapSSR, hashId] = useStyle(prefixCls)

    const { id, category, theme, selectedTokens, infoFollowPrimary } = toRefs(props)

    const locale = useLocale()

    const { token } = antdvTheme.useToken()

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
        'algorithm'
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

    return () =>
      wrapSSR(
        <div id={id.value} class={[`${prefixCls}-color`, hashId.value]}>
          <div class={`${prefixCls}-color-seeds`}>
            <div class={`${prefixCls}-color-themes`}>
              <span style={{ marginRight: 12 }}>
                {locale.value._lang === 'zh-CN'
                  ? category.value.name
                  : category.value.nameEn}
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
                    rightIcon: () => <DarkTheme />
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
                    rightIcon: () => <CompactTheme />
                  }}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Collapse: {
                    colorBorder: token.value.colorSplit
                  }
                }
              }}
            >
              <div class={`${prefixCls}-token-list`}>
                {category.value.groups.map((group) => {
                  const groupDesc =
                    locale.value._lang === 'zh-CN' ? group.desc : group.descEn
                  return (
                    (!!group.seedToken || advanced) && (
                      <div class={`${prefixCls}-token-item`} key={group.key}>
                        <div class={`${prefixCls}-token-item-seed`}>
                          <div class={`${prefixCls}-token-item-header`}>
                            <Tooltip
                              mouseEnterDelay={0.5}
                              placement="right"
                              arrow={{ pointAtCenter: true }}
                              title={groupDesc}
                            >
                              <div class={`${prefixCls}-token-item-header-title`}>
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
                                class={`${prefixCls}-token-item-header-follow-primary`}
                              >
                                <span>{locale.followPrimary}</span>
                                <Switch
                                  size="small"
                                  style={{ marginLeft: 8 }}
                                  checked={infoFollowPrimary.value}
                                  onChange={(e) => onInfoFollowPrimaryChange?.(e)}
                                />
                              </div>
                            )}
                          </div>
                          {group.seedToken?.map((seedToken) => {
                            const multipleSeeds =
                              group.seedToken && group.seedToken.length > 1
                            return (
                              (seedToken !== 'colorInfo' || !infoFollowPrimary.value) && (
                                <div
                                  key={seedToken}
                                  class={`${prefixCls}-token-list-seed-block`}
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
                                                class={`${prefixCls}-token-list-seed-block-name-cn`}
                                                style={{
                                                  marginRight: 4,
                                                  color: !!(
                                                    theme.value.config.token as Record<
                                                      string,
                                                      unknown
                                                    >
                                                  )?.[seedToken]
                                                    ? HIGHLIGHT_COLOR
                                                    : ''
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
                                                  ? `${prefixCls}-token-list-seed-block-subtitle`
                                                  : `${prefixCls}-token-list-seed-block-name-cn`
                                              }
                                              style={{
                                                color: !!(
                                                  theme.value.config.token as Record<
                                                    string,
                                                    unknown
                                                  >
                                                )?.[seedToken]
                                                  ? HIGHLIGHT_COLOR
                                                  : ''
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
                            )
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
                              class={`${prefixCls}-token-list-map-collapse`}
                            >
                              <Panel
                                header={
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between'
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: group.mapToken?.some(
                                          (t) =>
                                            !!theme.value.config.token?.[
                                              t as keyof AliasToken
                                            ]
                                        )
                                          ? HIGHLIGHT_COLOR
                                          : ''
                                      }}
                                    >
                                      {locale.value._lang === 'zh-CN'
                                        ? '梯度变量 Map Token'
                                        : 'Map Token'}
                                    </span>
                                    {group.mapTokenGroups && (
                                      <div
                                        class={`${prefixCls}-token-list-map-collapse-grouped`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <label style={{ marginRight: 4 }}>
                                          {locale.groupView}
                                        </label>
                                        <Switch
                                          checked={grouped.value}
                                          onChange={(value) => (grouped.value = value)}
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
                  )
                })}
              </div>
            </ConfigProvider>
          </div>
        </div>
      )
  }
})
