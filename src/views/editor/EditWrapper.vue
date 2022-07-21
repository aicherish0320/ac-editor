<template>
  <div
    class="edit-wrapper"
    @click="onItemClick(id)"
    :class="{ active: active }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  active: boolean
}>()
const emits = defineEmits(['set-active'])

const onItemClick = (id: string) => {
  emits('set-active', id)
}
</script>

<style lang="scss">
.edit-wrapper {
  // position: absolute;
  & > * {
    position: static !important;
    width: 100% !important;
    height: 100% !important;
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
