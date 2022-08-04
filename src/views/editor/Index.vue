<template>
  <a-layout>
    <a-layout-header class="header">
      <router-link to="/">
        <span class="title">作品名称</span>
      </router-link>
    </a-layout-header>
  </a-layout>
  <a-layout>
    <a-layout-sider width="300" class="sider sider-left">
      <section class="title">
        组件列表
        <ComponentsList
          :list="defaultTextTemplates"
          @onItemClick="addItem"
        ></ComponentsList>
      </section>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="preview-container">
        <section>画布区域</section>
        <section class="preview-list" id="canvas-area">
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
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import ComponentsList from './ComponentsList.vue'
import { defaultTextTemplates } from '@/common/defaultTemplates'
import { ComponentData } from '@/store/modules/editor'
import EditWrapper from './EditWrapper.vue'
import EditGroups from './EditGroups.vue'
import LayerList from './LayerList.vue'
import PropsTable from './PropsTable.vue'
export type TabType = 'component' | 'layer' | 'page'

const store = useStore<GlobalDataProps>()
const components = computed(() => store.state.editor.components)
const page = computed(() => store.state.editor.page)
const activePanel = ref<TabType>('component')
const currentElement = computed<ComponentData | null>(
  () => store.getters.getCurrentElement
)

const pageChange = (e) => {
  console.log('pageChange >>> ', e)
  store.commit('updatePage', e)
}

const addItem = (component: any) => {
  store.commit('addComponent', component)
}
const setActive = (id: string) => {
  store.commit('setActive', id)
}

const updatePosition = (data: { left: number; top: number; id: string }) => {
  const { left, top, id } = data
  store.commit('updateComponent', { key: 'left', value: left + 'px', id })
  store.commit('updateComponent', { key: 'top', value: top + 'px', id })
}

const handleChange = (e: any) => {
  console.log('e >>> ', e)
  store.commit('updateComponent', e)
}
</script>

<style scoped lang="scss">
.header {
  color: #fff;
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
</style>
