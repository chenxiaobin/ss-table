<template>
  <button
    class="le-button"
    @click="handleClick"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'le-button-' + type : '',
      size ? 'le-button-' + size : '',
      {
        'is-le-disabled': disabled,
        'is-le-loading': loading,
        'is-le-plain': plain,
        'is-le-round': round,
        'is-le-circle': circle
      }
    ]"
  >
    <i class="iconfont" :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
export default {
  name: 'ElButton',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },
  computed: {
  },
  methods: {
    handleClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>
<style>
.le-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.le-button:focus,
.le-button:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
.le-button:active {
  color: #3a8ee6;
  border-color: #3a8ee6;
  outline: none;
}
/* 圆角按钮 */
.le-button.is-le-round {
  border-radius: 20px;
  padding: 12px 23px;
}
/* 原形按钮 */
.le-button.is-le-circle {
  border-radius: 50%;
  padding: 12px;
}
/* 禁用按钮 */
.le-button.is-le-disabled,
.le-button.is-le-disabled:focus,
.le-button.is-le-disabled:hover{
  color: #c0c4cc;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
}
/* 文字按钮 */
.le-button-text {
  border-color: transparent;
  color: #409eff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}
/* 文字按钮-禁用 */
.le-button-text.is-le-disabled,
.le-button-text.is-le-disabled:focus,
.le-button-text.is-le-disabled:hover,
.le-button-text:active {
  border-color: transparent;
}

.le-button-text:active {
  color: #3a8ee6;
  background-color: transparent;
}
.le-button-text:focus, .le-button-text:hover {
  color: #66b1ff;
  border-color: transparent;
  background-color: transparent;
}
/* primary */
.le-button-primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.le-button-primary:focus,
.le-button-primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
/* success */
.le-button-success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}
.le-button-success:active {
  background: #5daf34;
  border-color: #5daf34;
  color: #fff;
}
.le-button-success:active {
  outline: none;
}
.le-button-success:focus,
.le-button-success:hover {
  background: #85ce61;
  border-color: #85ce61;
  color: #fff;
}
/* info */
.le-button-info {
  color: #fff;
  background-color: #909399;
  border-color: #909399;
}
.le-button-info:active {
  background: #82848a;
  border-color: #82848a;
  color: #fff;
}

.le-button-info:active {
  outline: none;
}
.le-button-info:focus,
.le-button-info:hover {
  background: #a6a9ad;
  border-color: #a6a9ad;
  color: #fff;
}
/* warning */
.le-button-warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
}
.le-button-warning.is-active,
.le-button-warning:active {
  background: #cf9236;
  border-color: #cf9236;
  color: #fff;
}
.le-button-warning:active {
  outline: none;
}
.le-button-warning:focus,
.le-button-warning:hover {
  background: #ebb563;
  border-color: #ebb563;
  color: #fff;
}
/* danger */
.le-button-danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
.le-button-danger.is-active,
.le-button-danger:active {
  background: #dd6161;
  border-color: #dd6161;
  color: #fff;
}
.le-button-danger:active {
  outline: none;
}
.le-button-danger:focus,
.le-button-danger:hover {
  background: #f78989;
  border-color: #f78989;
  color: #fff;
}
/* 朴素图标 */
.le-button.is-le-plain:active {
  background: #fff;
  outline: none;
}
.le-button.is-le-plain:focus,
.le-button.is-le-plain:hover {
  background: #fff;
  border-color: #409eff;
  color: #409eff;
}
/* 朴素图标-primary */
.le-button-primary.is-le-plain {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.le-button-primary.is-le-plain:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
  outline: none;
}
.le-button-primary.is-le-plain:focus,
.le-button-primary.is-le-plain:hover {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
/* 朴素图标-success */
.le-button-success.is-le-plain {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
}
.le-button-success.is-le-plain:active {
  background: #5daf34;
  border-color: #5daf34;
  color: #fff;
  outline: none;
}

.le-button-success.is-le-plain:focus,
.le-button-success.is-le-plain:hover {
  background: #67c23a;
  border-color: #67c23a;
  color: #fff;
}
/* 朴素图标-info */
.le-button-info.is-le-plain {
  color: #909399;
  background: #f4f4f5;
  border-color: #d3d4d6;
}
.le-button-info.is-le-plain:active {
  background: #82848a;
  border-color: #82848a;
  color: #fff;
  outline: none;
}
.le-button-info.is-le-plain:focus,
.le-button-info.is-le-plain:hover {
  background: #909399;
  border-color: #909399;
  color: #fff;
}
/* 朴素图标-warning */
.le-button-warning.is-le-plain {
  color: #e6a23c;
  background: #fdf6ec;
  border-color: #f5dab1;
}
.le-button-warning.is-le-plain:active {
  background: #cf9236;
  border-color: #cf9236;
  color: #fff;
  outline: none;
}
.le-button-warning.is-le-plain:focus,
.le-button-warning.is-le-plain:hover {
  background: #e6a23c;
  border-color: #e6a23c;
  color: #fff;
}
/* 朴素图标-danger */
.le-button-danger.is-le-plain {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}
.le-button-danger.is-le-plain:active {
  background: #dd6161;
  border-color: #dd6161;
  color: #fff;
  outline: none;
}
.le-button-danger.is-le-plain:focus,
.le-button-danger.is-le-plain:hover {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}

/* 普通-禁用-primary */
.le-button-primary.is-le-disabled,
.le-button-primary.is-le-disabled:active,
.le-button-primary.is-le-disabled:focus,
.le-button-primary.is-le-disabled:hover {
  color: #fff;
  background-color: #a0cfff;
  border-color: #a0cfff;
}
/* 普通-禁用-success */
.le-button-success.is-le-disabled,
.le-button-success.is-le-disabled:active,
.le-button-success.is-le-disabled:focus,
.le-button-success.is-le-disabled:hover {
  color: #fff;
  background-color: #b3e19d;
  border-color: #b3e19d;
}
/* 普通-禁用-info */
.le-button-info.is-le-disabled,
.le-button-info.is-le-disabled:active,
.le-button-info.is-le-disabled:focus,
.le-button-info.is-le-disabled:hover {
  color: #fff;
  background-color: #c8c9cc;
  border-color: #c8c9cc;
}
/* 普通-禁用-warning */
.le-button-warning.is-le-disabled,
.le-button-warning.is-le-disabled:active,
.le-button-warning.is-le-disabled:focus,
.le-button-warning.is-le-disabled:hover {
  color: #fff;
  background-color: #f3d19e;
  border-color: #f3d19e;
}
/* 普通-禁用-danger */
.le-button-danger.is-le-disabled,
.le-button-danger.is-le-disabled:active,
.le-button-danger.is-le-disabled:focus,
.le-button-danger.is-le-disabled:hover {
  color: #fff;
  background-color: #fab6b6;
  border-color: #fab6b6;
}
/* 朴素-禁用-primary */
.le-button-primary.is-le-plain.is-le-disabled,
.le-button-primary.is-le-plain.is-le-disabled:active,
.le-button-primary.is-le-plain.is-le-disabled:focus,
.le-button-primary.is-le-plain.is-le-disabled:hover {
  color: #8cc5ff;
  background-color: #ecf5ff;
  border-color: #d9ecff;
}
/* 朴素-禁用-success */
.le-button-success.is-le-plain.is-le-disabled,
.le-button-success.is-le-plain.is-le-disabled:active,
.le-button-success.is-le-plain.is-le-disabled:focus,
.le-button-success.is-le-plain.is-le-disabled:hover {
  color: #a4da89;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
}
/* 朴素-禁用-info */
.le-button-info.is-le-plain.is-le-disabled,
.le-button-info.is-le-plain.is-le-disabled:active,
.le-button-info.is-le-plain.is-le-disabled:focus,
.le-button-info.is-le-plain.is-le-disabled:hover {
  color: #bcbec2;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
}
/* 朴素-禁用-warning */
.le-button-warning.is-le-plain.is-le-disabled,
.le-button-warning.is-le-plain.is-le-disabled:active,
.le-button-warning.is-le-plain.is-le-disabled:focus,
.le-button-warning.is-le-plain.is-le-disabled:hover {
  color: #f0c78a;
  background-color: #fdf6ec;
  border-color: #faecd8;
}
/* 朴素-禁用-danger */
.le-button-danger.is-le-plain.is-le-disabled,
.le-button-danger.is-le-plain.is-le-disabled:active,
.le-button-danger.is-le-plain.is-le-disabled:focus,
.le-button-danger.is-le-plain.is-le-disabled:hover {
  color: #f9a7a7;
  background-color: #fef0f0;
  border-color: #fde2e2;
}
/* 不同尺寸 */
.le-button-medium {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.le-button-small {
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
}
.le-button-mini {
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
}
/* 圆角不同尺寸 */
.le-button-medium.is-le-round {
  padding: 10px 20px;
}
.le-button-small.is-le-round {
  padding: 9px 15px;
}
.le-button-mini.is-le-round {
  padding: 7px 15px;
}
</style>
