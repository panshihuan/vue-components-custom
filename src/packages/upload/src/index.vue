<template>
  <div class="m-upload">
    <slot name="prefix"></slot>
    <label class="m-upload__label">
      <input
        :accept="accept"
        ref="upload"
        class="m-upload__input"
        type="file"
        @change="handleChange"
      />
      <slot>
        <i class="m-u-upload m-upload__icon"></i>
        <div class="m-upload__text">{{!fileList.length ? text : (!multiple ? '重新上传' : text)}}</div>
      </slot>
    </label>
    <div
      v-if="showTips"
      class="m-upload__tips"
    >
      <slot name="tips">
        <template v-if="fileTypes.length">支持文件格式：{{fileTypes.join(' ')}}</template>
      </slot>
    </div>
    <ul
      v-if="showFileList && fileList.length"
      class="m-upload__list"
    >
      <li
        v-for="(item, i) in fileList"
        :key="item.url"
        class="m-upload__item"
      >
        <i class="m-u-file m-upload__item__icon"></i>
        <span class="m-upload__item__name">{{item.fileName}}</span>
        <i
          class="m-u-close m-upload__item__close"
          @click="handleRemoveItem(item, i)"
        ></i>
      </li>
    </ul>
    <div
      class="m-upload__progress"
      :class="{
          'm-upload__progress--ing': loading,
          'm-upload__progress--success': isSuccess,
          'm-upload__progress--failed': isFailed,
        }"
    >
      <div class="m-upload__progress__track">
        <div
          class="m-upload__progress__bar"
          :style="{
          width: `${uploadBarWidth}%`
        }"
        ></div>
      </div>
      <span class="m-upload__progress__value">{{uploadBarWidth}}%</span>
      <i class="m-u-success m-upload__progress__icon"></i>
      <span class="m-upload__progress__text">上传失败</span>
    </div>
    <slot name="suffix"></slot>
  </div>
</template>
<script>
export default {
  name: 'm-upload',
  inject: {
    form: {
      default: undefined
    },
    formItem: {
      default: undefined
    }
  },
  props: {
    value: {},
    text: {
      type: String,
      default: '上传文件'
    },
    action: String,
    headers: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: 'file'
    },
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    fileTypes: {
      type: Array,
      default: () => []
    },
    fileList: {
      type: Array,
      default: () => []
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    showTips: {
      type: Boolean,
      default: true
    },
    beforeUpload: {
      type: Function,
      default: () => true
    },
    disabled: Boolean
  },
  data() {
    return {
      uploadBarWidth: 0,
      loading: false,
      isSuccess: false,
      isFailed: false,
      fileName: '',
    }
  },
  computed: {
    isDisabled() {
      return this.disabled || (this.form || {}).disabled || this.loading
    }
  },
  methods: {
    async handleChange() {
      const file = this.$refs.upload.files[0]
      // beforeupload中需返回file或base64位图
      const check = await this.beforeUpload(file)
      if (check === false) {
        this.clearInputValue()
        return false
      }
      this.fileName = file.name

      const form = new FormData()
      form.append(this.name, check)
      // 有附加数据
      if (this.data) {
        Object.keys(this.data).forEach(k => {
          form.append(k, this.data[k])
        })
      }
      const xhr = new XMLHttpRequest()
      xhr.open('post', this.action, true)
      // headers
      if (this.headers) {
        Object.keys(this.headers).forEach(k => {
          xhr.setRequestHeader(k, this.headers[k])
        })
      }
      xhr.onload = this.uploadComplete
      xhr.onerror = this.uploadFailed
      xhr.upload.onprogress = this.uploadProgress
      this.uploadStart()
      xhr.send(form)
    },
    uploadStart() {
      this.loading = true
      this.uploadBarWidth = 0
      this.$emit('start')
      // 单文件时清空列表
      if (!this.multiple) {
        this.fileList.splice(0, this.fileList.length)
      } else {
        this.fileList.pop()
      }
      this.updateValue()
    },
    uploadComplete(res) {
      this.isSuccess = true
      this.isFailed = false
      this.uploadBarWidth = 100
      const data = JSON.parse(res.target.responseText)
      this.fileList.push({
        fileName: data.fileName || this.fileName,
        url: data.url
      })
      this.updateValue()
      this.clearInputValue()
      this.$emit('success', data)
      setTimeout(() => {
        this.isSuccess = false
        this.loading = false
      }, 200)
    },
    uploadFailed(err) {
      this.loading = false
      this.isSuccess = false
      this.isFailed = true
      this.fileList.pop()
      this.updateValue()
      this.clearInputValue()
      this.$emit('error', err)
    },
    uploadProgress(res) {
      const v = parseInt((res.loaded / res.total) * 100, 10)
      this.uploadBarWidth = v > 99 ? 99 : v
    },
    handleRemoveItem(item, i) {
      this.fileList.splice(i, 1)
      this.updateValue()
    },
    updateValue() {
      let v = null
      if (this.multiple) {
        v = this.fileList.slice()
      } else {
        v = this.fileList.slice().pop()
      }
      this.formItem && this.formItem.$emit('change', v)
      this.$emit('change', v)
    },
    clearInputValue() {
      this.$refs.upload.value = ''
    }
  }
}
</script>

<style lang="scss">
@import './fonts/iconfont.css';
.m-u-upload,
.m-u-file,
.m-u-success,
.m-u-close {
  font-family: 'm-u-font' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.m-upload {
  &__label {
    width: auto;
    position: relative;
    padding: 0 16px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    border: 1px solid #e2e4e7;
    border-radius: 4px;
    cursor: pointer;
  }
  &__input {
    visibility: hidden;
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }
  &__text {
    font-size: 12px;
    line-height: 1;
    color: #515a6e;
  }
  &__icon {
    font-size: 16px;
    height: 16px;
    line-height: 1;
    margin-right: 6px;
  }
  &__tips {
    color: #808695;
    font-size: 12px;
    line-height: 20px;
    margin-top: 6px;
  }
  &__list {
    width: 100%;
    max-width: 500px;
    margin-top: 12px;
  }
  &__item {
    height: 20px;
    display: flex;
    align-items: center;
    &:hover {
      .m-upload__item__close {
        display: block;
      }
    }
    &__icon {
      font-size: 14px;
      line-height: 1;
      color: #515a6e;
      margin-right: 4px;
    }
    &__name {
      color: #515a6e;
      font-size: 12px;
      line-height: 1;
      margin-right: 16px;
    }
    &__close {
      font-size: 14px;
      line-height: 1;
      color: #515a6e;
      cursor: pointer;
    }
  }
  &__progress {
    align-items: center;
    max-width: 500px;
    margin-top: 10;
    display: none;
    &--ing {
      display: flex;
      .m-upload__progress {
        &__bar {
          background-color: #2a8af0;
        }
        &__value {
          display: block;
        }
        &__icon {
          display: none;
        }
      }
    }
    &--success {
      display: flex;
      .m-upload__progress {
        &__bar {
          background-color: #27c274;
        }
        &__value {
          display: none;
        }
        &__icon {
          color: #27c274;
          display: block;
        }
      }
    }
    &--failed {
      display: flex;
      .m-upload__progress {
        &__track {
          display: none;
        }
        &__icon {
          display: block;
          margin-left: 0;
          color: #ed4014;
        }
        &__text {
          display: block;
          color: #ed4014;
        }
      }
    }
    &__track {
      flex: 1;
      height: 2px;
      background-color: #e9eaec;
    }
    &__bar {
      height: 100%;
    }
    &__value {
      display: none;
      font-size: #808695;
      font-size: 12px;
      margin-left: 6px;
    }
    &__icon {
      display: none;
      width: 16px;
      height: 16px;
      font-size: 16px;
      margin-left: 8px;
    }
    &__text {
      display: none;
      font-size: 12px;
      margin-left: 8px;
    }
  }
}
</style>
