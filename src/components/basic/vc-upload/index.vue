<script>
import { upload } from '@/api'

const Status = {
  Uploading: 'uploading',
  Done: 'done',
  Failed: 'failed',
}

export default {
  props: {
    fileList: Array,
    accept: {
      type: String,
      default: 'image',
    },
    previewImage: {
      type: Boolean,
      default: true,
    },
    onChange: Function,
    onSuccess: Function,
    onError: Function,
    onRemove: Function,
    limit: {
      type: Number,
      default: 9,
    },
  },
  data: () => ({
    innerFileList: [],
  }),
  created() {
    this.innerFileList = this.fileList ?? []
  },
  methods: {
    afterRead({ detail }) {
      const files = Array.isArray(detail.file) ? detail.file : [detail.file]
      files.forEach(async (file, index) => {
        const targetIndex = detail.index + index
        this.$set(this.innerFileList, targetIndex, {
          ...file,
          status: Status.Uploading,
          message: '上传中',
        })
        const targetFile = this.innerFileList[targetIndex]
        this.$emit('change', {
          file: targetFile,
          fileList: this.innerFileList,
        })
        try {
          const res = await upload(file)
          if (!this.innerFileList.includes(targetFile))
            return
          if (res.status !== 0)
            throw res

          targetFile.status = Status.Done
          this.$set(targetFile, 'response', res)
          this.$emit('success', {
            response: res,
            file: targetFile,
            fileList: this.innerFileList,
            fileUrls: this.convertToUrls(this.innerFileList),
          })
        }
        catch (error) {
          console.error(error)
          if (!this.innerFileList.includes(targetFile))
            return
          targetFile.message = '上传失败'
          targetFile.status = Status.Failed
          this.$emit('error', {
            error,
            file: targetFile,
            fileList: this.innerFileList,
          })
        }
      })
    },
    /**
     * 删除文件
     * @public
     */
    deleteFile(index) {
      const [targetFile] = this.innerFileList.splice(index, 1)
      this.$emit('remove', {
        file: targetFile,
        fileList: this.innerFileList,
      })
      this.$emit('change', {
        file: targetFile,
        fileList: this.innerFileList,
      })
    },
    convertToUrls(files) {
      return files.filter(file => file.status === 'done').map(file => file.response.fileUrl).join(',')
    },
    checkStatus() {
      return this.innerFileList.every(file => file.status === Status.Done)
    },
  },
}
</script>

<template>
  <van-uploader
    :file-list="innerFileList"
    :max-count="limit"
    multiple
    :accept="accept"
    :preview-image="previewImage"
    :size-type="['compressed']"
    @after-read="afterRead"
    @delete="deleteFile($event.detail.index)"
  >
    <slot />
  </van-uploader>
</template>
