<template>
  <div class="image-input">
    <div @click="launchFilePicker()">
      <slot name="activator" />
    </div>

    <input
      ref="file"
      type="file"
      :accept="supportedFileTypes.join(',')"
      :name="uploadFieldName"
      style="display:none"
      @change="onFileChange($event.target.name, $event.target.files)"
    >

    <b-alert :show="error" dismissible class="mt-2">
      {{ errorText }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'ImageInput',
  props: {
    maxSize: { type: Number, default: 1024 },
    disabled: { type: Boolean }
  },
  data () {
    return {
      error: null,
      errorText: '',
      uploadFieldName: 'file',
      supportedFileTypes: ['image/gif', 'image/png', 'image/jpeg', 'image/svg', 'image/svg+xml', 'image/webp']
    }
  },
  methods: {
    launchFilePicker () {
      this.error = false
      if (!this.disabled) { this.$refs.file.click() }
    },

    onFileChange (fieldName, file) {
      const { maxSize } = this
      const imageFile = file[0]

      if (file.length > 0) {
        const size = imageFile.size / (1024 * 1024)

        if (!this.supportedFileTypes.includes(imageFile.type)) {
          // check whether the upload is an image
          this.error = true
          this.errorText = 'Please choose an image file'
        } else if (size > maxSize) {
          // check whether the size is greater than the size limit
          this.error = true
          this.errorText = `Your file is too big! Please select an image under ${maxSize} MB`
        } else {
          // Append file into FormData and turn file into image URL
          const formData = new FormData()
          const url = URL.createObjectURL(imageFile)
          formData.append(fieldName, imageFile)
          // Emit the FormData and image URL to the parent component
          this.$emit('input', { url, imageFile })
        }
      }
    }
  }

}
</script>

<style scoped lang="scss">
</style>
