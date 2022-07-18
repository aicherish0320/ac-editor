<template>
  <div class="content-card">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in 5" :key="item" class="card-item">
        <a-card hoverable>
          <template #cover>
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          </template>
          <a-card-meta title="Europe Street beat">
            <template #description>www.instagram.com</template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.content-card {
  max-width: 1200px;
  margin: 0 auto;
  .card-item {
    margin-bottom: 16px;
  }
}
</style>
