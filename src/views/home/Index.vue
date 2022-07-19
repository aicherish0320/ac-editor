<template>
  <a-layout>
    <a-layout-header class="header">
      <b class="logo">爱鹊絮</b>
      <section class="btn">
        <router-link to="/login">登陆</router-link>
      </section>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer>footer</a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts"></script>

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
