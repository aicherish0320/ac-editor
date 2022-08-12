import { createVNode, render } from 'vue'
import ContextMenu from './ContextMenu.vue'

export interface ActionItem {
  action: (cid?: string) => void
  text: string
  shortcut: string
}

const createContextMenu = (
  actions: ActionItem[],
  triggerClass = 'edit-wrapper'
) => {
  const container = document.createElement('div')
  const options = {
    actions,
    triggerClass
  }
  const vm = createVNode(ContextMenu, options)
  // 将虚拟节点渲染到真实节点上
  render(vm, container)
  document.body.appendChild(container)
  return () => {
    render(null, container)
    document.body.removeChild(container)
  }
}

export default createContextMenu
