<template>
  <a-layout>
    <a-layout-header class="header">
      <b class="logo">爱鹊絮</b>
      <section class="btn">
        <a-button @click="createDesign">创建作品</a-button>
        <router-link to="/login">登陆</router-link>
      </section>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer>footer</a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import * as editorApi from '@/apis/editor'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const createDesign = async () => {
  const payload = {
    title: '未命名作品',
    desc: '未命名作品',
    coverImg:
      'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png'
  }
  try {
    const ret = await editorApi.works(payload)
    console.log('ret >>> ', ret)
    // 833
    message.success('创建作品成功')
    router.push(`/editor/${ret.id}`)
  } catch (error: any) {
    message.error(error)
  }
}
</script>

<style scoped lang="scss">
.header {
  color: #fff;
  display: flex;
  justify-content: space-between;
  .logo {
    font-size: 20px;
  }
}
.content {
  background: #fff;
}
</style>
