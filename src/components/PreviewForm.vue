<template>
  <div class="preview-form" v-if="visible">
    <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">
          {{ pageState.title }}
        </div>
        <div class="iframe-container">
          <iframe
            :src="previewURL"
            width="375"
            frameborder="0"
            class="iframe-placeholder"
            :height="
              pageState.props && pageState.props.height
                ? pageState.props.height
                : '560'
            "
          ></iframe>
        </div>
      </div>
    </div>
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closable="true"
      :visible="visible"
      @close="onCancel"
    >
      <div class="publish-form-container">
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6">扫描预览：</a-col>
          <a-col :span="10">
            <canvas id="preview-barcode-container"></canvas
          ></a-col>
        </a-row>
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6">上传封面：</a-col>
          <a-col :span="10">
            <StyleUploader
              text="上传封面"
              :uploaded="form.uploaded"
              @success="updateAvatar"
              showUploaded
            ></StyleUploader>
          </a-col>
        </a-row>
        <a-form
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          :model="form"
        >
          <a-form-item label="标题" required name="title">
            <a-input v-model:value="form.title"></a-input>
          </a-form-item>
          <a-form-item label="描述" required name="desc">
            <a-input v-model:value="form.desc"></a-input>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
            <a-button
              type="primary"
              style="margin-left: 10px"
              @click="validateAndSave"
              >保存</a-button
            >
            <a-button style="margin-left: 10px" @click="onCancel"
              >取消</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { GlobalDataProps } from '@/store'
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { generateQRCode, timeout } from '@/helpers'
import StyleUploader from './StyleUploader.vue'

withDefaults(
  defineProps<{
    visible: boolean
  }>(),
  {
    visible: false
  }
)

const emits = defineEmits(['update:visible'])

const store = useStore<GlobalDataProps>()
const pageState = computed(() => store.state.editor.page)
const previewURL = computed(
  () =>
    `http://182.92.168.192:8082/p/preview/${pageState.value.id}-${pageState.value.uuid}`
)
const { title, desc, setting } = pageState.value

const form = reactive({
  title: title || '',
  desc: desc || '',
  uploaded: {
    data: {
      url:
        (setting && setting.shareImg) ||
        'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png'
    }
  }
})

onMounted(async () => {
  try {
    await timeout(100)
    await generateQRCode('preview-barcode-container', previewURL.value)
  } catch (error) {
    console.error(error)
  }
})

const onCancel = () => {
  emits('update:visible', false)
}
const updateAvatar = () => {}
const validateAndSave = () => {}
</script>

<style>
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  position: relative;
  background: url('../assets/phone-back.png') no-repeat;
  background-size: cover;
}

.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 100%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  background: url('../assets/loading.svg') 50% 50% no-repeat;
  background-size: 50px;
}
.publish-form-container .file-upload-container {
  height: 130px;
}
.publish-form-container .ant-form-item-label {
  text-align: left;
}
#preview-barcode-container {
  border: 2px dotted #efefef;
  padding: 10px;
}
</style>
