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
defineOptions({
  name: 'IconSwitch'
})

const props = withDefaults(
  defineProps<{
    iconName: any
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
