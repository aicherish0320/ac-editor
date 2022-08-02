<template>
  <ul>
    <li
      class="ant-list-item"
      v-for="item in list"
      :key="item.id"
      :class="{ active: item.id === selectedId }"
      @click="handleClick(item.id)"
    >
      <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
        <a-button
          shape="circle"
          @click.stop="handleChange(item.id, 'isHidden', !item.isHidden)"
        >
          <template v-slot:icon v-if="item.isHidden">
            <EyeOutlined />
          </template>
          <template v-slot:icon v-else>
            <EyeInvisibleOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
        <a-button
          shape="circle"
          @click.stop="handleChange(item.id, 'isLocked', !item.isLocked)"
        >
          <template v-slot:icon v-if="item.isLocked">
            <UnlockOutlined />
          </template>
          <template v-slot:icon v-else>
            <LockOutlined />
          </template>
        </a-button>
      </a-tooltip>
      <InlineEdit
        :value="item.layerName"
        @change="
          (value) => {
            handleChange(item.id, 'layerName', value)
          }
        "
      ></InlineEdit>
      <a-tooltip title="拖动排序">
        <a-button shape="circle" class="handle">
          <template v-slot:icon><DragOutlined /> </template
        ></a-button>
      </a-tooltip>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ComponentData } from '@/store/modules/editor'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
  DragOutlined
} from '@ant-design/icons-vue'
import InlineEdit from './InlineEdit.vue'
const props = withDefaults(
  defineProps<{
    list: ComponentData[]
    selectedId?: string
  }>(),
  {}
)

const emits = defineEmits(['change', 'select'])

const handleClick = (id: string) => {
  emits('select', id)
}

const handleChange = (id: string, key: string, value: boolean) => {
  const data = {
    id,
    key,
    value,
    isRoot: true
  }
  emits('change', data)
}
</script>

<style scoped>
.ant-list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: normal;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item.ghost {
  opacity: 0.5;
}

.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}

.ant-list-item .handle {
  cursor: move;
  margin-left: auto;
}
.ant-list-item .edit-area {
  width: 100%;
}
</style>
