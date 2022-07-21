<template>
  <div class="file-upload">
    <a-button type="primary" @click="triggerUpload">
      <span v-if="fileStatus === 'loading'">正在上传</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else-if="fileStatus === 'error'">上传失败</span>
      <span v-else>点击上传</span>
    </a-button>
    <input
      ref="fileInput"
      type="file"
      :style="{ display: 'none' }"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'

const props = defineProps<{
  action: string
}>()

const fileInput = ref<null | HTMLInputElement>(null)
const fileStatus = ref<UploadStatus>('ready')
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    fileStatus.value = 'loading'
    const uploadedFile = files[0]
    const formData = new FormData()
    formData.append('file', uploadedFile)

    fetch(props.action, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .then((ret) => {
        fileStatus.value = 'success'
        console.log('ret >>> ', ret)
      })
      .catch(() => {
        fileStatus.value = 'error'
      })
  }
}
</script>

<style scoped></style>
