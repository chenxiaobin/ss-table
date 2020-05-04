<template>
  <div class="row-editor-ctrl" v-if="permission">
    <template v-if="!rowEditing">
      <span class="iconfont ss-icon-bianji2" @click="handleEditing">编辑</span>
    </template>
    <template v-else>
      <span class="iconfont ss-icon-wancheng11" @click="handleComplete">完成</span>
      <span class="row-editor-space"></span>
      <span class="iconfont ss-icon-cancel" @click="handleCancel">取消</span>
    </template>
  </div>
</template>
<script>
export default {
  name: 'row-editor-ctrl',
  data () {
    return {
      rowEditing: false
    }
  },
  props: {
    permission: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleEditing () {
      this.rowEditing = !this.rowEditing
      this.$emit('edit-row-editing')
    },
    handleComplete () {
      this.rowEditing = false
      this.$emit('edit-row-complete')
    },
    handleCancel () {
      this.rowEditing = false
      this.$emit('edit-row-cancel')
    }
  }
}
</script>
<style>
.ss-custom table td .row-editor-ctrl span{
  display: inline-block;
  color: green;
}
.ss-custom table td .row-editor-ctrl span + span{
  color: red;
  margin-top: 0;
}
.row-editor-space{
  width: 10px;
}
.row-editor-ctrl .iconfont{
  font-size: 13px;
}
.row-editor-ctrl .iconfont:hover{
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
