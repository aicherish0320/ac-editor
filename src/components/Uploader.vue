<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerUpload">
      <slot v-if="isUploading" name="loading">
        <a-button type="primary" disabled>正在上传</a-button>
      </slot>
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <a-button type="primary">点击上传</a-button>
      </slot>
      <slot v-else name="default">
        <a-button type="primary">点击上传</a-button>
      </slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      :style="{ display: 'none' }"
      @change="handleFileChange"
    />
    <ul>
      <li
        :class="`uploaded-file upload-${uploadedFile.status}`"
        v-for="uploadedFile in uploadedFiles"
        :key="uploadedFile.uid"
      >
        <span> {{ uploadedFile.name }}</span>
        <a-button type="danger" @click="removeFile(uploadedFile.uid)"
          >Del</a-button
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { v4 as uuidV4 } from 'uuid'
import { last } from 'lodash-es'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'

interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
  resp?: any
}

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
const uploadedFiles = ref<UploadFile[]>([])
const isUploading = computed(() =>
  uploadedFiles.value.some((file) => file.status === 'loading')
)
const lastFileData = computed(() => {
  const lastFile = last(uploadedFiles.value)
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp
    }
  }
  return false
})
const removeFile = (id: string) => {
  uploadedFiles.value = uploadedFiles.value.filter((file) => file.uid !== id)
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    fileStatus.value = 'loading'
    const uploadedFile = files[0]
    const formData = new FormData()
    formData.append('file', uploadedFile)
    const fileObj = reactive<UploadFile>({
      uid: uuidV4(),
      size: uploadedFile.size,
      name: uploadedFile.name,
      status: 'loading',
      raw: uploadedFile
    })
    uploadedFiles.value.push(fileObj)

    fetch(props.action, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .then((resp) => {
        fileObj.resp = resp.data
        fileStatus.value = 'success'
        fileObj.status = 'success'
      })
      .catch(() => {
        fileStatus.value = 'error'
        fileObj.status = 'error'
      })
      .finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
  }
}
</script>

<style scoped></style>
