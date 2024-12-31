import { defineComponent } from 'vue'

export const ColorPicker = defineComponent({
  name: 'ColorPicker',
  setup() {
    return () => (
      <div>
        <input type="color" />
      </div>
    )
  }
})
