import { InputNumber, Slider } from 'ant-design-vue'
import { defineComponent, toRefs } from 'vue'

export type InputNumberPlusProps = {
  value?: number
  min?: number
  max?: number
  onChange?: (value: number | null) => void
}

export const InputNumberPlus = defineComponent({
  name: 'InputNumberPlus',
  inheritAttrs: false,
  props: {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number }
  },
  emits: {
    change: (value: string | number | [number, number]) => true
  },
  setup(props, { emit }) {
    const { value, min, max } = toRefs(props)

    const onChange = (value: string | number | [number, number]) => {
      emit('change', value)
    }

    return () => (
      <div style={{ display: 'flex', width: 200 }}>
        <Slider
          style={{ flex: '0 0 120px', marginRight: 12 }}
          value={value.value}
          min={min.value}
          max={max.value}
          onChange={onChange}
        />
        <InputNumber
          value={value.value}
          min={min.value}
          max={max.value}
          onChange={onChange}
          style={{ flex: 1 }}
        />
      </div>
    )
  }
})
