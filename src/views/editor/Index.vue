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
        <Uploader action="http://localhost:3300/upload" :drag="true" />
      </section>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="preview-container">
        <section>画布区域</section>
        <section class="preview-list">
          <EditWrapper
            v-for="component in components"
            :key="component.id"
            :id="component.id"
            :active="component.id === (currentElement && currentElement.id)"
            @set-active="setActive"
          >
            <component
              :is="component.name"
              v-bind="component.props"
            ></component>
          </EditWrapper>
        </section>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" class="sider sider-right">
      组件属性
      <template v-if="currentElement">
        <PropsTable
          :props="currentElement.props"
          @change="handleChange"
        ></PropsTable>
      </template>
    </a-layout-sider>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import ComponentsList from './ComponentsList.vue'
import { defaultTextTemplates } from '@/common/defaultTemplates'
import { ComponentData } from '@/store/modules/editor'
import EditWrapper from './EditWrapper.vue'
import PropsTable from './PropsTable.vue'
import Uploader from '@/components/Uploader.vue'

const store = useStore<GlobalDataProps>()
const components = computed(() => store.state.editor.components)
const currentElement = computed<ComponentData | null>(
  () => store.getters.getCurrentElement
)

const addItem = (props: any) => {
  store.commit('addComponent', props)
}
const setActive = (id: string) => {
  store.commit('setActive', id)
}

const handleChange = (e: any) => {
  console.log('e >>> ', e)
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
