import { Component, markRaw } from 'vue'
import { Module } from 'vuex'
import { v4 as uuidV4 } from 'uuid'
import store, { GlobalDataProps } from '..'
import AcText from '@/components/AcText.vue'
import AcImage from '@/components/AcImage.vue'
import {
  AllComponentProps,
  ImageComponentProps,
  imageDefaultProps,
  TextComponentProps,
  textDefaultProps
} from '@/common/defaultProps'
import { message } from 'ant-design-vue'
import { cloneDeep, update } from 'lodash-es'
import { insertAt } from '@/helpers'

export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'

export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}

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
  page: PageData
  copiedComponent?: ComponentData
  histories: HistoryProps[]
  historyIndex: number
}

export type AllFormProps = PageProps & AllComponentProps

export const testComponents: ComponentData[] = [
  {
    id: uuidV4(),
    name: markRaw(AcText),
    layerName: '图层一',
    props: {
      ...textDefaultProps,
      width: '200px',
      height: '100px',
      text: 'hello',
      fontSize: '20px',
      top: '30px',
      left: '30px',
      lineHeight: '1',
      textAlign: 'center',
      fontFamily: '黑体',
      backgroundColor: '#0f0'
    }
  }
  // {
  //   id: uuidV4(),
  //   name: markRaw(AcText),
  //   layerName: '图层二',
  //   props: {
  //     ...textDefaultProps,
  //     text: 'hello2',
  //     fontSize: '30px',
  //     top: '40px'
  //   }
  // },
  // {
  //   id: uuidV4(),
  //   name: markRaw(AcImage),
  //   layerName: '图层三',
  //   props: {
  //     ...imageDefaultProps,
  //     src: 'https://aic-lego.oss-cn-hangzhou.aliyuncs.com/editor-uploads/kj.jpeg',
  //     width: '300px'
  //   }
  // }
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
    },
    histories: [],
    historyIndex: -1
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find(
        (component) => component.id === state.currentElement
      )
    },
    getElement: (state) => (id: string) => {
      return state.components.find(
        (component) => component.id === id || state.currentElement
      )
    }
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      // 添加历史记录
      state.histories.push({
        id: uuidV4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component)
      })
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    undo(state) {
      if (state.historyIndex === -1) {
        state.historyIndex = state.histories.length - 1
      } else {
        state.historyIndex--
      }
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case 'add':
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          )
          break
        case 'delete':
          state.components = insertAt(
            state.components,
            history.index!,
            history.data
          )
          break
        case 'modify': {
          const { componentId, data } = history
          const { key, oldValue } = data
          const updatedComponent = state.components.find(
            (component) => component.id === componentId
          )
          if (updatedComponent) {
            updatedComponent.props[key as keyof AllComponentProps] = oldValue
          }
          break
        }
        default:
          break
      }
    },
    copyComponent(state, id) {
      const currentComponent = state.components.find(
        (component) => component.id === id
      )
      if (currentComponent) {
        state.copiedComponent = currentComponent
        message.success('已拷贝当前图层')
      }
    },
    pasteCopiedComponent(state) {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent)
        clone.id = uuidV4()
        clone.layerName = clone.layerName + '副本'
        clone.name = markRaw(clone.name)
        state.components.push(clone)
        message.success('已黏贴当前图层')
        // 添加历史记录
        state.histories.push({
          id: uuidV4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone)
        })
      }
    },
    deleteComponent(state, id) {
      const currentComponent = state.components.find(
        (component) => component.id === id
      )
      if (currentComponent) {
        const currentIndex = state.components.findIndex(
          (component) => component.id === id
        )
        state.components = state.components.filter(
          (component) => component.id !== id
        )
        message.success('删除当前图层成功')
        // 添加历史记录
        console.log('currentIndex >>> ', currentIndex)
        state.histories.push({
          id: uuidV4(),
          componentId: currentComponent.id,
          type: 'delete',
          data: currentComponent,
          index: currentIndex
        })
      }
    },
    moveComponent(
      state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const currentComponent = state.components.find(
        (component) => component.id === data.id
      )
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0')
        const oldLeft = parseInt(currentComponent.props.left || '0')
        const { direction, amount } = data
        switch (direction) {
          case 'Up': {
            const newValue = oldTop - amount + 'px'
            store.commit('updateComponent', {
              key: 'top',
              value: newValue,
              id: data.id
            })
            break
          }
          case 'Down': {
            const newValue = oldTop + amount + 'px'
            store.commit('updateComponent', {
              key: 'top',
              value: newValue,
              id: data.id
            })
            break
          }
          case 'Left': {
            const newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id: data.id
            })
            break
          }
          case 'Right': {
            const newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id: data.id
            })
            break
          }
          default:
            break
        }
      }
    },
    updateComponent(state, { id, key, value, isRoot }) {
      const updatedComponent = state.components.find(
        (component) => component.id === (id || state.currentElement)
      )
      if (updatedComponent) {
        if (isRoot) {
          updatedComponent[key as keyof ComponentData] = value
        } else {
          const oldValue =
            updatedComponent.props[key as keyof TextComponentProps]
          updatedComponent.props[key as keyof TextComponentProps] = value
          state.histories.push({
            id: uuidV4(),
            componentId: id || state.currentElement,
            type: 'modify',
            data: {
              oldValue,
              newValue: value,
              key
            }
          })
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
