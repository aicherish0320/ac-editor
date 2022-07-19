<template>
  <div class="content-card">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item.id" class="card-item">
        <a-card hoverable @click="onCardClick">
          <template #cover>
            <img alt="example" :src="item.coverImg" />
          </template>
          <a-card-meta :title="item.title">
            <template #description>{{ item.author }}</template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { TemplateProps } from '../../store/modules/templates'

defineProps<{ list: { type: TemplateProps[]; required: true } }>()

const router = useRouter()
const onCardClick = () => {
  router.push('/editor')
}
</script>

<style scoped lang="scss">
.content-card {
  max-width: 1200px;
  margin: 0 auto;
  .card-item {
    margin-bottom: 16px;
  }
}
</style>
