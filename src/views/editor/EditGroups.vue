<template>
  <div class="edit-groups">
    <a-collapse v-model:activeKey="currentKey">
      <a-collapse-panel
        v-for="(item, index) in editGroups"
        :key="`item-${index}`"
        :header="item.text"
      >
        <PropsTable :props="item.props" @change="handleChange"></PropsTable>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { AllComponentProps } from '@/common/defaultProps'
import { difference } from 'lodash-es'
import { computed, ref } from 'vue'
import PropsTable from './PropsTable.vue'

const props = withDefaults(
  defineProps<{
    props: AllComponentProps
    // eslint-disable-next-line no-use-before-define
    groups?: GroupProps[]
  }>(),
  {
    groups: () => defaultEditGroups
  }
)
const emits = defineEmits(['change'])

const currentKey = ref('item-0')

const newGroups = computed(() => {
  const allNormalProps = props.groups.reduce((prev, current) => {
    return [...prev, ...current.items]
  }, [] as string[])

  const specialProps = difference(Object.keys(props.props), allNormalProps)

  return [
    {
      text: '基本属性',
      items: specialProps
    },
    ...props.groups
  ]
})

const editGroups = computed(() => {
  return newGroups.value.map((group) => {
    const propsMap = {} as AllComponentProps
    group.items.forEach((item) => {
      const key = item as keyof AllComponentProps
      propsMap[key] = props.props[key]!
    })
    return {
      ...group,
      props: propsMap
    }
  })
})

const handleChange = (e: any) => {
  emits('change', e)
}
</script>

<script lang="ts">
interface GroupProps {
  text: string
  items: string[]
}

const defaultEditGroups: GroupProps[] = [
  {
    text: '尺寸',
    items: [
      'height',
      'width',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
      'paddingBottom'
    ]
  },
  {
    text: '边框',
    items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius']
  },
  {
    text: '阴影与透明度',
    items: ['opacity', 'boxShadow']
  },
  {
    text: '位置',
    items: ['left', 'top']
  },
  {
    text: '事件功能',
    items: ['actionType', 'url']
  }
]

export default {}
</script>

<style scoped></style>
