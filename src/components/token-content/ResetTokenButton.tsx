import { Typography } from 'ant-design-vue'
import { defineComponent, toRefs, type PropType } from 'vue'
import type { AliasToken, MutableTheme } from '../interface'
import { useLocale } from '../../locale'

export type ResetTokenButtonProps = {
  theme: MutableTheme
  tokenName: string
}

export const ResetTokenButton = defineComponent({
  name: 'ResetTokenButton',
  inheritAttrs: false,
  props: {
    theme: { type: Object as PropType<MutableTheme>, required: true },
    tokenName: { type: String, required: true }
  },
  setup(props) {
    const { theme, tokenName } = toRefs(props)

    const locale = useLocale()

    const showReset = theme.value.config.token?.[tokenName.value as keyof AliasToken]

    return () => (
      <div style={{ display: 'inline-block' }}>
        <Typography.Link
          style={{
            fontSize: 12,
            padding: 0,
            opacity: showReset ? 1 : 0,
            pointerEvents: showReset ? 'auto' : 'none'
          }}
          onClick={() => theme.value.onAbort?.(['token', tokenName.value])}
        >
          {locale.value.reset}
        </Typography.Link>
      </div>
    )
  }
})
