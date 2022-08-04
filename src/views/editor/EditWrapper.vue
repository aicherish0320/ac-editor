<template>
  <div
    class="edit-wrapper"
    ref="editorWrapperRef"
    :style="styles"
    :class="{ active: active }"
    @click="onItemClick(id)"
    @mousedown="startMove"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { pick } from 'lodash-es'
const props = defineProps<{
  id: string
  active: boolean
  props: Object
}>()
const emits = defineEmits(['set-active'])

const onItemClick = (id: string) => {
  emits('set-active', id)
}

const styles = computed(() =>
  pick(props.props, ['position', 'top', 'left', 'width', 'height'])
)

const gap = {
  x: 0,
  y: 0
}
const editorWrapperRef = ref<null | HTMLElement>(null)
const startMove = (e: MouseEvent) => {
  const currentElement = editorWrapperRef.value
  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
  }
  console.log('gap >>> ', gap)
}
</script>

<style lang="scss">
.edit-wrapper {
  // position: absolute;
  & > * {
    position: static !important;
    // width: 100% !important;
    // height: 100% !important;
  }
  &:hover {
    border: 1px dashed #ccc;
  }
  &.active {
    border: 1px solid #1890ff;
    user-select: none;
    z-index: 1500;
  }
}
</style>
