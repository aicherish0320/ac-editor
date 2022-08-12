<template>
  <div
    class="edit-wrapper"
    ref="editorWrapperRef"
    :data-component-id="id"
    :style="styles"
    :class="{ active: active }"
    @click="onItemClick(id)"
    @mousedown="startMove"
  >
    <slot></slot>
    <div class="resizes">
      <div
        class="resize top-left"
        @mousedown.stop="startResize('top-left')"
      ></div>
      <div
        class="resize top-right"
        @mousedown.stop="startResize('top-right')"
      ></div>
      <div
        class="resize bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      ></div>
      <div
        class="resize bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      ></div>
    </div>
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
type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
  left: number
  right: number
  top: number
  bottom: number
}

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
  const top = e.clientY - gap.y - container.offsetTop + container.scrollTop
  return {
    left,
    top
  }
}
const calculateSize = (
  direction: ResizeDirection,
  e: MouseEvent,
  positions: OriginalPositions
) => {
  const { clientX, clientY } = e
  const { left, right, top, bottom } = positions
  const container = document.getElementById('canvas-area') as HTMLElement
  const rightWidth = clientX - left
  const leftWidth = right - clientX
  const bottomHeight = clientY - top
  const topHeight = bottom - clientY
  const topOffset = clientY - container.offsetTop + container.scrollTop
  const leftOffset = clientX - container.offsetLeft

  switch (direction) {
    case 'top-left':
      return {
        width: leftWidth,
        height: topHeight,
        top: topOffset,
        left: leftOffset
      }
    case 'top-right':
      return {
        width: rightWidth,
        height: topHeight,
        top: topOffset
      }
    case 'bottom-left':
      return {
        width: leftWidth,
        height: bottomHeight,
        left: leftOffset
      }
    case 'bottom-right':
      return {
        width: rightWidth,
        height: bottomHeight
      }
    default:
      break
  }
}

const startResize = (direction: ResizeDirection) => {
  const currentElement = editorWrapperRef.value as HTMLElement
  const { top, left, bottom, right } = currentElement.getBoundingClientRect()
  const handleMove = (e: MouseEvent) => {
    const size = calculateSize(direction, e, { left, right, top, bottom })
    const { style } = currentElement
    if (size) {
      style.width = size.width + 'px'
      style.height = size.height + 'px'
      if (size.left) {
        style.left = size.left + 'px'
      }
      if (size.top) {
        style.top = size.top + 'px'
      }
    }
  }
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    const size = calculateSize(direction, e, { left, right, top, bottom })
    emits('update-position', { ...size, id: props.id })
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
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

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  box-sizing: content-box !important;
}
.edit-wrapper > * {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.hidden {
  display: none;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .resizes {
  display: none;
}
.edit-wrapper.active .resizes {
  display: block;
}
.edit-wrapper.active .resizes .resize {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #1890ff;
  position: absolute;
}
.edit-wrapper .resizes .resize.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.edit-wrapper .resizes .resize.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizes .resize.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizes .resize.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
