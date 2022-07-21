import { markRaw } from 'vue'
import { TextComponentProps } from './defaultProps'
import {
  Textarea,
  InputNumber,
  Slider,
  RadioButton,
  RadioGroup,
  Select,
  SelectOption
} from 'ant-design-vue'
import 'ant-design-vue/es/input/style/index.css'
import 'ant-design-vue/es/input-number/style/index.css'
import 'ant-design-vue/es/slider/style/index.css'
import 'ant-design-vue/es/radio/style/index.css'
import 'ant-design-vue/es/select/style/index.css'

export interface PropToForm {
  component: any
  subComponent?: any
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string; value: any }[]
  initialTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  valueProp?: string
  eventName?: string
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForms: PropsToForms = {
  text: {
    component: markRaw(Textarea),
    extraProps: { rows: 3 },
    text: '文本',
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    component: markRaw(InputNumber),
    text: '字号',
    initialTransform: (v: string) => parseFloat(v)
  },
  lineHeight: {
    component: markRaw(Slider),
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    text: '行高',
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  textAlign: {
    component: markRaw(RadioGroup),
    subComponent: markRaw(RadioButton),
    text: '对齐',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: markRaw(Select),
    subComponent: markRaw(SelectOption),
    text: '字体',
    options: [
      { text: '无', value: '' },
      { text: '宋体', value: '"SimSun", "STSong"' },
      { text: '黑体', value: '"SimHei", "STHeiti"' }
    ]
  }
}
