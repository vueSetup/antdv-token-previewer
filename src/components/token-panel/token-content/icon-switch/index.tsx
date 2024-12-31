import { defineComponent, toRefs, type CSSProperties } from 'vue'
import { getPrefixCls, useStyle } from './style'

export interface IconSwitchProps {
  leftChecked?: boolean
  onChange?: (leftChecked: boolean) => void
}

export const IconSwitch = defineComponent({
  name: 'IconSwitch',
  props: {
    leftChecked: { type: Boolean }
  },
  emits: {
    change: (leftChecked: boolean) => true
  },
  setup(props, { attrs, slots, emit }) {
    // const prefixCls = 'theme-editor-icon-switch'
    const prefixCls = getPrefixCls('theme-editor-icon-switch')
    const [wrapSSR, hashId] = useStyle(prefixCls)

    const { leftChecked } = toRefs(props)

    return () => {
      return wrapSSR(
        <div
          class={[prefixCls, hashId.value, attrs.class]}
          style={attrs.style as CSSProperties}
        >
          <div
            class={['holder', leftChecked.value && 'leftChecked']}
            onClick={() => {
              emit('change', !leftChecked.value)
            }}
          >
            <span class={['icon', leftChecked.value && 'active']}>
              {slots.leftIcon && slots.leftIcon()}
            </span>
            <span class={['icon', !leftChecked.value && 'active']}>
              {slots.rightIcon && slots.rightIcon()}
            </span>
          </div>
        </div>
      )
    }
  }
})
