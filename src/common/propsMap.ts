import { markRaw } from 'vue'
import { TextComponentProps } from './defaultProps'
import { Textarea, InputNumber, Slider } from 'ant-design-vue'
import 'ant-design-vue/es/input/style/index.css'
import 'ant-design-vue/es/input-number/style/index.css'
import 'ant-design-vue/es/slider/style/index.css'

export interface PropToForm {
  component: any
  value?: string
  extraProps?: { [key: string]: any }
  text?: string
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForms: PropsToForms = {
  text: {
    component: markRaw(Textarea),
    extraProps: { rows: 3 },
    text: '文本'
  },
  fontSize: {
    component: markRaw(InputNumber),
    text: '字号'
  },
  lineHeight: {
    component: markRaw(Slider),
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    text: '行高'
  }
}
