<template>
  <td :class="cellItem.rowspan ? 'special-cell-rowspan' : ''"
      :style="cellItem.styles"
      :rowspan="rowspan"
      v-if="cellType === 'default' && visible"
      v-tooltip="cellItem.tooltip ? {
        content: colValueFormat(rowItem, cellItem, rowKey, true)
      } : ''"
      @click="handleTdClick($event, rowItem, cellItem, rowKey, cellKey)"
      @mouseover="handleTdMouseover"
      @mouseout="handleTdMouseout">
      <div class="tb-cell-div">
        <!-- 正常单元格渲染 -->
        <template v-if="cellItem.name !== 'ex_operate'">
          <span :class="getTableCellClass(rowItem, cellItem)" v-html="colValueFormat(rowItem, cellItem, rowKey)"></span>
          <span :class="getTableCellClass(rowItem, appenditem)" v-for="(appenditem, akey) in cellItem.append" :key="`append-${akey}`" v-html="colValueFormat(rowItem, appenditem, akey)"></span>
        </template>
        <!-- 操作单元格渲染-输出编辑功能 -->
        <template v-else-if="cellItem.name === 'ex_operate'">
          <row-editor-ctrl :permission="getRowPermission()"
                            v-on="$listeners"/>
        </template>

        <!-- 单元格编辑模式 -->
        <template v-if="editMode === 'celledit'">
          <cell-editor-ctrl edit-mode="celledit"
                            :row-item="rowItem"
                            :row-key="rowKey"
                            :cell-item="cellItem"
                            :mouse-over="isMouseOver"
                            @update-row="handleUpdateRow"></cell-editor-ctrl>
        </template>

        <!-- 整行编辑模式 -->
        <template v-if="isRowEditEnabled">
          <cell-editor-ctrl edit-mode="rowedit"
                            :row-item="rowItem"
                            :row-key="rowKey"
                            :cell-item="cellItem"
                            :mouse-over="isMouseOver"
                            @update-row="handleUpdateRow"></cell-editor-ctrl>
        </template>
      </div>
  </td>
  <!-- 输出合计行 -->
  <td v-else-if="cellType === 'summary'">
    <template v-if="cellKey==0 || summaryCols.indexOf(cellItem.name) > -1"><span v-html="colValueFormat(cellItem, cellItem, cellKey, null, 'sum_value')"></span></template>
  </td>
</template>
<script>
import _ from 'lodash'
import dayjs from 'dayjs'
import Pinyin from '../utils/pinyin'
import Vue from 'vue'
import VTooltip from 'v-tooltip'
import RowEditorCtrl from './row-editor-ctrl'
import CellEditorCtrl from './cell-editor-ctrl'

Vue.use(VTooltip)

export default {
  inject: ['self'],
  name: 'table-cell',
  props: {
    cellType: {
      type: String,
      default: 'default'
    },
    cellItem: Object,
    cellKey: Number,
    rowItem: Object,
    rowKey: Number,
    isRowEdit: Boolean
  },
  data () {
    return {
      /** 自定义表格self对象 */
      editMode: this.self.editMode,
      handleTableIndex: this.self.handleTableIndex,
      summaryCols: this.self.summaryCols,
      /** 自定义表格self对象 */
      isMouseOver: false
    }
  },
  computed: {
    isRowEditEnabled () {
      // 整行编辑模式：1、开启了行编辑  2、不属于扩展列  3、列配置是否有关闭编辑
      let colEdit = _.isBoolean(this.cellItem.editable) ? this.cellItem.editable : true
      return this.editMode === 'rowedit' && this.isRowEdit && !this.cellItem.extend && colEdit
    },
    visible () {
      let { cellItem, rowKey: row, rowItem: data } = this
      let { name } = cellItem
      // let val = this.getDataCell()
      let visible = true//! !val || val === void 0

      if (cellItem.rowspan) {
        let source = this.self.sourceData
        let label = String(data[name])
        let lastData = source[row - 1]

        if (
          row > 0 &&
          source.length &&
          label === String(lastData[name]) &&
          label &&
          lastData._group === data._group
        ) {
          visible = false
        }
      }
      return visible
    },
    rowspan () {
      let { cellItem, rowKey: row, rowItem: data } = this
      let { name } = cellItem
      let value = 1

      if (cellItem.rowspan) {
        let source = this.self.sourceData
        let lastData = source[row - 1]
        let label = String(data[name])
        // 和上一行进行对比
        if (
          !lastData ||
          (label !== String(lastData[name]) && label) ||
          (lastData._group !== data._group && data._group)
        ) {
          while (
            source[row + 1] &&
            String(source[row + 1][name]) === label &&
            source[row + 1]._group === data._group
          ) {
            value++
            row++
          }
        }
      }
      return value
    }
  },
  components: {
    RowEditorCtrl, CellEditorCtrl
  },
  methods: {
    /**
     * 单元格点击事件
     */
    handleTdClick (event, data, column, rowindex, colindex) {
      this.$emit('cell-click', data, rowindex + 1, colindex + 1)
    },
    /**
     * 数据格式化，后续改造，走数据处理函数
     */
    colValueFormat (data, column, rowindex, istooltip, aliasname) {
      let { format, name, extend, text, append, display } = column
      name = aliasname || name
      if (extend && name !== 'sum_value') {
        // 扩展序号列
        if (name === 'ex_rowid') {
          return this.handleTableIndex(rowindex, data)
        }
      }

      let value = data[name]

      let newValue = value
      if (format) {
        let { type, value: formatValue } = format
        switch (type) {
          case 'fixed':
            newValue = value && value.toFixed(formatValue)
            break
          case 'precision':
            newValue = value && value.toPrecision(formatValue)
            break
          case 'date':
            newValue = value && dayjs(value).format(formatValue)
            break
        }
      }

      if (display && name !== 'sum_value') {
        switch (typeof display) {
          case 'function':
            newValue = display(data, column, newValue, rowindex)
            break
        }
      }

      if (istooltip) {
        let str = ''
        if (append) {
          _.each(append, (v) => {
            str += `<br/>${v.text}: ${data[v.name]}`
          })
        }
        if (newValue || newValue === 0) {
          return `${text}: ${newValue} ${str}`
        }
      }

      return newValue
    },
    /**
     * 单元格class获取
     */
    getTableCellClass (data, column) {
      let { name } = column
      let str = `special-cell-${name} `
      let value = data[name]
      value = _.isString(value) ? Pinyin(value)[0] : value
      if ((value || value === 0) && _.indexOf(['string', 'number', 'boolean'], typeof value) > -1 && value.toString().length < 10) {
        str = str + `special-cell-${value}`
      }
      return str
    },
    handleTdMouseover () {
      this.isMouseOver = true
    },
    handleTdMouseout () {
      this.isMouseOver = false
    },
    handleUpdateRow (data) {
      // 编辑状态
      // 单元格编辑模式可以直接提交update-row事件
      // 行编辑模式不能直接提交，有取消还原的过程，具体提交业务在row.vue中进行提交update-row事件
      if (this.editMode === 'celledit') {
        let result = Object.assign({}, this.rowItem)
        this.$emit('update-row', this.rowKey, Object.assign(result, data))
      } else if (this.editMode === 'rowedit') {
        this.$emit('update-cell', this.rowKey, data)
      }
    },
    getRowPermission () {
      let { name, permission = () => { return true } } = this.cellItem
      if (name !== 'ex_operate') {
        return
      }
      if (typeof permission === 'function') {
        return permission(this.rowItem, this.rowKey) || false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
.tb-cell-div{
  position: relative;
  padding: 9px 4px;
  height: 20px;
  min-height: 20px;
  line-height: 20px;
  box-sizing: content-box;
}

.tooltip {
  display: block !important;
  z-index: 10000;
  font-size: 13px;

  .tooltip-inner {
    background: #303133;
    color: white;
    border-radius: 5px;
    padding: 4px 10px 5px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}
</style>
