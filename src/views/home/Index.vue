<template>
  <a-layout>
    <a-layout-header class="header">
      <b class="logo" @click="goHome">爱鹊絮</b>
      <section class="btn">
        <a-button type="link" @click="goLogin">登陆</a-button>
      </section>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer>footer</a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goLogin = () => {
  router.push('/login')
}
const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.header {
  color: #fff;
  display: flex;
  justify-content: space-between;
  .logo {
    font-size: 20px;
    cursor: pointer;
  }
}
.content {
  background: #fff;
}
</style>
