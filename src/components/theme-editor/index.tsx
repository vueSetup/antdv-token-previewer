import type { CSSProperties, PropType } from 'vue'
import { defineComponent, toRefs } from 'vue'
// import { GlobalTokenEditor } from '../global-token-editor'
import GlobalTokenEditor from '../global-token-editor.vue'
import { LocaleContext, zhCN } from '../../locale'
import useControlledTheme from '../../composables/useControlledTheme'
import { HIGHLIGHT_COLOR } from '../../utils/constants'
import type { DerivativeFunc } from 'ant-design-vue/es/_util/cssinjs'
import type { SeedToken, MapToken } from 'ant-design-vue/es/theme/interface'
import type { Theme } from '../interface'
import type { Locale } from '../../locale'
import { useStyle } from './style'

const defaultTheme: Theme = {
  name: '默认主题',
  key: 'default',
  config: {}
}

export type ThemeEditorMode = 'global' | 'component'

export type ThemeEditorProps = {
  theme?: Theme
  darkAlgorithm?: DerivativeFunc<SeedToken, MapToken>
  locale?: Locale
  // actions?: ReactNode
  mode?: ThemeEditorMode
  advanced?: boolean
  hideAdvancedSwitcher?: boolean
  onModeChange?: (mode: ThemeEditorMode) => void
  onThemeChange?: (theme: Theme) => void
  onAdvancedChange?: (advanced: boolean) => void
}

export const ThemeEditor = defineComponent({
  name: 'ThemeEditor',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<Theme>, required: true },
    darkAlgorithm: { type: Function as PropType<DerivativeFunc<SeedToken, MapToken>> },
    locale: { type: Object as PropType<Locale>, default: zhCN },
    mode: { type: String as PropType<ThemeEditorMode> },
    advanced: { type: Boolean },
    hideAdvancedSwitcher: { type: Boolean }
  },
  emits: {},
  setup(props, { attrs }) {
    const prefixCls = 'antd-theme-editor'
    const [wrapSSR, hashId] = useStyle(prefixCls)
    const { theme: customTheme, darkAlgorithm, locale } = toRefs(props)
    const { theme, infoFollowPrimary, onInfoFollowPrimaryChange, updateRef } =
      useControlledTheme({
        theme: customTheme,
        defaultTheme,
        onChange: props.onThemeChange
        // darkAlgorithm,
      })
    const theme1 = props.theme
    return () =>
      wrapSSR(
        <LocaleContext.Provider value={locale}>
          <div
            class={[prefixCls, hashId.value, attrs.class]}
            style={attrs.style as CSSProperties}
          >
            <div class={`${prefixCls}-header`}>
              <div class={`${prefixCls}-header-actions`}></div>
            </div>
            <div class={`${prefixCls}-body`}>
              <GlobalTokenEditor
                theme={theme.value}
                infoFollowPrimary={infoFollowPrimary.value}
                onInfoFollowPrimaryChange={onInfoFollowPrimaryChange}
              />
            </div>
          </div>
        </LocaleContext.Provider>
      )
  }
})
