<template>
  <div class="props-table">
    <div v-for="(item, key) in finalProps" :key="key" class="prop-item">
      <span class="label">{{ item?.text }}</span>
      <div class="prop-component">
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
              {{ option.text }}
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TextComponentProps } from '@/common/defaultProps'
import { mapPropsToForms } from '@/common/propsMap'
import { reduce } from 'lodash-es'
import { computed } from 'vue'

interface FormProps {
  component: any
  subComponent?: any
  value: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string; value: any }[]
  valueProp: string
  eventName: string
  events: { [key: string]: (e: any) => void }
}

const props = defineProps<{
  props: TextComponentProps
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

<style scoped lang="scss">
.prop-item {
  display: flex;
  margin-bottom: 10px;
  .label {
    width: 30%;
  }
  .prop-component {
    width: 70%;
  }
}
</style>
