import { computed, defineComponent, ref, toRefs, watchEffect, type PropType } from 'vue'
import { Input, Popover, Switch } from 'ant-design-vue'
import { InputNumberPlus } from './InputNumberPlus'
import { ColorPicker } from '../color-picker'
import { debounce } from 'lodash'
import seed from 'ant-design-vue/es/theme/themes/seed'
import getDesignToken from '../../utils/getDesignToken'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import type { MutableTheme } from '../interface'

export type SeedTokenProps = {
  theme: MutableTheme
  tokenName: string
  disabled?: boolean
}

export const SeedTokenPreview = defineComponent({
  name: 'SeedTokenPreview',
  inheritAttrs: false,
  props: {
    prefixCls: { type: String, required: true },
    theme: { type: Object as PropType<MutableTheme>, required: true },
    tokenName: { type: String, required: true },
    disabled: { type: Boolean }
  },
  setup(props, { slots, attrs }) {
    const { theme, tokenName, disabled } = toRefs(props)

    const getSeedValue = (config: ThemeConfig, token: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return config.token?.[token] || seed[token] || getDesignToken(config)[token]
    }

    const seedRange: Record<string, { min: number; max: number }> = {
      borderRadius: {
        min: 0,
        max: 16
      },
      fontSize: {
        min: 12,
        max: 32
      },
      sizeStep: {
        min: 0,
        max: 16
      },
      sizeUnit: {
        min: 0,
        max: 16
      },
      margin: {
        min: 0,
        max: 32
      },
      padding: {
        min: 0,
        max: 32
      }
    }

    // const tokenPath = computed(() => ['token', tokenName.value]);
    const tokenValue = ref<number>(getSeedValue(theme.value.config, tokenName.value))
    // const showReset = computed(() => theme.value.getCanReset?.(tokenPath.value));

    const onThemeChange = (newValue: number | string) => {
      theme.value.onThemeChange?.(
        {
          ...theme.value.config,
          token: {
            ...theme.value.config.token,
            [tokenName.value]: newValue
          }
        },
        ['token', tokenName.value]
      )
    }

    const debouncedOnChange = debounce(onThemeChange, 200)

    const onChange = (value: number | string) => {
      tokenValue.value = value
      debouncedOnChange(value)
    }

    watchEffect(() => {
      tokenValue.value = getSeedValue(theme.value.config, tokenName.value)
    })

    const tokenGroup = computed(() =>
      ['fontSize', 'sizeUnit', 'sizeStep', 'borderRadius', 'margin', 'padding'].find(
        (prefix) => tokenName.value.startsWith(prefix)
      )
    )

    const nonColorInput = (
      <>
        {tokenGroup.value && (
          <InputNumberPlus
            value={tokenValue.value}
            onChange={onChange}
            min={seedRange[tokenGroup.value].min}
            max={seedRange[tokenGroup.value].max}
          />
        )}
        {['boxShadow', 'lineHeight'].some((prefix) =>
          tokenName.value.startsWith(prefix)
        ) && (
          <div>
            <Input.TextArea
              value={tokenValue}
              onChange={({ target: { value } }) => onChange(value!)}
              style={{ width: 200 }}
            />
          </div>
        )}
        {tokenName.value === 'wireframe' && (
          <Switch checked={tokenValue.value} onChange={onChange} />
        )}
      </>
    )

    // ???
    if (slots.default) {
      return () => (
        <>
          {tokenName.value.startsWith('color') ? (
            <>{slots.default()}</>
          ) : (
            // <ColorPicker
            //   class={[attrs.class]}
            //   onChangeComplete={(newColor) => onThemeChange(newColor.toHexString())}
            //   value={tokenValue}
            // >
            //   {slots.default()}
            // </ColorPicker>
            <Popover
              class={[attrs.class]}
              arrow={false}
              placement="bottomRight"
              trigger="click"
              content={nonColorInput}
            >
              {slots.default()}
            </Popover>
          )}
        </>
      )
    }

    return () => (
      <div class={[`${props.prefixCls}-token-list-seed-block-sample`, attrs.class]}>
        {tokenName.value.startsWith('color') && (
          <ColorPicker
            onChangeComplete={(newColor) => onThemeChange(newColor.toHexString())}
            value={tokenValue}
          >
            {
              <div
                class={`${props.prefixCls}-token-list-seed-block-sample-card`}
                style={{ pointerEvents: disabled.value ? 'none' : 'auto' }}
              >
                <div
                  style={{
                    backgroundColor: tokenValue,
                    width: 48,
                    height: 32,
                    borderRadius: 6,
                    marginRight: 10,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.09)'
                  }}
                />
                <div class={`${props.prefixCls}-token-list-seed-block-sample-card-value`}>
                  {tokenValue}
                </div>
              </div>
            }
          </ColorPicker>
        )}
        {nonColorInput}
      </div>
    )
  }
})
