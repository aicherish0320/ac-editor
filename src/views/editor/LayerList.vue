<template>
  <Draggable
    :list="list"
    item-key="id"
    handle=".handle"
    class="ant-list-items ant-list-bordered"
  >
    <template #item="{ element }">
      <div
        class="ant-list-item"
        :class="{ active: element.id === selectedId }"
        @click="handleClick(element.id)"
      >
        <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
          <a-button
            shape="circle"
            @click.stop="
              handleChange(element.id, 'isHidden', !element.isHidden)
            "
          >
            <template v-slot:icon v-if="element.isHidden">
              <EyeOutlined />
            </template>
            <template v-slot:icon v-else>
              <EyeInvisibleOutlined />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
          <a-button
            shape="circle"
            @click.stop="
              handleChange(element.id, 'isLocked', !element.isLocked)
            "
          >
            <template v-slot:icon v-if="element.isLocked">
              <UnlockOutlined />
            </template>
            <template v-slot:icon v-else>
              <LockOutlined />
            </template>
          </a-button>
        </a-tooltip>
        <InlineEdit
          :value="element.layerName"
          @change="
            (value) => {
              handleChange(element.id, 'layerName', value)
            }
          "
        ></InlineEdit>
        <a-tooltip title="拖动排序">
          <a-button shape="circle" class="handle">
            <template v-slot:icon><DragOutlined /> </template
          ></a-button>
        </a-tooltip>
      </div>
    </template>
  </Draggable>
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
import Draggable from 'vuedraggable'

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
