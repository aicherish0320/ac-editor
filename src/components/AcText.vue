<template>
  <component :is="tag" :style="styleProps" class="ac-text-component">{{
    props.text
  }}</component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { pick } from 'lodash-es'
interface Props {
  text: string
  fontSize: string
  tag?: string
}
const props = withDefaults(defineProps<Props>(), {
  tag: 'div'
})
console.log('props >>> ', props)
const styleProps = computed(() => pick(props, ['fontSize']))
console.log('styleProps >>> ', styleProps)
</script>

<style scoped></style>
