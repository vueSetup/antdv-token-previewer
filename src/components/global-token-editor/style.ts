import makeStyle from '../utils/makeStyle'

export const defaultPrefixCls = 'antdv'

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export const useStyle = makeStyle('GlobalTokenEditor', (token) => ({
  [token.componentCls]: {
    display: 'flex',
    height: '100%',
    [`${token.componentCls}-token-panel-wrapper`]: {
      backgroundColor: token.colorBgContainer,
      height: '100%',
      backgroundImage:
        'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0, 0, 0, 0.02) 100%)',
      display: 'flex',
      transition: 'all 0.3s',
    },
  },
}))