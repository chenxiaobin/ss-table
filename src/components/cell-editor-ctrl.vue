<template>
  <div v-if="editMode === 'celledit'">
    <text-editor
      v-if="cellEditShow"
      :data="rowItem"
      :rowindex="rowKey"
      :limit="cellItem.limit"
      :value="rowItem[cellItem.name]"
      @change="handleEditChange"
      @mouseup.stop
      @click.native.stop
    />
    <i v-if="isShowIcon" class="tb-cell-editicon el-icon-edit-outline" @click="handleCellEdit"></i>
  </div>
  <div v-else-if="editMode === 'rowedit'">
    <text-editor
      :data="rowItem"
      :rowindex="rowKey"
      :limit="cellItem.limit"
      :value="rowItem[cellItem.name]"
      @change="handleEditChange"
      @mouseup.stop
      @click.native.stop
    />
  </div>
</template>
<script>
import _ from 'lodash'
import TextEditor from './text-editor'
export default {
  name: 'cell-editor-ctrl',
  inject: ['self'],
  data () {
    return {
      cellEditShow: false,
      cellEditIconShow: this.cellEditIconShow
    }
  },
  props: {
    cellItem: Object,
    rowItem: Object,
    rowKey: Number,
    mouseOver: Boolean,
    editMode: String
  },
  components: {
    TextEditor
  },
  watch: {
    mouseOver () {
      if (!this.self.editable) {
        return
      }
      if (this.mouseOver) {
        this.cellEditIconShow = true
      } else {
        this.cellEditIconShow = false
        setTimeout(() => {
          this.cellEditShow = false
        }, 300)
      }
    },
    cellEditIconShow () {
      this.$emit('cell-hover-change', this.cellEditIconShow)
    }
  },
  computed: {
    isShowIcon () {
      // 每列自定义是否编辑
      let editable = _.isBoolean(this.cellItem.editable) ? this.cellItem.editable : true
      // 扩展列不提供编辑
      let isExtend = this.cellItem.extend
      return this.cellEditIconShow && !this.cellEditShow && editable && !isExtend
    }
  },
  methods: {
    handleCellEdit () {
      if (this.self.editable) {
        this.cellEditIconShow = false
        this.cellEditShow = true
      }
    },
    handleEditChange (value, oldValue) {
      if (value !== oldValue) {
        let data = {}
        data[this.cellItem.name] = value
        this.$emit('update-row', data)
      }
    }
  }
}
</script>
<style>
.tb-cell-editicon{
  font-size: 19px;
  position:absolute;
  right: 3px;
  top: 50%;
  cursor: pointer;
  transform: translate(0, -50%);
  -webkit-transform: translate(0, -50%);
  -moz-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  -o-transform: translate(0, -50%);
  color:rgb(127, 199, 235);
}
</style>
