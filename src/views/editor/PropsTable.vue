<template>
  <div class="props-table">
    <div
      v-for="(item, key) in finalProps"
      :key="key"
      :class="{ 'no-text': !item.text }"
      class="prop-item"
      :id="`item-${key}`"
    >
      <span v-if="item.text" class="label">{{ item?.text }}</span>
      <div :class="`prop-component ${item.extraClass?.join(' ')}`">
        <component
          :is="item?.component"
          :[item?.valueProp]="item?.value"
          v-bind="item?.extraProps"
          v-on="item.events"
        >
          <template v-if="item?.options">
            <component
              :is="item.subComponent"
              v-for="(option, k) in item.options"
              :key="k"
              :value="option.value"
            >
              <RenderVNode :vNode="option.text"></RenderVNode>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AllComponentProps, TextComponentProps } from '@/common/defaultProps'
import { mapPropsToForms } from '@/common/propsMap'
import { reduce } from 'lodash-es'
import { computed, VNode } from 'vue'
import RenderVNode from '@/components/RenderVNode'

interface FormProps {
  component: any
  subComponent?: any
  value: string
  extraProps?: { [key: string]: any }
  extraClass?: string[]
  text?: string
  options?: { text: string | VNode; value: any }[]
  valueProp: string
  eventName: string
  events: { [key: string]: (e: any) => void }
}

const props = defineProps<{
  props: AllComponentProps
}>()

const emits = defineEmits(['change'])

const finalProps = computed(() => {
  return reduce(
    props.props,
    (result, value, key) => {
      const newKey = key as keyof TextComponentProps
      const item = mapPropsToForms[newKey]
      if (item) {
        const {
          valueProp = 'value',
          eventName = 'change',
          initialTransform,
          afterTransform
        } = item

        const newItem: FormProps = {
          ...item,
          value: initialTransform ? initialTransform(value) : value,
          valueProp,
          eventName,
          events: {
            [eventName]: (e: any) => {
              emits('change', {
                key,
                value: afterTransform ? afterTransform(e) : e
              })
            }
          }
        }

        result[newKey] = newItem
      }
      return result
    },
    {} as { [key: string]: FormProps }
  )
})
</script>

<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}
#item-fontWeight {
  margin-left: 28%;
}
.component-a-select .ant-select {
  width: 150px;
}
.prop-component.w100 {
  width: 100%;
}
</style>
