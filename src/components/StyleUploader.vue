<template>
  <Uploader
    action="http://localhost:3300/upload"
    @success="
      (data) => {
        handleUploadSuccess(data.resp, data.file.raw)
      }
    "
  >
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>{{ text }}</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded="dataProps">
      <div class="uploader-container">
        <img :src="dataProps.uploadedData.data.url" v-if="showUploaded" />
        <template v-else>
          <FileImageOutlined />
          <h4>{{ text }}</h4>
        </template>
      </div>
    </template>
  </Uploader>
</template>

<script setup lang="ts">
import Uploader from './Uploader.vue'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'

withDefaults(
  defineProps<{
    text?: string
    showUploaded?: boolean
  }>(),
  {
    text: '上传图片',
    showUploaded: false
  }
)
const emits = defineEmits(['success'])

const handleUploadSuccess = (resp: any, file: File) => {
  emits('success', { resp, file })
}
</script>

<style scoped>
.uploader-container {
  display: flex;
}
</style>
