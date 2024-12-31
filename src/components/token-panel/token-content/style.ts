import makeStyle from '../../../utils/makeStyle'

export const defaultPrefixCls = 'antdv'

export const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export const useStyle = makeStyle('TokenContent', (token) => ({
  [`${token.componentCls}-color`]: {
    height: 'auto',
    display: 'flex',
    [`${token.componentCls}-color-seeds`]: {
      height: '100%',
      flex: 1,
      width: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderBottom: `1px solid ${token.colorBorderSecondary}`,

      [`${token.componentCls}-color-themes`]: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        flex: '0 0 60px',
        borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
        color: token.colorText,
        fontWeight: token.fontWeightStrong,

        '> span': {
          fontSize: token.fontSizeLG
        }
      }
    },
    [`${token.componentCls}-token-list`]: {
      flex: 1,
      overflow: 'auto',

      [`${token.componentCls}-token-item`]: {
        display: 'flex',
        flexWrap: 'wrap',

        '&-seed': {
          width: '100%',
          padding: '18px 18px 8px 14px'
        },

        [`&:not(:last-child)`]: {
          borderBlockEnd: `1px solid ${token.colorBorderSecondary}`
        }
      },

      [`${token.componentCls}-token-item-header`]: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',

        '> *': {
          marginBottom: 10
        },

        [`${token.componentCls}-token-item-header-title`]: {
          marginInlineEnd: 4,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          color: token.colorText
        },

        '&-follow-primary': {
          marginLeft: 'auto',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          color: token.colorText
        }
      },

      [`${token.componentCls}-token-item-description`]: {
        color: token.colorTextTertiary,
        marginBottom: 16
      },

      [`${token.componentCls}-token-item-subtitle`]: {
        color: token.colorTextSecondary,
        fontSize: 12
      },

      [`${token.componentCls}-token-list-seed-block`]: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',

        [`+ ${token.componentCls}-token-list-seed-block`]: {
          marginTop: 12
        },

        '&-name-cn': {
          fontSize: token.fontSize,
          fontWeight: token.fontWeightStrong,
          marginInlineEnd: 4,
          color: token.colorText
        },

        '&-subtitle': {
          fontSize: token.fontSizeSM,
          color: token.colorTextTertiary,
          marginInlineEnd: 4
        },

        '&-sample': {
          flex: 'none',
          position: 'relative',

          '&:not(:last-child)': {
            marginInlineEnd: 16
          },

          '&-theme': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: -8,
            margin: 'auto',
            transform: 'translateX(-100%)',
            height: 22
          },

          '&-card': {
            cursor: 'pointer',
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',

            '&-value': {
              fontFamily: 'Monaco,Monospace'.concat(token.fontFamily),
              fontSize: 14,
              color: token.colorTextSecondary
            }
          }
        }
      },

      [`${token.componentCls}-token-list-map-collapse${token.rootCls}-collapse`]: {
        borderRadius: 0,
        borderTop: `1px solid ${token.colorBorderSecondary}`,

        [`> ${token.rootCls}-collapse-item`]: {
          [`> ${token.rootCls}-collapse-header`]: {
            padding: `8px 15px`,
            color: token.colorTextSecondary,
            [`> ${token.rootCls}-collapse-expand-icon`]: {
              paddingInlineEnd: 4
            }
          },

          [`${token.componentCls}-token-list-map-collapse-grouped`]: {
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            fontSize: 12,
            justifyContent: 'flex-end',
            color: token.colorTextTertiary
          },

          [`&${token.rootCls}-collapse-item-active`]: {
            [`${token.componentCls}-token-list-map-collapse-grouped`]: {
              opacity: 1,
              pointerEvents: 'auto'
            }
          }
        }
      },

      [`${token.componentCls}-token-collapse-map`]: {
        borderRadius: 0,
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorSplit}`,
        paddingLeft: 12,
        fontSize: 12,

        '&:not(:last-child)': {
          borderBottom: 'none'
        },

        [`${token.componentCls}-token-collapse-map-collapse-token`]: {
          color: token.colorTextSecondary,
          marginInlineStart: 4,
          marginInlineEnd: 8
        },

        [`${token.componentCls}-token-collapse-map-collapse-preview`]: {
          display: 'flex',
          flex: 'none',
          borderLeft: `1px solid ${token.colorSplit}`,
          cursor: 'pointer',
          [`${token.componentCls}-token-collapse-map-collapse-preview-color`]: {
            height: 40,
            width: 40,
            position: 'relative'
          }
        }
      }
    },

    [`${token.componentCls}-token-collapse-map-collapse-count`]: {
      color: token.colorTextTertiary,
      display: 'inline-block',
      fontSize: 12,
      lineHeight: '16px',
      padding: '0 6px',
      backgroundColor: token.colorFillTertiary,
      borderRadius: 4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginLeft: 'auto',
      marginRight: 12,
      maxWidth: 100,
      flex: 'none',
      whiteSpace: 'nowrap',
      cursor: 'pointer'
    },

    [`${token.componentCls}-token-pick`]: {
      transition: 'color 0.3s'
    },

    [`${token.componentCls}-token-picked`]: {
      color: token.colorPrimary
    },

    [`${token.componentCls}-grouped-map-collapse${token.rootCls}-collapse`]: {
      borderRadius: `4px 4px 0 0`,
      [`> ${token.rootCls}-collapse-item`]: {
        [`&:last-child`]: {
          borderRadius: 0
        },
        [`> ${token.rootCls}-collapse-header`]: {
          padding: '6px 12px',
          color: token.colorIcon,
          fontSize: 12,
          lineHeight: token.lineHeightSM,
          [`${token.rootCls}-collapse-expand-icon`]: {
            lineHeight: '20px',
            height: 20
          }
        },
        [`> ${token.rootCls}-collapse-content > ${token.rootCls}-collapse-content-box`]: {
          padding: 0,

          [`${token.componentCls}-token-collapse-map`]: {
            borderInline: 0,
            '&:last-child': {
              borderBottom: 0
            },
            '&:first-child': {
              borderTop: 0
            }
          }
        }
      }
    }
  }
}))
