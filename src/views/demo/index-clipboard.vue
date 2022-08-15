<template>
  <div class="demo">
    <!-- <a-input v-model:value="msg"></a-input>
    <a-button @click="handleClick">Copy</a-button> -->
  </div>
</template>

<script setup lang="ts">
// navigator.clipboard.writeText('Hello').then(
//   () => {
//     alert('nice')
//   },
//   (e) => {
//     console.log('e >>> ', e)
//   }
// )

// import { ref } from 'vue'

// const msg = ref('Hello')

// const handleClick = () => {
//   const ret = document.execCommand('copy')
//   console.log('ret >>> ', ret)
// }

const area = document.createElement('textarea')
area.value = '累好啊'
document.body.append(area)
area.select()
const ret = document.execCommand('copy')
console.log('ret >>> ', ret)
</script>

<style scoped lang="scss"></style>
