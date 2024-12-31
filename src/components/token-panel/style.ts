import makeStyle from '../utils/makeStyle'

export const defaultPrefixCls = 'antdv'

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export const useStyle = makeStyle('TokenPanelPro', (token) => ({
  [token.componentCls]: {
    width: '100%',
    height: '100%',
    display: 'flex',
    borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
    [`${token.componentCls}-content`]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',

      [`${token.rootCls}-anchor-wrapper`]: {
        padding: '0px 16px'
      },

      [`${token.rootCls}-anchor`]: {
        padding: '10px 0'
      },

      [`${token.componentCls}-list`]: {
        overflow: 'auto'
      }
    }
  }
}))
