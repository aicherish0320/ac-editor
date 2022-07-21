<template>
  <TemplateList :list="templateLists"></TemplateList>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import TemplateList from './TemplateList.vue'

const store = useStore<GlobalDataProps>()
const templateLists = computed(() => store.state.templates.data)
</script>

<style scoped></style>
