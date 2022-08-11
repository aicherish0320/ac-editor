import createContextMenu, { ActionItem } from '@/components/createContextMenu'
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

const initContextMenu = () => {
  const store = useStore()

  const testActions: ActionItem[] = [
    {
      shortcut: 'Backspace / Delete',
      text: '删除图层',
      action: (cid) => {
        store.commit('deleteComponent', cid)
      }
    }
  ]

  const testActions2: ActionItem[] = [
    {
      shortcut: 'Ctrl+C',
      text: '复制配置',
      action: () => {
        console.log(2)
      }
    }
  ]

  let destroy1: any, destroy2: any
  onMounted(() => {
    destroy1 = createContextMenu([...testActions, ...testActions2])
    // destroy2 = createContextMenu(testActions2, 'settings-panel')
  })
  onUnmounted(() => {
    destroy1()
    // destroy2()
  })
}
export default initContextMenu
