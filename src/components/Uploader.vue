<template>
  <div class="file-upload">
    <a-button type="primary" @click="triggerUpload" :disabled="isUploading">
      <span v-if="isUploading">正在上传</span>
      <span v-else>点击上传</span>
    </a-button>
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

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'

interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
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
const removeFile = (id: string) => {
  console.log('id >>> ', id)
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
      .then(() => {
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
