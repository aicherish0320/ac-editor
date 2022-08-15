<template>
  <div>
    <img id="img1" src="@/assets/login.png" width="300" alt="" />
    <img
      id="img2"
      src="http://static-dev.imooc-lego.com/upload-files/screenshot-698958.png"
      width="200"
      alt=""
    />
    <a-button @click="imgDownload">下载海报</a-button>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'

const imgDownload = () => {
  const img = document.getElementById('img2') as HTMLImageElement
  download(img.src)
}

const download = (src: string, fileName = 'default.png') => {
  const link = document.createElement('a')
  link.download = fileName
  link.rel = 'noopener'
  if (link.origin !== location.origin) {
    axios.get(src, { responseType: 'blob' }).then((data) => {
      link.href = URL.createObjectURL(data.data)
      setTimeout(() => {
        link.dispatchEvent(new MouseEvent('click'))
      })
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
      }, 10000)
    })
  } else {
    link.href = src
    link.dispatchEvent(new MouseEvent('click'))
  }
}
</script>

<style scoped></style>
