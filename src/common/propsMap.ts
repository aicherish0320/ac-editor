import { markRaw, VNode, h } from 'vue'
import { AllComponentProps } from './defaultProps'
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
import {
  Textarea,
  InputNumber,
  Slider,
  RadioButton,
  RadioGroup,
  Select,
  SelectOption,
  Input
} from 'ant-design-vue'
import 'ant-design-vue/es/input/style/index.css'
import 'ant-design-vue/es/input-number/style/index.css'
import 'ant-design-vue/es/slider/style/index.css'
import 'ant-design-vue/es/radio/style/index.css'
import 'ant-design-vue/es/select/style/index.css'
import { AllFormProps } from '@/store/modules/editor'

export interface PropToForm {
  component: any
  subComponent?: any
  extraProps?: { [key: string]: any }
  extraClass?: string[]
  text?: string
  options?: { text: string | VNode; value: any }[]
  initialTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  valueProp?: string
  eventName?: string
}

export type PropsToForms = {
  [P in keyof AllFormProps]?: PropToForm
}

const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' }
]
const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: h('span', { style: { fontFamily: font.value } }, font.text)
  }
})

const pxToNumberHandler: PropToForm = {
  component: markRaw(InputNumber),
  initialTransform: (v: string) => (v ? parseInt(v) : 0),
  afterTransform: (e: number) => (e ? `${e}px` : '')
}

const defaultHandler = {
  component: markRaw(Input),
  eventName: 'change',
  valueProp: 'value',
  initialTransform: (v: any) => v,
  afterTransform: (e: any) => e
}

export const mapPropsToForms: PropsToForms = {
  text: {
    component: markRaw(Textarea),
    extraProps: { rows: 3 },
    text: '文本',
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    text: '字号',
    ...pxToNumberHandler
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
    options: [{ text: '无', value: '' }, ...fontFamilyOptions]
  },
  fontWeight: {
    component: markRaw(IconSwitch),
    initialTransform: (v: string) => v === 'bold',
    afterTransform: (e: boolean) => (e ? 'bold' : 'normal'),
    valueProp: 'checked',
    extraProps: { iconName: markRaw(BoldOutlined), tip: '加粗' }
  },
  fontStyle: {
    component: markRaw(IconSwitch),
    initialTransform: (v: string) => v === 'italic',
    afterTransform: (e: boolean) => (e ? 'italic' : 'normal'),
    valueProp: 'checked',
    extraProps: { iconName: markRaw(ItalicOutlined), tip: '斜体' }
  },
  textDecoration: {
    component: markRaw(IconSwitch),
    initialTransform: (v: string) => v === 'underline',
    afterTransform: (e: boolean) => (e ? 'underline' : 'none'),
    valueProp: 'checked',
    extraProps: { iconName: markRaw(UnderlineOutlined), tip: '下划线' }
  },
  width: {
    text: '宽度',
    ...pxToNumberHandler
  },
  height: {
    text: '高度',
    ...pxToNumberHandler
  },
  paddingLeft: {
    ...pxToNumberHandler,
    text: '左边距'
  },
  paddingRight: {
    ...pxToNumberHandler,
    text: '右边距'
  },
  paddingTop: {
    ...pxToNumberHandler,
    text: '上边距'
  },
  paddingBottom: {
    ...pxToNumberHandler,
    text: '下边距'
  },
  color: {
    text: '字体颜色',
    component: markRaw(ColorPicker)
  },
  backgroundColor: {
    text: '背景颜色',
    component: markRaw(ColorPicker)
  },
  borderStyle: {
    ...defaultHandler,
    component: markRaw(Select),
    subComponent: markRaw(SelectOption),
    text: '边框类型',
    options: [
      {
        value: 'none',
        text: '无'
      },
      {
        value: 'solid',
        text: '实线'
      },
      {
        value: 'dashed',
        text: '破折线'
      },
      {
        value: 'dotted',
        text: '点状线'
      }
    ]
  },
  borderColor: {
    ...defaultHandler,
    component: markRaw(ColorPicker),
    text: '边框颜色'
  },
  borderWidth: {
    ...pxToNumberHandler,
    component: markRaw(Slider),
    text: '边框宽度',
    extraProps: { min: 0, max: 20 }
  },
  borderRadius: {
    ...pxToNumberHandler,
    component: markRaw(Slider),
    text: '边框圆角',
    extraProps: { min: 0, max: 20 }
  },
  opacity: {
    component: markRaw(Slider),
    text: '透明度',
    initialTransform: (v: number) => (v ? v * 100 : 100),
    afterTransform: (e: number) => e / 100,
    extraProps: { min: 0, max: 100, reverse: true }
  },
  left: {
    text: 'X轴坐标',
    ...pxToNumberHandler
  },
  top: {
    text: 'Y轴坐标',
    ...pxToNumberHandler
  },
  actionType: {
    ...defaultHandler,
    component: markRaw(Select),
    subComponent: markRaw(SelectOption),
    text: '点击',
    options: [
      {
        value: '',
        text: '无'
      },
      {
        value: '',
        text: '跳转到 URL'
      }
    ]
  },
  url: {
    ...defaultHandler,
    afterTransform: (e: any) => e.target.value,
    text: '链接'
  },
  src: {
    component: markRaw(ImageProcessor)
  },
  boxShadow: {
    component: markRaw(ShadowPicker),
    extraClass: ['w100']
  },
  backgroundImage: {
    ...defaultHandler,
    component: markRaw(BackgroundProcessor),
    initialTransform: (v: string) => {
      if (v) {
        const reg = /\(["'](.+)["']\)/g
        const matches = reg.exec(v)
        if (matches && matches.length > 1) {
          return matches[1]
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    afterTransform: (e: string) => (e ? `url('${e}')` : '')
  }
}
