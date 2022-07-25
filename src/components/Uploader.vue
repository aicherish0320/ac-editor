<template>
  <div class="file-upload">
    <div
      class="upload-area"
      :class="{ 'is-dragover': drag && isDragOver }"
      v-on="events"
    >
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
type CheckUpload = (file: File) => boolean | Promise<File>

interface UploadFile {
  uid: string
  size: number
  name: string
  status: UploadStatus
  raw: File
  resp?: any
}

const props = withDefaults(
  defineProps<{
    action: string
    beforeUpload?: CheckUpload
    drag?: boolean
  }>(),
  { drag: false }
)

const fileInput = ref<null | HTMLInputElement>(null)
const fileStatus = ref<UploadStatus>('ready')
const isDragOver = ref(false)
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

const postFile = (uploadedFile: File) => {
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

const uploadFiles = (files: null | FileList) => {
  if (files) {
    const uploadedFile = files[0]
    if (props.beforeUpload) {
      const ret = props.beforeUpload(uploadedFile)
      if (ret && ret instanceof Promise) {
        ret
          .then((processFile) => {
            postFile(processFile)
          })
          .catch((e) => {
            console.error(e)
          })
      } else if (ret) {
        postFile(uploadedFile)
      }
    } else {
      postFile(uploadedFile)
    }
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  uploadFiles(target.files)
}

let events: { [key: string]: (e: any) => void } = {
  click: triggerUpload
}
const handleDrag = (e: DragEvent, over: boolean) => {
  e.preventDefault()
  isDragOver.value = over
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files) {
    uploadFiles(files)
  }

  isDragOver.value = false
}

if (props.drag) {
  events = {
    ...events,
    dragover: (e: DragEvent) => {
      handleDrag(e, true)
    },
    dragleave: (e: DragEvent) => {
      handleDrag(e, false)
    },
    drop: handleDrop
  }
}
</script>

<style scoped lang="scss">
.upload-area {
  border: 1px solid #ccc;
  &.is-dragover {
    border: 1px solid red;
  }
}
</style>
