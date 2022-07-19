import { Module } from 'vuex'
import { v4 as uuidV4 } from 'uuid'
import { GlobalDataProps } from '../'
import AcText from '../../components/AcText.vue'

interface ComponentData {
  props: { [key: string]: any }
  id: string
  name: any
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  // 当前编辑的是哪个元素，uuid
  // currentElement: string
}

export const testComponents: ComponentData[] = [
  {
    id: uuidV4(),
    name: AcText,
    props: { text: 'hello', fontSize: '20px' }
  },
  {
    id: uuidV4(),
    name: AcText,
    props: { text: 'hello2', fontSize: '30px' }
  }
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents
  }
}

export default editor
