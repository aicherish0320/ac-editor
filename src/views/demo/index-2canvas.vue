<template>
  <div class="demo">
    <canvas id="canvas"></canvas>
    <div id="elm">
      <h3>Hello</h3>
      <p>累好啊</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const dragCanvas = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  canvas.width = 200
  canvas.height = 200
  const elm = document.getElementById('elm') as HTMLElement

  const svgData = `
    <svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="20" y="20" width="160" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml">${elm.innerHTML}</div>
        </foreignObject>
    </svg>`

  const svg = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })

  const url = URL.createObjectURL(svg)
  const image = new Image()
  image.src = url
  image.addEventListener('load', () => {
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(image, 0, 0)
  })
}

onMounted(() => {
  dragCanvas()
})
</script>

<style scoped lang="scss">
.demo {
  display: flex;
}
</style>
