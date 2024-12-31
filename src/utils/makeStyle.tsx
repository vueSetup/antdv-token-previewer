import type { CSSInterpolation } from 'ant-design-vue/es/_util/cssinjs'
import { useStyleRegister } from 'ant-design-vue/es/_util/cssinjs'
import { theme as antdTheme } from 'ant-design-vue'
import type { GlobalToken } from 'ant-design-vue/es/theme/interface'
import type { VueNode } from 'ant-design-vue/es/_util/type'
import { mergeToken } from 'ant-design-vue/es/theme/internal'
import { computed, type ComputedRef } from 'vue'
import useConfigInject from 'ant-design-vue/es/config-provider/hooks/useConfigInject'
import type { UseComponentStyleResult } from 'ant-design-vue/es/theme/internal'

export type ThemeEditorToken = GlobalToken & {
  rootCls: string;
  componentCls: string;
  headerHeight: number;
}

const makeStyle = (
  path: string,
  styleFn: (token: ThemeEditorToken) => CSSInterpolation,
): ((prefixCls?: string) => [(node: VueNode) => VueNode, ComputedRef<string>]) =>
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
        const mergedToken =
          mergeToken<GlobalToken & {
            rootCls: string,
            componentCls: string,
            headerHeight: number
          }>(token.value, {
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
