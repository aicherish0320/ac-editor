<template>
  <div class="history-area">
    <div class="operation-list">
      {{ undoIsDisabled }}-{{ redoIsDisabled }}
      <a-tooltip>
        <template #title> 撤销 </template>
        <a-button
          shape="circle"
          :disabled="undoIsDisabled"
          @click="undoHistory"
        >
          <template #icon><UndoOutlined /> </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title> 重做 </template>
        <a-button
          shape="circle"
          @click="redoHistory"
          :disabled="redoIsDisabled"
        >
          <template #icon><RedoOutlined /> </template>
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GlobalDataProps } from '@/store/index.js'
import { RedoOutlined, UndoOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore<GlobalDataProps>()

const undoIsDisabled = computed<boolean>(() => store.getters.checkUndoDisable)
const redoIsDisabled = computed<boolean>(() => store.getters.checkRedoDisable)

const undoHistory = () => {
  store.commit('undo')
}
const redoHistory = () => {
  store.commit('redo')
}
</script>

<style>
.history-area {
  position: absolute;
  right: 0;
  z-index: 500;
}
.operation-list {
  display: flex;
}
.history-area .bold {
  font-weight: bold;
}
</style>
