import { computed } from 'vue'
import { theme as antdTheme } from 'ant-design-vue'
import { mergeToken } from 'ant-design-vue/es/theme/internal'
import { useStyleRegister } from 'ant-design-vue/es/_util/cssinjs'
import useConfigInject from 'ant-design-vue/es/config-provider/hooks/useConfigInject'
import type { GlobalToken } from 'ant-design-vue/es/theme'
import type { UseComponentStyleResult } from 'ant-design-vue/es/theme/internal'
import type { CSSInterpolation } from 'ant-design-vue/es/_util/cssinjs'

export const defaultPrefixCls = 'antdv'

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export type ThemeEditorToken = GlobalToken & {
  rootCls: string;
  componentCls: string;
  headerHeight: number;
}

export const makeStyle = (
  path: string,
  styleFn: (token: ThemeEditorToken) => CSSInterpolation,
): (prefixCls?: string) => UseComponentStyleResult =>
  (prefixCls) => {
    const { theme, token, hashId } = antdTheme.useToken()
    const { getPrefixCls } = useConfigInject('', {})
    const rootCls = getPrefixCls()

    const componentInfo = computed(() => ({
      theme: theme.value,
      token: token.value,
      hashId: hashId.value,
      path: [path, prefixCls || ''],
    }))

    return [
      useStyleRegister(componentInfo, () => {
        const mergedToken = mergeToken<ThemeEditorToken>(token.value, {
          rootCls: `.${rootCls}`,
          componentCls: `.${prefixCls}`,
          headerHeight: 56
        })
        const styleInterpolation = styleFn(mergedToken)
        return [styleInterpolation]
      }),
      hashId,
    ]
  }

export default makeStyle
