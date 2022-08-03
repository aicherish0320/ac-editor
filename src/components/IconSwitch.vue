<template>
  <div class="icon-template" @click.prevent="handleClick">
    <a-tooltip>
      <template v-slot:title>
        {{ tip }}
      </template>
      <a-button :type="checked ? 'primary' : 'default'" shape="circle">
        <template v-slot:icon><component :is="iconName"></component></template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    iconName: string
    checked?: boolean
    tip: string
  }>(),
  {
    checked: false
  }
)
const emits = defineEmits(['change'])

const handleClick = () => {
  emits('change', !props.checked)
}
</script>

<style scoped></style>
