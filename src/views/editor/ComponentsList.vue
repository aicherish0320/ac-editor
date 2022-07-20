<template>
  <div v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
    <AcText v-bind="item"></AcText>
  </div>
</template>

<script setup lang="ts">
import AcText from '../../components/AcText.vue'

defineProps({
  list: Array
})

const emits = defineEmits(['on-item-click'])

const onItemClick = (data: any) => {
  emits('on-item-click', data)
}
</script>

<style scoped></style>
