import { markRaw } from 'vue'
import { Module } from 'vuex'
import { v4 as uuidV4 } from 'uuid'
import { GlobalDataProps } from '..'
import AcText from '@/components/AcText.vue'
import AcImage from '@/components/AcImage.vue'
import {
  ImageComponentProps,
  imageDefaultProps,
  TextComponentProps,
  textDefaultProps
} from '@/common/defaultProps'

export interface ComponentData {
  props: Partial<TextComponentProps & ImageComponentProps>
  id: string
  name: any
  // 图层是否隐藏
  isHidden?: boolean
  // 图层是否锁定
  isLocked?: boolean
  // 图层名称
  layerName?: string
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的是哪个元素，uuid
  currentElement: string
}

export const testComponents: ComponentData[] = [
  {
    id: uuidV4(),
    name: markRaw(AcText),
    layerName: '图层一',
    props: {
      ...textDefaultProps,
      text: 'hello',
      fontSize: '20px',
      top: '10px',
      lineHeight: '1',
      textAlign: 'center',
      fontFamily: '黑体'
    }
  },
  {
    id: uuidV4(),
    name: markRaw(AcText),
    layerName: '图层二',
    props: {
      ...textDefaultProps,
      text: 'hello2',
      fontSize: '30px',
      top: '40px'
    }
  },
  {
    id: uuidV4(),
    name: markRaw(AcImage),
    layerName: '图层三',
    props: {
      src: 'https://aic-lego.oss-cn-hangzhou.aliyuncs.com/editor-uploads/kj.jpeg',
      width: '300px'
    }
  }
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: ''
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find(
        (component) => component.id === state.currentElement
      )
    }
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      state.components.push(component)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    updateComponent(state, { id, key, value, isRoot }) {
      const updatedComponent = state.components.find(
        (component) => component.id === (id || state.currentElement)
      )
      if (updatedComponent) {
        if (isRoot) {
          updatedComponent[key as keyof ComponentData] = value
        } else {
          updatedComponent.props[key as keyof TextComponentProps] = value
        }
      }
    }
  }
}

export default editor
