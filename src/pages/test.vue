<script>
import { upload } from '@/api'

export default {
  methods: {
    test() {
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success: ({ tempFiles }) => {
          console.log(tempFiles)
          upload(tempFiles[0])
        },
      })
    },
  },
}
</script>

<template>
  <div @click="test()">
    1
  </div>
</template>
