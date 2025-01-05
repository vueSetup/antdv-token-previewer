import { defineComponent, computed, toRefs, type PropType, unref } from 'vue'
import { Collapse } from 'ant-design-vue'
import { CaretRightOutlined } from '@ant-design/icons-vue'
import { MapTokenCollapseContent } from './MapTokenCollapseContent'
// import MapTokenCollapseContent from './map-token-collapse-content.vue'
import { useLocale, type Locale } from '../../locale'
import type { MutableTheme, SelectedToken } from '../interface'
import type { TokenGroup } from '../../meta'

const { Panel } = Collapse

export type MapTokenCollapseProps = {
  theme: MutableTheme
  group: TokenGroup<string>
  selectedTokens?: SelectedToken
  groupFn?: (token: string) => string
  onTokenSelect?: (token: string | string[], type: keyof SelectedToken) => void
}

export const MapTokenCollapse = defineComponent({
  name: 'MapTokenCollapse',
  inheritAttrs: false,
  props: {
    prefixCls: { type: String, required: true },
    theme: { type: Object as PropType<MutableTheme>, required: true },
    group: { type: Object as PropType<TokenGroup<string>>, required: true },
    selectedTokens: { type: Object as PropType<SelectedToken> },
    groupFn: { type: Function as PropType<(token: string) => string> }
  },
  emits: {
    tokenSelect: (token: string | string[], type: keyof SelectedToken) => true
  },
  setup(props, { attrs, emit }) {
    const { theme, group, selectedTokens, groupFn } = toRefs(props)

    const locale = useLocale()

    const groupedTokens = computed(() => {
      const grouped: Record<string, string[]> = {}
      if (groupFn.value) {
        group.value.mapToken?.forEach((token) => {
          const key = groupFn.value?.(token) ?? 'default'
          grouped[key] = [...(grouped[key] ?? []), token]
        })
      }
      return grouped
    })

    const onTokenSelect = (token: string | string[], type: keyof SelectedToken) => {
      emit('tokenSelect', token, type)
    }

    if (groupFn.value) {
      return () => (
        <Collapse
          class={[`${props.prefixCls}-grouped-map-collapse`, attrs.class]}
          defaultActiveKey={Object.keys(groupedTokens)}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 450 : 360} style={{ fontSize: 12 }} />
          )}
        >
          {(group.value.mapTokenGroups ?? Object.keys(groupedTokens)).map((key) => (
            <Panel key={key} header={unref(locale)[key as keyof Locale] ?? ''}>
              <MapTokenCollapseContent
                prefixCls={props.prefixCls}
                mapTokens={groupedTokens.value[key]}
                theme={theme.value}
                selectedTokens={selectedTokens.value}
                onTokenSelect={onTokenSelect}
                type={group.value.type}
              />
            </Panel>
          ))}
        </Collapse>
      )
    }

    if (group.value.groups) {
      return () => (
        <Collapse
          class={[`${props.prefixCls}-grouped-map-collapse`, attrs.class]}
          defaultActiveKey={group.value.groups.map((item) => item.key)}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 450 : 360} style={{ fontSize: 12 }} />
          )}
        >
          {group.value.groups.map((item) => (
            <Panel key={item.key} header={item.name}>
              <MapTokenCollapseContent
                prefixCls={props.prefixCls}
                class={[attrs.class]}
                mapTokens={item.mapToken}
                theme={theme.value}
                selectedTokens={selectedTokens.value}
                onTokenSelect={onTokenSelect}
                type={item.type}
              />
            </Panel>
          ))}
        </Collapse>
      )
    }

    return () => (
      <MapTokenCollapseContent
        prefixCls={props.prefixCls}
        type={group.value.type}
        theme={theme.value}
        selectedTokens={selectedTokens.value}
        mapTokens={group.value.mapToken ?? []}
        onTokenSelect={onTokenSelect}
      />
    )
  }
})
