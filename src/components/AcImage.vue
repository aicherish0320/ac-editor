<template>
  <img :style="style" :src="src" alt="img" @click.prevent="handleClick" />
</template>

<script setup lang="ts">
import useComponentCommon from '@/hooks/useComponentCommon'
import { CSSProperties } from 'vue'

defineOptions({
  name: 'l-image'
})

interface ImageComponentProps {
  // actions
  actionType?: string
  url?: string
  // size
  height?: string
  width?: string
  paddingLeft?: string
  paddingRight?: string
  paddingTop?: string
  paddingBottom?: string
  // border type
  borderStyle?: string
  borderColor?: string
  borderWidth?: string
  borderRadius?: string
  // shadow and opacity
  boxShadow?: string
  opacity?: string
  // position and x,y
  position?: string
  left?: string
  top?: string
  right?: string
  // 特有
  src: string
}

const props = withDefaults(defineProps<ImageComponentProps>(), {
  // actions
  actionType: '',
  url: '',
  // size
  height: '',
  width: '373px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxShadow: '0 0 0 #000000',
  opacity: '1',
  // position and x,y
  position: 'absolute',
  left: '0',
  top: '0',
  right: '0',
  // 特有的
  src: 'test.url'
})

const { styleProps, handleClick } = useComponentCommon(props)
// TODO
const style = styleProps as any as CSSProperties
</script>

<style scoped></style>
