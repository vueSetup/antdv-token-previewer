import makeStyle from '../../utils/makeStyle'

export const useStyle = makeStyle('ThemeEditor', (token) => ({
  [token.componentCls]: {
    backgroundColor: token.colorBgLayout,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    [`${token.componentCls}-header`]: {
      height: token.headerHeight,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      background: token.colorBgContainer,
      borderBottom: `1px solid ${token.colorSplit}`,
      flex: `0 0 ${token.headerHeight}px`,

      '&-title': {
        fontSize: token.fontSizeLG,
        fontWeight: token.fontWeightStrong,
        color: token.colorText
      },

      '&-actions': {
        marginLeft: 'auto',

        '&-diff': {
          fontSize: token.fontSize,
          color: token.colorTextTertiary
        }
      }
    },
    [`${token.componentCls}-body`]: {
      flex: 1,
      height: 0
    }
  }
}))
