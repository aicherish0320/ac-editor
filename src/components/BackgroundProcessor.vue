<template>
  <div class="background-processor">
    <StyleUploader v-if="!value" @success="onImageUploaded"></StyleUploader>
    <ImageProcessor
      v-else
      :value="value"
      @change="handleUploadUrl"
      :show-delete="true"
    ></ImageProcessor>
  </div>
</template>

<script setup lang="ts">
import StyleUploader from './StyleUploader.vue'
import ImageProcessor from './ImageProcessor.vue'

defineOptions({
  name: 'BackgroundProcessor'
})
const props = defineProps<{
  value: string
}>()

const emits = defineEmits(['change'])

const onImageUploaded = (data: any) => {
  emits('change', data.resp.url)
}

const handleUploadUrl = (url: string) => {
  emits('change', url)
}
</script>

<style scoped></style>
