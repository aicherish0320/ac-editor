import { markRaw } from 'vue'
import { Module } from 'vuex'
import { v4 as uuidV4 } from 'uuid'
import { GlobalDataProps } from '..'
import AcText from '@/components/AcText.vue'
import AcImage from '@/components/AcImage.vue'
import {
  AllComponentProps,
  ImageComponentProps,
  imageDefaultProps,
  TextComponentProps,
  textDefaultProps
} from '@/common/defaultProps'

export interface ComponentData {
  props: Partial<AllComponentProps>
  id: string
  name: any
  // 图层是否隐藏
  isHidden?: boolean
  // 图层是否锁定
  isLocked?: boolean
  // 图层名称
  layerName?: string
}

export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  height: string
}

export interface PageData {
  id?: number
  props?: PageProps
  title?: string
  desc?: string
  coverImg?: string
  uuid?: string
  setting?: { [key: string]: any }
  isTemplate?: boolean
  isHot?: boolean
  isNew?: boolean
  author?: string
  copiedCount?: number
  status?: number
  user?: {
    gender: string
    nickName: string
    picture: string
    userName: string
  }
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的是哪个元素，uuid
  currentElement: string
  //
  page: PageData
}

export type AllFormProps = PageProps & AllComponentProps

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
      ...imageDefaultProps,
      src: 'https://aic-lego.oss-cn-hangzhou.aliyuncs.com/editor-uploads/kj.jpeg',
      width: '300px'
    }
  }
]

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '660px'
}

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    }
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
    },
    updatePage(state, { key, value }) {
      if (state.page.props) {
        state.page.props[key as keyof PageProps] = value
      }
    }
  }
}

export default editor
