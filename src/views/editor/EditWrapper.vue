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
import { computed, nextTick, ref } from 'vue'
import { pick } from 'lodash-es'
const props = defineProps<{
  id: string
  active: boolean
  props: Object
}>()
const emits = defineEmits(['set-active', 'update-position'])
const editorWrapperRef = ref<null | HTMLElement>(null)

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
let isMoving = false
const calculateMovePosition = (e: MouseEvent) => {
  const container = document.getElementById('canvas-area') as HTMLElement
  const left = e.clientX - gap.x - container.offsetLeft
  const top = e.clientY - gap.y - container.offsetTop
  return {
    left,
    top
  }
}
const startMove = (e: MouseEvent) => {
  const currentElement = editorWrapperRef.value
  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
  }
  const handleMove = (e: MouseEvent) => {
    isMoving = true
    const { left, top } = calculateMovePosition(e)
    if (currentElement) {
      currentElement.style.top = top + 'px'
      currentElement.style.left = left + 'px'
    }
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    if (isMoving) {
      const { left, top } = calculateMovePosition(e)
      emits('update-position', { left, top, id: props.id })
      isMoving = false
    }

    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style lang="scss">
.edit-wrapper {
  & > * {
    position: static !important;
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
