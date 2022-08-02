<template>
  <div class="inline-edit" @click.stop="handleClick" ref="inlineEditRef">
    <input
      v-model="innerValue"
      type="text"
      v-if="isEditing"
      placeholder="文本不能为空"
      class="ant-input"
      ref="inputRef"
    />
    <slot v-else :text="innerValue">
      <span>{{ innerValue }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import useKeyPress from '@/hooks/useKeyPress'
import useClickOutside from '@/hooks/useClickOutside'
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  value?: string
}>()
const emits = defineEmits(['change'])
const innerValue = ref(props.value)
const isEditing = ref(false)
const inlineEditRef = ref<null | HTMLElement>(null)
const inputRef = ref<null | HTMLInputElement>(null)
let cacheOldValue = ''

const isClickOutside = useClickOutside(inlineEditRef)

watch(isClickOutside, (newVal) => {
  if (newVal && isEditing) {
    isEditing.value = false
    emits('change', innerValue.value)
  }
  isClickOutside.value = false
})

watch(isEditing, async () => {
  if (isEditing.value) {
    cacheOldValue = innerValue.value as string
    await nextTick()
    if (inputRef.value) {
      inputRef.value.focus()
    }
  }
})

const handleClick = () => {
  isEditing.value = true
}

useKeyPress('Enter', () => {
  if (isEditing.value) {
    isEditing.value = false
    emits('change', innerValue.value)
  }
})

useKeyPress('Escape', () => {
  if (isEditing.value) {
    isEditing.value = false
    innerValue.value = cacheOldValue
  }
})
</script>

<style>
.inline-edit {
  border: 1px solid red;
  cursor: pointer;
}
.ant-input.input-error {
  border: 1px solid #f5222d;
}
.ant-input.input-error:focus {
  border-color: #f5222d;
}
.ant-input.input-error::placeholder {
  color: #f5222d;
}
</style>
