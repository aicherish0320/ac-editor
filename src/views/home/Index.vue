<template>
  <a-layout>
    <a-layout-header class="header"> 爱鹊絮 </a-layout-header>
    <a-layout-content class="content">
      <ContentCard></ContentCard>
    </a-layout-content>
    <a-layout-footer>footer</a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import ContentCard from './ContentCard.vue'
</script>

<style scoped>
.header {
  color: #fff;
  font-size: 20px;
}
.content {
  background: #fff;
}
</style>
