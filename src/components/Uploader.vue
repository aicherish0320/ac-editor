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
    <ul v-if="showUploadList">
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
    autoUpload?: boolean
    showUploadList?: boolean
  }>(),
  { drag: false, autoUpload: true, showUploadList: false }
)
const emits = defineEmits(['success', 'error'])

const fileInput = ref<null | HTMLInputElement>(null)
const fileStatus = ref<UploadStatus>('ready')
const isDragOver = ref(false)
const filesList = ref<UploadFile[]>([])

const uploadedFiles = ref<UploadFile[]>([])
const isUploading = computed(() =>
  filesList.value.some((file) => file.status === 'loading')
)
const lastFileData = computed(() => {
  const lastFile = last(filesList.value)
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.resp
    }
  }
  return false
})
const removeFile = (id: string) => {
  filesList.value = filesList.value.filter((file) => file.uid !== id)
}

const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const postFile = (readyFile: UploadFile) => {
  const formData = new FormData()
  formData.append('file', readyFile.raw)
  readyFile.status = 'loading'

  fetch(props.action, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((resp) => {
      readyFile.resp = resp.data
      readyFile.status = 'success'
      emits('success', {
        resp: resp.data,
        file: readyFile,
        list: filesList.value
      })
    })
    .catch((e) => {
      readyFile.status = 'error'
      emits('error', { error: e, file: readyFile, list: filesList.value })
    })
    .finally(() => {
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    })
}

const addFileToList = (uploadedFile: File) => {
  const fileObj = reactive<UploadFile>({
    uid: uuidV4(),
    size: uploadedFile.size,
    name: uploadedFile.name,
    status: 'loading',
    raw: uploadedFile
  })
  uploadedFiles.value.push(fileObj)
  filesList.value.push(fileObj)
  if (props.autoUpload) {
    postFile(fileObj)
  }
}

const beforeUploadCheck = (files: null | FileList) => {
  if (files) {
    const uploadedFile = files[0]
    if (props.beforeUpload) {
      const ret = props.beforeUpload(uploadedFile)
      if (ret && ret instanceof Promise) {
        ret
          .then((processedFile) => {
            addFileToList(processedFile)
          })
          .catch((e) => {
            console.error(e)
          })
      } else if (ret) {
        addFileToList(uploadedFile)
      }
    } else {
      addFileToList(uploadedFile)
    }
  }
}

const uploadFiles = () => {
  filesList.value
    .filter((file) => file.status === 'ready')
    .forEach((readyFile) => postFile(readyFile))
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  beforeUploadCheck(target.files)
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
    beforeUploadCheck(files)
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
