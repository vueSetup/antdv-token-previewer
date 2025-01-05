import makeStyle from '../../../utils/makeStyle'

export const defaultPrefixCls = 'antdv'

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export const useStyle = makeStyle('IconSwitch', (token) => {
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
          content: '""'
        },

        '&.leftChecked::before': {
          left: 0
        },

        '&:hover': {
          boxShadow: '0 0 3px fade(@active-background, 40%)'
        }
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
          fontSize: 14
        },

        '&:first-child': {
          marginInlineEnd: -4
        },

        '&.active': {
          color: '#fff'
        }
      }
    }
  }
})
