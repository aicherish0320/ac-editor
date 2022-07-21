import { markRaw } from 'vue'
import { Module } from 'vuex'
import { v4 as uuidV4 } from 'uuid'
import { GlobalDataProps } from '..'
import AcText from '@/components/AcText.vue'
import { TextComponentProps } from '@/common/defaultProps'

export interface ComponentData {
  props: { [key: string]: any }
  id: string
  name: any
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
    props: {
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
    props: { text: 'hello2', fontSize: '30px', top: '40px' }
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
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidV4(),
        name: markRaw(AcText),
        props
      }
      state.components.push(newComponent)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    }
  }
}

export default editor
