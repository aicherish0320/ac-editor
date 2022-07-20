<template>
  <div class="props-table">
    <div v-for="(item, key) in finalProps" :key="key" class="prop-item">
      <span class="label">{{ item?.text }}</span>
      <div class="prop-component">
        <component
          :is="item?.component"
          :value="item?.value"
          v-bind="item?.extraProps"
        ></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TextComponentProps } from '@/common/defaultProps'
import { mapPropsToForms, PropsToForms } from '@/common/propsMap'
import { reduce } from 'lodash-es'
import { computed } from 'vue'

const props = defineProps<{
  props: TextComponentProps
}>()

const finalProps = computed(() => {
  return reduce(
    props.props,
    (result, value, key) => {
      const newKey = key as keyof TextComponentProps
      const item = mapPropsToForms[newKey]
      if (item) {
        item.value = value
        result[newKey] = item
      }
      return result
    },
    {} as PropsToForms
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
