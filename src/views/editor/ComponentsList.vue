<template>
  <div class="create-component-list">
    <div
      class="component-item"
      v-for="(item, index) in list"
      :key="index"
      @click="onItemClick(item)"
    >
      <AcText v-bind="item"></AcText>
    </div>
    <StyleUploader @success="onImageUploaded"></StyleUploader>
  </div>
</template>

<script setup lang="ts">
import { imageDefaultProps, TextComponentProps } from '@/common/defaultProps'
import AcText from '@/components/AcText.vue'
import AcImage from '@/components/AcImage.vue'
import { ComponentData } from '@/store/modules/editor'
import { markRaw } from 'vue'
import { v4 as uuidV4 } from 'uuid'
import { message } from 'ant-design-vue'
import StyleUploader from '@/components/StyleUploader.vue'
import { getImageDimensions } from '@/helpers'

defineProps<{ list: Partial<TextComponentProps>[] }>()

const emits = defineEmits(['on-item-click'])

const onItemClick = (props: TextComponentProps) => {
  const componentData: ComponentData = {
    name: markRaw(AcText),
    id: uuidV4(),
    props
  }

  emits('on-item-click', componentData)
}

const onImageUploaded = (data: any) => {
  const componentData: ComponentData = {
    name: markRaw(AcImage),
    id: uuidV4(),
    props: {
      ...imageDefaultProps
    }
  }
  message.success('上传成功')
  componentData.props.src = data.resp.url
  getImageDimensions(data.resp.url).then(({ width }) => {
    console.log(width)
    const maxWidth = 373
    componentData.props.width = (width > maxWidth ? maxWidth : width) + 'px'
    emits('on-item-click', componentData)
  })
}
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
.component-item > * {
  position: static !important;
}
</style>
