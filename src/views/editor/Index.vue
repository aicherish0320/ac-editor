<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="page-title">
        <router-link to="/">
          <img alt="慕课乐高" src="@/assets/logo-simple.png" class="logo-img" />
        </router-link>
        <InlineEdit :value="page.title" @change="titleChange" />
      </div>
      <a-menu
        :selectable="false"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <a-button type="primary" @click="preview">预览和设置</a-button>
        </a-menu-item>
        <a-menu-item key="2">
          <a-button type="primary" @click="saveWork">保存</a-button>
        </a-menu-item>
        <a-menu-item key="3">
          <a-button type="primary" @click="publish">发布</a-button>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
  </a-layout>
  <!-- <a-layout>
    <a-layout-header class="header">
      <router-link to="/">
        <span class="title">作品名称</span>
      </router-link>
    </a-layout-header>
  </a-layout> -->
  <a-layout>
    <a-layout-sider width="300" class="sider sider-left">
      <section class="title">
        组件列表
        <ComponentsList
          :list="defaultTextTemplates"
          @onItemClick="addItem"
        ></ComponentsList>
        <img id="test-img" alt="img" height="300" />
      </section>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="preview-container">
        <section>画布区域</section>
        <HistoryArea></HistoryArea>
        <section
          class="preview-list"
          id="canvas-area"
          :class="{ 'canvas-fix': canvasFix }"
        >
          <div class="body-container" :style="page.props">
            <EditWrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              :active="component.id === (currentElement && currentElement.id)"
              :props="component.props"
              @set-active="setActive"
              @update-position="updatePosition"
            >
              <component
                :is="component.name"
                v-bind="component.props"
              ></component>
            </EditWrapper>
          </div>
        </section>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" class="sider sider-right">
      <a-tabs type="card" v-model:activeKey="activePanel">
        <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
          <template v-if="currentElement">
            <EditGroups
              v-if="!currentElement?.isLocked"
              :props="currentElement.props"
              @change="handleChange"
            ></EditGroups>
            <div v-else>
              <a-empty>
                <template #description>
                  <p>该元素被锁定，无法编辑</p>
                </template>
              </a-empty>
            </div>
          </template>
        </a-tab-pane>
        <a-tab-pane key="layer" tab="图层设置">
          <LayerList
            :list="components"
            :selected-id="currentElement?.id"
            @change="handleChange"
            @select="setActive"
          ></LayerList>
        </a-tab-pane>
        <a-tab-pane key="page" tab="页面设置">
          <PropsTable :props="page.props" @change="pageChange"></PropsTable>
        </a-tab-pane>
      </a-tabs>
    </a-layout-sider>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import ComponentsList from './ComponentsList.vue'
import defaultTextTemplates from '@/common/defaultTemplates'
import { ComponentData } from '@/store/modules/editor'
import EditWrapper from './EditWrapper.vue'
import EditGroups from './EditGroups.vue'
import LayerList from './LayerList.vue'
import PropsTable from './PropsTable.vue'
import { forEach, pickBy } from 'lodash-es'
import initHotKeys from '@/plugins/hotKeys'
import HistoryArea from './HistoryArea.vue'
import initContextMenu from '@/plugins/contextMenu'
import html2canvas from 'html2canvas'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import InlineEdit from './InlineEdit.vue'
export type TabType = 'component' | 'layer' | 'page'

initHotKeys()
initContextMenu()

const route = useRoute()
const store = useStore<GlobalDataProps>()
const components = computed(() => store.state.editor.components)
const page = computed(() => store.state.editor.page)
const activePanel = ref<TabType>('component')
const currentElement = computed<ComponentData | null>(
  () => store.getters.getCurrentElement
)

const canvasFix = ref(false)

const currentWorkId = route.params.id
onMounted(() => {
  if (currentWorkId) {
    store.dispatch('fetchWork', currentWorkId)
  }
})
// 获取作品

const pageChange = (e) => {
  store.commit('updatePage', e)
}

const titleChange = (newTitle: string) => {
  store.commit('updatePage', { key: 'title', value: newTitle, isRoot: true })
}
const preview = () => {}
const saveWork = () => {
  const { title, props } = page.value
  const payload = {
    title,
    content: {
      components: components.value,
      props
    }
  }
  store.dispatch('saveWork', { data: payload, id: currentWorkId })
}

onBeforeRouteLeave((to, from, next) => {
  // 如果有改动，则在跳转之前，自动保存
})

const publish = async () => {
  store.commit('setActive', '')
  const el = document.getElementById('canvas-area') as HTMLElement
  canvasFix.value = true
  await nextTick()
  html2canvas(el, { width: 375, useCORS: true, scale: 1 }).then((canvas) => {
    const img = document.getElementById('test-img') as HTMLImageElement
    img.src = canvas.toDataURL()
  })
}

const addItem = (component: any) => {
  store.commit('addComponent', component)
}
const setActive = (id: string) => {
  store.commit('setActive', id)
}

const updatePosition = (data: { left: number; top: number; id: string }) => {
  const { id } = data
  const updatedData = pickBy(data, (v, k) => k !== 'id')
  const keysArr = Object.keys(updatedData)
  const valuesArr = Object.values(updatedData).map((v) => v + 'px')
  store.commit('updateComponent', { key: keysArr, value: valuesArr, id })
  // forEach(updatedData, (v, k) => {
  //   store.commit('updateComponent', { key: k, value: v + 'px', id })
  // })
}

const handleChange = (e: any) => {
  store.commit('updateComponent', e)
}
</script>

<style scoped lang="scss">
.header {
  color: #fff;
  display: flex;
  justify-content: space-between;
  .logo-img {
    margin-right: 10px;
  }
  .page-title {
    display: flex;
  }
  .title {
    cursor: pointer;
  }
}
.sider {
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 64px);
}
.preview-container {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .preview-list {
    min-width: 375px;
    min-height: 600px;
    border: 1px solid #efefef;
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    margin-top: 50px;
    max-height: 80vh;
  }
}
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>
