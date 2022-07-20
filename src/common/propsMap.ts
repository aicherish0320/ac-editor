import { markRaw } from 'vue'
import { TextComponentProps } from './defaultProps'
import { Input } from 'ant-design-vue'
import 'ant-design-vue/es/input/style/index.css'

export interface PropToForm {
  component: any
  value?: string
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForms: PropsToForms = {
  text: {
    component: markRaw(Input)
  }
}
