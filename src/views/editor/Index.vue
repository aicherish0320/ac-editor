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
      <section class="title">组件列表</section>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="preview-container">
        <section>画布区域</section>
        <section class="preview-list">
          <component
            v-for="component in components"
            :key="component.id"
            :is="component.name"
            v-bind="component.props"
          ></component>
        </section>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" class="sider sider-right">
      sider right
    </a-layout-sider>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../../store'

const store = useStore<GlobalDataProps>()
const components = computed(() => store.state.editor.components)
console.log('components >>> ', components.value)
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
  &-left {
    // background: #f0f;
  }
  &-right {
    // background: #00f;
  }
}
.preview-container {
  // background: #0f0;
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
