<template>
  <div class="image-processor">
    <AModal
      title="裁剪图片"
      v-model:visible="showModal"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img :src="baseImageUrl" id="processed-image" ref="cropperImg" />
      </div>
    </AModal>
    <div
      class="image-preview"
      :style="{ backgroundImage: backgroundUrl }"
      :class="{ extraHeight: showDelete }"
    ></div>
    <div class="image-process">
      <StyleUploader @success="handleFileUploaded"></StyleUploader>

      <AButton @click="showModal = true">
        <template v-slot:icon><ScissorOutlined /></template>裁剪图片
      </AButton>
      <a-button v-if="showDelete" type="danger" @click="handleDelete">
        <template v-slot:icon><DeleteOutlined /></template>删除图片
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message, Modal } from 'ant-design-vue'
import StyleUploader from './StyleUploader.vue'
import { ScissorOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { ref, computed, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'

const props = withDefaults(
  defineProps<{
    showDelete?: boolean
    value: string
  }>(),
  {
    showDelete: false
  }
)
const emits = defineEmits(['change'])

interface CropDataProps {
  x: number
  y: number
  width: number
  height: number
}

const showModal = ref(false)
let cropper: Cropper
let cropData: CropDataProps | null = null
const cropperImg = ref<null | HTMLImageElement>(null)
const backgroundUrl = computed(() => `url(${props.value})`)
const baseImageUrl = computed(() => props.value.split('?')[0])

const handleOk = () => {
  if (cropData) {
    const { x, y, width, height } = cropData
    //! 阿里OSS上传
    const cropperURL =
      baseImageUrl.value +
      `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
    emits('change', cropperURL)
    //! 手动上传
    // cropper.getCroppedCanvas().toBlob((blob) => {
    //   const formData = new FormData()
    //   formData.append('file', blob as Blob, 'cropper.jpg')
    //   fetch('http://localhost:3300/upload', {
    //     method: 'post',
    //     body: formData
    //   })
    //     .then((response) => response.json())
    //     .then((resp) => {
    //       console.log('resp >>> ', resp)
    //       emits('change', resp.data.url)
    //     })
    // })

    showModal.value = false
  }
}
const handleCancel = () => {
  showModal.value = false
}
const handleDelete = () => {
  emits('change', '')
}

const handleFileUploaded = (data: any) => {
  message.success('上传成功')
  emits('change', data.resp.url)
}

watch(
  showModal,
  async (newVal) => {
    if (cropperImg.value) {
      cropper = new Cropper(cropperImg.value, {
        aspectRatio: 16 / 9,
        crop(event: any) {
          const { x, y, width, height } = event.detail
          cropData = {
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.floor(width),
            height: Math.floor(height)
          }
        }
      })
    } else {
      if (cropper) {
        cropper.destroy()
      }
    }
  },
  { flush: 'post' }
)
</script>

<style scoped>
.image-processor {
  display: flex;
  justify-content: space-between;
}
.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background: no-repeat 50% / contain;
}
.image-preview.extraHeight {
  height: 110px;
}
.image-process {
  padding: 5px 0;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.image-cropper img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
