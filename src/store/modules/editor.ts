import { Module } from 'vuex'
import { v4 as uuidV4 } from 'uuid'
import store, { GlobalDataProps } from '..'
import { AllComponentProps, textDefaultProps } from '@/common/defaultProps'
import { message } from 'ant-design-vue'
import { cloneDeep, debounce, update } from 'lodash-es'
import { insertAt } from '@/helpers'
import { getWorkById, publishWork, saveWork } from '@/apis/editor'

export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'

export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}

export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>
  value: string | string[]
  id: string
  isRoot?: boolean
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
  cachedOldValues: any
  maxHistoryNumber: number
}

export type AllFormProps = PageProps & AllComponentProps

export const testComponents: ComponentData[] = [
  {
    id: uuidV4(),
    name: 'l-text',
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
      backgroundColor: '#00ff00'
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

const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: 'undo' | 'redo'
) => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>
  const updatedComponent = state.components.find(
    (component) => component.id === componentId
  )
  if (updatedComponent) {
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] =
          type === 'undo' ? oldValue[index] : newValue[index]
      })
    } else {
      updatedComponent.props[newKey] = type === 'undo' ? oldValue : newValue
    }
  }
}

const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  if (state.historyIndex !== -1) {
    state.histories = state.histories.slice(0, state.historyIndex)
    state.historyIndex = -1
  }
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord)
  } else {
    state.histories.shift()
    state.histories.push(historyRecord)
  }
}

const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData
): any => {
  pushHistory(state, {
    id: uuidV4(),
    componentId: id || state.currentElement,
    type: 'modify',
    data: { oldValue: state.cachedOldValues, newValue: value, key }
  })
  state.cachedOldValues = null
}
const pushHistoryDebounce = debounce(pushModifyHistory, 100)

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    },
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 3
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
    },
    checkUndoDisable(state) {
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true
      }
      return false
    },
    checkRedoDisable(state) {
      if (
        state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1
      ) {
        return true
      }
      return false
    }
  },
  actions: {
    async fetchWork({ commit }, payload) {
      const ret = await getWorkById(payload)
      commit('fetchWork', ret)
    },
    async saveWork({ commit }, payload) {
      const ret = await saveWork(payload)
      commit('saveWork', ret)
    },
    async publishWork(_, payload) {
      const ret = await publishWork(payload)
      console.log('ret >>> ', ret)
    }
  },
  mutations: {
    fetchWork(state, data) {
      const { content, ...rest } = data
      state.page = { ...state.page, ...rest }
      if (content.props) {
        state.page.props = content.props
      }
      state.components = content.components
    },
    saveWork(state, data) {},
    addComponent(state, component: ComponentData) {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      // 添加历史记录
      pushHistory(state, {
        id: uuidV4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component)
      })
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    redo(state) {
      if (state.historyIndex === -1) {
        return
      }
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case 'add':
          state.components.push(history.data)
          break
        case 'delete':
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          )
          break
        case 'modify': {
          modifyHistory(state, history, 'redo')
          break
        }

        default:
          break
      }
      state.historyIndex++
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
          modifyHistory(state, history, 'undo')
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
        // clone.name = markRaw(clone.name)
        // clone.name = clone.name
        state.components.push(clone)
        message.success('已黏贴当前图层')
        // 添加历史记录
        pushHistory(state, {
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
        pushHistory(state, {
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
    updateComponent(state, { id, key, value, isRoot }: UpdateComponentData) {
      const updatedComponent = state.components.find(
        (component) => component.id === (id || state.currentElement)
      )
      if (updatedComponent) {
        if (isRoot) {
          updatedComponent[key as keyof ComponentData] = value
        } else {
          const oldValue = Array.isArray(key)
            ? key.map((k) => updatedComponent.props[k])
            : updatedComponent.props[key]

          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue
          }

          pushHistoryDebounce(state, { key, value, id })

          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updatedComponent.props[keyName] = value[index]
            })
          } else if (typeof key === 'string' && typeof value === 'string') {
            updatedComponent.props[key] = value
          }
        }
      }
    },
    updatePage(state, { key, value, isRoot }) {
      if (isRoot) {
        state.page[key as keyof PageData] = value
      } else if (state.page.props) {
        state.page.props[key as keyof PageProps] = value
      }
    }
  }
}

export default editor
