import { App } from 'vue'
import AcText from '@/components/AcText.vue'
import AcImage from '@/components/AcImage.vue'

import ColorPicker from '@/components/ColorPicker.vue'
import ImageProcessor from '@/components/ImageProcessor.vue'
import ShadowPicker from '@/components/ShadowPicker.vue'
import IconSwitch from '@/components/IconSwitch.vue'
import BackgroundProcessor from '@/components/BackgroundProcessor.vue'

import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined
} from '@ant-design/icons-vue'

const components = [
  AcText,
  AcImage,
  ColorPicker,
  ImageProcessor,
  ShadowPicker,
  IconSwitch,
  BackgroundProcessor,

  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined
]

export default {
  install(app: App) {
    components.forEach((component) => {
      app.component(component.name, component)
    })
  }
}
