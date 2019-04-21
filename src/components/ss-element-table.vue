<template>
  <div ref="ElementTable" :id="id" class="ss-element">
      <el-table
        :data="sourceData"
        :border="borderShow"
        :height="tableHeight"
        :max-height="tableHeight"
        :empty-text="noDataText"
        :show-summary="showSummary"
        :sum-text="summaryText"

        @cell-click="handleTdClick"

        :summary-method="handleSummary"
        :row-class-name="handleRowClass"
        style="width: 100%"
        >
        <!-- 复杂表头第一层 -->
        <el-table-column v-for="(item, key) in colModels" :key="key"
          :type="item.name == 'ex_rowid' ? 'index' : ''"
          :index="handleTableIndex"
          :prop="item.name"
          :label="item.text"
          :width="item.width"
          :fixed="leftFrozen && key < leftFrozen ? true : false"
          :render-header="handleRenderHeader"
          :formatter="handleFormatter(item)"
          :sortable="item.sortable && !item.items"

          header-align="center"
          :show-overflow-tooltip="true">
            <!-- 复杂表头第二层 -->
            <el-table-column v-if="item.items && item.items.length > 0" v-for="(level2, key2) in item.items" :key="key2"
              :type="level2.name == 'ex_rowid' ? 'index' : ''"
              :prop="level2.name"
              :label="level2.text"
              :width="level2.width"
              :fixed="leftFrozen && key < leftFrozen ? true : false"
              :render-header="handleRenderHeader"
              :formatter="handleFormatter(level2)"
              :sortable="level2.sortable && !level2.items"

              header-align="center"
              :show-overflow-tooltip="true">

                <!-- 复杂表头第三层 -->
                <el-table-column v-if="level2.items && level2.items.length > 0" v-for="(level3, key3) in level2.items" :key="key3"
                  :type="level3.name == 'ex_rowid' ? 'index' : ''"
                  :prop="level3.name"
                  :label="level3.text"
                  :width="level3.width"
                  :fixed="leftFrozen && key < leftFrozen ? true : false"
                  :render-header="handleRenderHeader"
                  :formatter="handleFormatter(level3)"
                  :sortable="level3.sortable"

                  header-align="center"
                  :show-overflow-tooltip="true">

                </el-table-column>
            </el-table-column>
        </el-table-column>

        <template v-if="flatDataLoadType == 'scroll'">
          <infinite-loading slot="append" @infinite="flatDataScrollLoad">
            <span slot="no-more"></span>
          </infinite-loading>
        </template>

      </el-table>

      <template v-if="JSON.stringify(pagination) !== '{}' && data.length > 0">
        <el-pagination class="ss-element-pagination"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="pagination.pageSizes"
          :layout="pagination.layout"
          :pager-count="pagination.pagerCount || 5"
          :total="data.length"
          @size-change="handleSizeChange">
        </el-pagination>
      </template>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'

import Utils from './utils'

export default {
  name: 'ss-element-table',
  props: {
    id: String,
    data: {
      type: Array,
      required: true
    },
    colModels: {
      type: Array,
      required: true
    },
    // autoWidth: {
    //   type: Boolean,
    //   default: true
    // },
    dataType: String,
    flatDataLoadType: String,
    noDataText: {
      type: String,
      default: '暂无数据'
    },
    borderShow: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryText: {
      type: String,
      default: '合计'
    },
    summaryCols: {
      type: String,
      default: ''
    },
    leftFrozen: {
      type: Number,
      default: 0
    },
    initLoadDatas: {
      type: Number,
      default: 30
    },
    perLoadDatas: {
      type: Number,
      default: 20
    },
    pagination: Object,
    maxHeight: Number,
    group: Object
  },
  data () {
    return {
      sourceData: [],
      flatDataCount: this.initLoadDatas,
      currentPage: 1,
      pageSize: this.pagination && this.pagination.pageSize
    }
  },
  computed: {
    tableHeight () {
      return this.dataType === 'flat' && this.flatDataLoadType === 'pagination' && this.data && this.data.length > 0 ? this.maxHeight - 35 : this.maxHeight
    },
    complexValue () {
      const {data, flatDataCount, pageSize, currentPage} = this
      return {data, flatDataCount, pageSize, currentPage}
    }
  },
  components: {
    InfiniteLoading
  },
  watch: {
    complexValue () {
      this.updateSourceData()
    },
    pagination () {
      this.pageSize = this.pagination.pageSize
    }
  },
  mounted () {
    this.updateSourceData()
  },
  methods: {
    updateSourceData () {
      this.sourceData = this.dataType === 'flat' ? this.getFlatData(this.data) : this.data.slice(0, this.flatDataCount)
    },

    getFlatData (data) {
      if (this.flatDataLoadType === 'scroll') {
        return this.data.slice(0, this.flatDataCount)
      } else if (this.flatDataLoadType === 'pagination') {
        return Utils.getSourceData(data, true, this.pageSize, this.currentPage)
      }
    },

    /**
     * 用于处理表头出现单位需要换行的情况
     */
    handleRenderHeader (h, {column, $index}) {
      return h('span', {}, [
        h('span', {}, column.label.split('<br/>')[0]),
        h('br'),
        h('span', {}, column.label.split('<br/>')[1])
      ])
    },
    /**
     * 数据格式化控制
     */
    handleFormatter (item) {
      if (!item.format) {
        return function (row, column, cellValue, index) {
          return cellValue
        }
      }
      let {type, value} = item.format
      if (type === 'fixed') {
        return function (row, column, cellValue, index) {
          return value !== 0 && !value ? cellValue : cellValue && cellValue.toFixed(value)
        }
      } else if (type === 'date') {
        return function (row, column, cellValue, index) {
          return value !== 0 && !value ? cellValue : cellValue && moment(cellValue).format(value)
        }
      } else if (type === 'precision') {
        return function (row, column, cellValue, index) {
          return value !== 0 && !value ? cellValue : cellValue && cellValue.toPrecision(value)
        }
      }
    },
    handleTableIndex (index) {
      let nindex = index + 1
      if (this.dataType === 'flat') {
        nindex = this.flatDataLoadType === 'scroll' ? nindex : (this.currentPage - 1) * this.pageSize + nindex
      } else {

      }
      return nindex
    },
    /**
     * 滚动加载回调
     */
    flatDataScrollLoad ($state) {
      this.flatDataCount += this.perLoadDatas
      $state.loaded()
      if (this.flatDataCount >= this.data.length) {
        $state.complete()
      }
    },

    /**
     * 合计统计
     */
    handleSummary ({ columns }) {
      let sums = []
      let data = this.data
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        if (this.summaryCols.indexOf(column.property) > -1) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
        }
      })

      sums.map((v, k) => {
        if (k !== 0) {
          sums[k] = columns[k].formatter(k, null, v)
        }
      })

      return sums
    },

    handleRowClass ({row, rowIndex}) {
      return rowIndex % 2 ? 'ss-table-tr-odd' : 'ss-table-tr-even'
    },

    /**
     * 单元格点击事件
     * row: 数据
     */
    handleTdClick (row, column, cell, event) {
      // (数据对象, column列配置，行索引，列索引)
      this.$emit('cell-click', row, cell.parentNode.rowIndex + 1, cell.cellIndex + 1)
    },

    handleSizeChange (nums) {
      this.pageSize = nums
    }
  }
}
</script>
<style>
</style>
