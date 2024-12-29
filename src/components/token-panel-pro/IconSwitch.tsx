import { defineComponent, toRefs } from 'vue'

import makeStyle from '../utils/makeStyle'

const useStyle = makeStyle('IconSwitch', (token) => {
  const activeBackground = '#314659'
  return {
    [token.componentCls]: {
      display: 'inline-block',

      '.holder': {
        position: 'relative',
        display: 'inline-flex',
        background: '#ebedf0',
        borderRadius: '100vw',
        cursor: 'pointer',
        transition: 'all 0.3s',

        '&::before': {
          position: 'absolute',
          top: 0,
          left: 'calc(100% - 32px)',
          width: 32,
          height: 32,
          background: activeBackground,
          borderRadius: '100vw',
          transition: 'all 0.3s',
          content: '""',
        },

        '&.leftChecked::before': {
          left: 0,
        },

        '&:hover': {
          boxShadow: '0 0 3px fade(@active-background, 40%)',
        },
      },

      '.icon': {
        position: 'relative',
        width: 32,
        height: 32,
        color: '#a3b1bf',
        lineHeight: '32px',
        textAlign: 'center',
        transition: 'all 0.3s',
        fontSize: 16,

        '.anticon': {
          fontSize: 14,
        },

        '&:first-child': {
          marginInlineEnd: -4,
        },

        '&.active': {
          color: '#fff',
        },
      },
    }
  }
})

export interface IconSwitchProps {
  leftChecked?: boolean
  onChange?: (leftChecked: boolean) => void
}

const IconSwitch = defineComponent({
  name: 'IconSwitch',
  props: {
    leftChecked: { type: Boolean }
  },
  emits: {
    'change': (leftChecked: boolean) => true
  },
  setup(props, { attrs, slots, emit }) {
    const prefixCls = 'theme-editor-icon-switch'
    const [wrapSSR, hashId] = useStyle(prefixCls)

    const { leftChecked } = toRefs(props)

    return () => {
      return wrapSSR(
        <div
          {...attrs}
          class={[prefixCls, hashId.value, attrs.class]}
        >
          <div
            class={['holder', leftChecked.value && 'leftChecked']}
            onClick={() => { emit('change', !leftChecked.value) }}
          >
            <span class={['icon', leftChecked.value && 'active']}>
              {slots.leftIcon && slots.leftIcon()}
            </span>
            <span class={['icon', !leftChecked.value && 'active']}>
              {slots.rightIcon && slots.rightIcon()}
            </span>
          </div>
        </div>,
      )
    }
  },
})

export default IconSwitch
