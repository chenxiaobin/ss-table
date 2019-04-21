<template>
  <div ref="GridTable" class="ss-custom" :class="borderShow ? 'ss-custom-border': ''" :id="id">
    <div class="ss-table-main" :style="{height: [mainHeight + 'px']}">
      <!-- 主表 -->
      <div ref="RSsTable" class="ss-table">
        <!-- 表头 -->
        <div ref="RSsThead" class="ss-table-thead">
          <table>
            <colgroup>
              <col v-for="(item, key) in colModelsFlat" :key="key" :width="item.width" />
              <!-- 避免滚动条的17像素影响表格对齐 -->
              <col width="17" />
            </colgroup>
            <thead>
              <tr v-for="(item,row) in theaderRows" :key="row">
                <!-- 表头数据列 -->
                <th v-for="(column,col) in item" :key="col"
                    :rowspan="!column.items && theaderRows.length-column._row"
                    :colspan="column.colspan"
                    :style="{height: [theadHeight && !col && !row ? theadHeight +'px' : 'auto']}">
                  <div>
                    <span v-html="getTableTheadHtml(column)"></span>
                    <!-- 是否使用排序 -->
                    <span v-if="column.sortable" class="ss-table-sort" :class="theadSortActive.colKey == column.name ? theadSortActive.className :''" @click="handleTheadSort(column)">
                      <ss-icon :size="12" class="ss-table-upicon" type="ss-icon-xiangshang"></ss-icon>
                      <ss-icon :size="12" class="ss-table-downicon" type="ss-icon-xiangxia"></ss-icon>
                      <ss-icon :size="12" class="ss-table-defaulticon" type="ss-icon-paixu"></ss-icon>
                    </span>
                  </div>
                </th>
                <th v-if="!row" :rowspan="theaderRows.length">
                  <div class="ss-table-scroll-cell"></div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <!-- 表体 -->
        <div ref="RSsTbody" class="ss-table-tbody" :style="{height: [tbodyHeight ? tbodyHeight +'px' : 'auto']}" >
          <table v-if="data && data.length" :style="tableStyle">
            <colgroup>
                <col v-for="(item,key) in colModelsFlat" :key="key" :width="item.width" />
            </colgroup>

            <tbody>
              <!-- 扁平化的tr处理 -->
              <template v-if="dataType === 'flat'">
                <tr v-for="(tritem, key) in sourceData" :key="key"
                    :class="getTableRowClass(tritem, key)"
                    :style="key%2 ? oddStyle : evenStyle"
                    :data-index="key"
                    @mouseenter="handleTrMouseenter($event, true, tritem)"
                    @mouseleave="handleTrMouseleave($event, true, tritem)">
                  <td v-for="(colitem, col) in colModelsFlat"
                      :key="col"
                      :style="colitem.styles"
                      @click="handleTdClick($event, tritem, colitem, key, col)">
                    <template v-if="colitem.tooltip">
                      <el-tooltip :effect="colitem.tooltip.effect || 'light'" :placement="colitem.tooltip.placement || 'bottom'">
                        <span slot="content" v-html="colValueFormat(tritem, colitem, key, true)"></span>
                        <span>
                          <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                          <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                        </span>
                      </el-tooltip>
                    </template>
                    <template v-else>
                      <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                      <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                    </template>
                  </td>
                </tr>
                <!-- 滚动加载的时候设置的加载条 -->
                <template v-if="flatDataLoadType == 'scroll'">
                  <infinite-loading @infinite="flatDataScrollLoad">
                    <span slot="no-more"></span>
                  </infinite-loading>
                </template>
              </template>
              <!-- 分组树形tr处理 -->
              <template v-if="dataType == 'group'">
                <tr v-for="(tritem, key) in sourceData" :key="key" v-if="tritem.is_expand_show"
                    :class="getTableRowClass(tritem, key)"
                    :style="key%2 ? oddStyle : evenStyle"
                    :data-index="key"
                    @mouseenter="handleTrMouseenter($event, tritem.is_leaf, tritem)"
                    @mouseleave="handleTrMouseleave($event, tritem.is_leaf, tritem)"
                    @click.stop="handleGroupTrGroup(tritem)">
                  <template v-if="tritem.is_leaf">
                    <td v-for="(colitem, col) in colModelsFlat"
                        :key="col"
                        :style="colitem.styles"
                        @click="handleTdClick($event, tritem, colitem, key, col)">
                        <template v-if="colitem.tooltip">
                          <el-tooltip :effect="colitem.tooltip.effect || 'light'" :placement="colitem.tooltip.placement || 'bottom'">
                            <span slot="content" v-html="colValueFormat(tritem, colitem, key, true)"></span>
                            <span>
                              <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                              <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                            </span>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                          <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                        </template>
                    </td>
                  </template>
                  <template v-else>
                    <td :colspan="colModels.length"
                        class="ss-table-tr-group"
                        :class="true ? `ss-table-tr-group-level-${tritem.group_level}`: ''">
                        <ss-icon v-if="!tritem.is_expand" type="ss-icon-gengduo" :size="12"></ss-icon>
                        <ss-icon v-else type="ss-icon-xia" :size="12"></ss-icon><span class="ss-table-tr-groupname" v-html="groupNameFormat(tritem)"></span></td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>

          <div v-else-if="!data.length && !loading" class="ss-table-nodata-text">{{noDataText}}</div>

        </div>
        <!--统计合计列-->
        <div v-if="showSummary" ref="RSsSummary" class="ss-table-summary">
          <table :style="tableStyle">
            <colgroup>
                <col v-for="(item, key) in colModelsFlat" :key="key" :width="item.width" />
                <col width="17" />
            </colgroup>

            <tbody>
              <tr>
                <td v-for="(tditem, key) in colSummary" :key="key" ><template v-if="key==0 || summaryCols.indexOf(tditem.name) > -1"><span v-html="colValueFormat(tditem, tditem, key, null, 'sum_value')"></span></template></td>
                <!--因为滚动条占位补齐-->
                <td>
                  <div class="ss-table-scroll-cell"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 冻结表 -->
      <template v-if="leftFrozen">
        <div ref="RSsTableFixed" class="ss-table ss-table-fixed">
          <!-- 冻结表头 -->
          <div ref="RSsTheadFixed" class="ss-table-thead">
            <table>
              <colgroup>
                <col  v-if="key<leftFrozen" v-for="(item, key) in colModelsFlat" :key="key" :width="item.width" />
              </colgroup>
              <thead>
                <tr v-for="(item, row) in theaderRows" :key="row" >
                  <!-- 表头数据列 -->
                  <th  v-if="col<leftFrozen" v-for="(column, col) in item" :key="col"
                    :rowspan="!column.items && theaderRows.length-column._row"
                    :colspan="column.colspan"
                    :style="{height: [theadHeight && !col && !row ? theadHeight +'px' : 'auto']}">
                    <div>
                      <span v-html="column.text"></span>
                      <!-- 是否使用排序 -->
                      <span v-if="column.sortable" class="ss-table-sort" :class="theadSortActive.colKey == column.name ? theadSortActive.className :''" @click="handleTheadSort(column)">
                        <ss-icon :size="12" class="ss-table-upicon" type="ss-icon-xiangshang"></ss-icon>
                        <ss-icon :size="12" class="ss-table-downicon" type="ss-icon-xiangxia"></ss-icon>
                        <ss-icon :size="12" class="ss-table-defaulticon" type="ss-icon-paixu"></ss-icon>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <!-- 冻结表体 -->
          <div ref="RSsTbodyFixed" class="ss-table-tbody" :style="{height: [(tbodyHeight - 17) + 'px']}" >
            <table v-if="data && data.length" :style="tableStyle">
              <colgroup>
                  <col  v-if="key<leftFrozen" v-for="(item, key) in colModelsFlat" :key="key" :width="item.width" />
              </colgroup>

              <tbody>
                <!-- 扁平化的tr处理 -->
                <template v-if="dataType === 'flat'">
                  <tr v-for="(tritem, key) in sourceData" :key="key"
                      :class="getTableRowClass(tritem, key)"
                      :style="key%2?oddStyle:evenStyle"
                      :data-index="key"
                      @mouseenter="handleTrMouseenter($event, true, tritem)"
                      @mouseleave="handleTrMouseleave($event, true, tritem)">
                    <td v-for="(colitem, col) in colModelsFlat"
                        :key="col"
                        :style="colitem.styles"
                        v-if="col<leftFrozen"
                        @click="handleTdClick($event, tritem, colitem, key, col)">
                        <template v-if="colitem.tooltip">
                          <el-tooltip :effect="colitem.tooltip.effect || 'light'" :placement="colitem.tooltip.placement || 'bottom'">
                            <span slot="content" v-html="colValueFormat(tritem, colitem, key, true)"></span>
                            <span>
                              <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                              <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                            </span>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                          <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                        </template>
                    </td>
                  </tr>
                </template>
                <!-- 分组树形tr处理 -->
                <template v-if="dataType == 'group'">
                  <tr v-for="(tritem, key) in sourceData" :key="key" v-if="tritem.is_expand_show"
                      :class="getTableRowClass(tritem, key)"
                      :style="key%2 ? oddStyle : evenStyle"
                      :data-index="key"
                      @mouseenter="handleTrMouseenter($event, tritem.is_leaf, tritem)"
                      @mouseleave="handleTrMouseleave($event, tritem.is_leaf, tritem)"
                      @click.stop="handleGroupTrGroup(tritem)">
                    <template v-if="tritem.is_leaf">
                      <td v-for="(colitem, col) in colModelsFlat"
                          :key="col"
                          :style="colitem.styles"
                          v-if="col<leftFrozen"
                          @click="handleTdClick($event, tritem, colitem, key, col)">
                        <!--tooltip显示功能-->
                        <template v-if="colitem.tooltip">
                          <el-tooltip :effect="colitem.tooltip.effect || 'light'" :placement="colitem.tooltip.placement || 'bottom'">
                            <span slot="content" v-html="colValueFormat(tritem, colitem, key, true)"></span>
                            <span>
                              <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                              <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                            </span>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <span :class="getTableCellClass(tritem, colitem)" v-html="colValueFormat(tritem, colitem, key)"></span>
                          <span :class="getTableCellClass(tritem, appenditem)" v-for="(appenditem, akey) in colitem.append" :key="`append-${akey}`" v-html="colValueFormat(tritem, appenditem, akey)"></span>
                        </template>
                      </td>
                    </template>
                    <template v-else>
                      <td :colspan="leftFrozen"
                          class="ss-table-tr-group"
                          :class="true ? `ss-table-tr-group-level-${tritem.group_level}`: ''">
                          <ss-icon v-if="!tritem.is_expand" type="ss-icon-gengduo" :size="12"></ss-icon>
                          <ss-icon v-else type="ss-icon-xia" :size="12"></ss-icon><span class="ss-table-tr-groupname" v-html="groupNameFormat(tritem)"></span></td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>

          </div>
        </div>
      </template>

      <!--统计合计冻结列-->
      <template v-if="showSummary">
        <div ref="RSsSummaryFixed" class="ss-table-summary ss-table-summary-fixed">
            <table :style="tableStyle">
              <colgroup>
                  <col v-if="key<leftFrozen" v-for="(item, key) in colModelsFlat" :key="key" :width="item.width" />
              </colgroup>
              <tbody>
                <tr>
                  <td v-if="key<leftFrozen" v-for="(tditem, key) in colSummary" :key="key" ><template v-if="key==0 || summaryCols.indexOf(tditem.name) > -1"><span v-html="colValueFormat(tditem, tditem, key, 'sum_value')"></span></template></td>
                </tr>
              </tbody>
            </table>
          </div>
      </template>
    </div>

    <template v-if="JSON.stringify(pagination) !== '{}' && data.length > 0 && dataType == 'flat'">
      <el-pagination class="ss-custom-pagination"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="pagination.pageSizes"
        :layout="pagination.layout"
        :pager-count="pagination.pagerCount || 5"
        :total="data.length"
        @size-change="handleSizeChange">
      </el-pagination>
    </template>
    <div class="ss-table-loading" v-if="loading || loadingInTable">
      <div class="ss-table-loading-svg"></div>
    </div>
  </div>
</template>
<script>

import _ from 'lodash'
import moment from 'moment'
import Utils from './utils'
import Handles from '../handles/index'
import Pinyin from '../utils/pinyin'

import InfiniteLoading from 'vue-infinite-loading'

/**
 * 处理完的树形数据需要包含的字段
 * group_name: 分组名称
 * all_child_length: 各分组数据统计个数
 * group_guid: 唯一标识
 * group_level: 分组层级
 * group_cid: 构建父子关系
 * group_parent_cid: 构建父子关系
 * is_expand_show: 分组是否显示
 * is_expand: 分组是否展开
 * is_leaf: 是否叶子节点
 */

export default {
  name: 'ss-custom-table',
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
    loading: {
      type: Boolean,
      default: false
    },
    dataType: String,
    flatDataLoadType: String,
    noDataText: {
      type: String,
      default: '暂无数据'
    },
    oddStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    evenStyle: {
      type: Object,
      default: () => {
        return {}
      }
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
    group: Object,
    dataValueAsClass: Array
  },
  components: {
    InfiniteLoading
  },
  data () {
    let { headerRows, headerColumns } = this.initTheadRows()

    return {
      sourceData: [],
      tableStyle: {
        width: this.autoWidth ? '100%' : ''
      },
      mainHeight: this.maxHeight,
      tbodyHeight: null,
      tbodyVScroll: 0,
      tbodyHScroll: 0,
      theadHeight: 0,
      theaderRows: headerRows,
      theaderColumns: headerColumns,
      colSummary: [],
      theadSortActive: {
        sort: '',
        colKey: '',
        className: ''
      },
      currentPage: 1,
      pageSize: this.pagination && this.pagination.pageSize,
      flatDataCount: this.initLoadDatas,
      loadingInTable: false,
      groupDataIndex: 0
    }
  },
  watch: {
    /**
     * 滚动条变化，重置头部/合计行/固定列滚动条
     */
    tbodyHScroll () {
      if (this.$refs.RSsThead) {
        this.$refs.RSsThead.scrollLeft = this.tbodyHScroll
      }
      if (this.$refs.RSsSummary) {
        this.$refs.RSsSummary.scrollLeft = this.tbodyHScroll
      }
    },
    tbodyVScroll () {
      if (this.$refs.RSsTbodyFixed) {
        this.$refs.RSsTbodyFixed.scrollTop = this.tbodyVScroll
      }
    },
    complexValue () {
      this.updateSourceData()
    },
    colModels () {
      let { headerRows, headerColumns } = this.initTheadRows()
      this.theaderRows = headerRows
      this.theaderColumns = headerColumns

      this.getModelsSummary()

      this.$nextTick(() => {
        this.initTableSize()
      })
    },
    pagination () {
      this.pageSize = this.pagination && this.pagination.pageSize
    },
    maxHeight () {
      this.initMainHeight()
    },
    data () {
      this.loadingInTable = true
      this.$nextTick(() => {
        this.loadingInTable = false
      })
      this.initMainHeight()
    },
    sourceData () {
      this.getModelsSummary()
    }
  },
  computed: {
    colModelsFlat () {
      let tempModels = []
      function getItems (data) {
        data.map(v => {
          if (!v.items) {
            tempModels.push(v)
          } else {
            getItems(v.items)
          }
        })
      }
      getItems(this.colModels)
      return tempModels
    },
    /**
     * 数据变化，重新深拷贝数据
     */
    complexValue () {
      const {data, flatDataCount, pageSize, currentPage} = this
      return {data, flatDataCount, pageSize, currentPage}
    }
  },
  mounted () {
    this.updateSourceData()
    this.getModelsSummary()
    this.getScrollSize()
  },
  methods: {
    updateSourceData () {
      this.sourceData = this.dataType === 'flat' ? this.getFlatData(this.data) : this.getGroupData(this.data)
    },
    getFlatData (data) {
      if (this.flatDataLoadType === 'scroll') {
        return data.slice(0, this.flatDataCount)
      } else if (this.flatDataLoadType === 'pagination') {
        return Utils.getSourceData(data, true, this.pageSize, this.currentPage)
      }
    },
    getGroupData (data) {
      let nindex = 1
      _.each(data, (v) => {
        if (v.is_leaf) {
          v.__index = nindex
          nindex++
        } else {
          nindex = 1
        }
      })
      let result = data.filter(v => {
        return v.is_expand_show
      })
      return result
    },
    initMainHeight () {
      this.mainHeight = this.maxHeight - (JSON.stringify(this.pagination) !== '{}' && this.data && this.data.length > 0 && this.dataType === 'flat' ? 35 : 0)
      this.initTableSize()
    },
    initTheadRows () {
      // 计算headerRows、headerColumns
      let headerRows = []
      let headerColumns = []
      function getDepth (arr, depth, col) {
        let step = !col ? 1 : 1 / arr.length
        arr.forEach(item => {
          if (item.items) {
            item.colspan = item.items.length // 用于合并列
            getDepth(item.items, depth + 1, col)
          } else {
            headerColumns.push(item)
          }
          item._row = depth // 用于合并行
          item.colx = col // 用作复杂表头的左侧位置的标识符,列的x抽坐标
          col += step
          let row = (headerRows[depth] = headerRows[depth] || [])
          row.push(item)
        })
      }
      getDepth(this.colModels, 0, 0)
      return {
        headerRows,
        headerColumns
      }
    },
    initTableSize () {
      let fixedHeight = this.$refs.RSsTheadFixed && this.$refs.RSsTheadFixed.offsetHeight
      let headHeight = this.$refs.RSsThead.offsetHeight
      this.theadHeight = fixedHeight > headHeight ? fixedHeight : headHeight

      this.tbodyHeight = this.mainHeight - this.theadHeight

      if (
        this.showSummary &&
        // this.data &&
        // this.data.length &&
        this.$refs.RSsSummary
      ) {
        this.tbodyHeight -= this.$refs.RSsSummary.offsetHeight
      }
    },
    /**
     * 滚动条监听
     */
    getScrollSize () {
      this.initTableSize()
      this.$refs.RSsTbody.onscroll = e => {
        this.tbodyVScroll = e.srcElement.scrollTop
        this.tbodyHScroll = e.srcElement.scrollLeft
      }
    },
    /**
     * 统计行数据处理
     */
    getModelsSummary () {
      const sumColModel = Object.assign(this.colModelsFlat)
      this.colModelsFlat.forEach((column, index) => {
        if (index === 0) {
          sumColModel[index].sum_value = this.summaryText
          return
        }
        const values = this.sourceData.map(item => Number(item[column.name]))
        if (!values.every(value => isNaN(value))) {
          sumColModel[index].sum_value = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sumColModel[index].sum_value = ''
        }
      })
      this.colSummary = sumColModel
    },

    /**
     * 数据格式化，后续改造，走数据处理函数
     */
    colValueFormat (data, column, rowindex, istooltip, aliasname) {
      let { format, name, extend, text, append } = column
      name = aliasname || name
      if (extend && name !== 'sum_value') {
        if (name === 'ex_rowid') {
          return this.handleTableIndex(rowindex, data)
        }
      }

      if (format) {
        let type = null
        switch (typeof format) {
          case 'object':
            type = format.type
            break
          case 'function':
            return format(data, column, rowindex)
        }
        switch (type) {
          case 'fixed':
            return data[name] && data[name].toFixed(format.value)
          case 'precision':
            return data[name] && data[name].toPrecision(format.value)
          case 'date':
            return data[name] && moment(data[name]).format(format.value)
        }
      }

      if (istooltip) {
        let str = ''
        if (append) {
          _.each(append, (v) => {
            str += `<br/>${v.text}: ${data[v.name]}`
          })
        }
        return `${text}: ${data[name]} ${str}`
      }

      return data[name]
    },
    handleTableIndex (index, data) {
      let nindex = 0
      if (this.dataType === 'flat') {
        nindex = index + 1
        nindex = this.flatDataLoadType === 'scroll' ? nindex : (this.currentPage - 1) * this.pageSize + nindex
      } else {
        nindex = data.__index
      }
      return nindex
    },
    /**
     * 点击列排序
     */
    handleTheadSort (column) {
      let { name } = column

      if (name !== this.theadSortActive.colKey) {
        this.theadSortActive = {
          sort: '',
          colKey: '',
          className: ''
        }
      }
      this.theadSortActive.colKey = name
      let { sort } = this.theadSortActive
      if (sort === '') {
        this.theadSortActive.sort = 'down'
        this.theadSortActive.className = 'ss-table-sort-down'
      } else if (sort === 'down') {
        this.theadSortActive.sort = 'up'
        this.theadSortActive.className = 'ss-table-sort-up'
      } else if (sort === 'up') {
        this.theadSortActive.sort = ''
        this.theadSortActive.className = ''
      }

      sort = this.theadSortActive.sort

      function dataSort (data, isdesc) {
        return Handles.DataSort(
          'flat',
          {
            data: [
              {
                name: name,
                order: isdesc ? 'desc' : 'asc'
              }
            ]
          },
          data
        )
      }
      this.sourceData =
        sort === 'up'
          ? dataSort(this.sourceData)
          : sort === 'up'
            ? dataSort(this.sourceData, 1)
            : Utils.objDeepCopy(this.data)
    },
    handleTdClick (event, data, column, rowindex, colindex) {
      this.$emit('cell-click', data, rowindex + 1, colindex + 1)
    },

    handleSizeChange (nums) {
      this.pageSize = nums
    },
    flatDataScrollLoad ($state) {
      this.flatDataCount += this.perLoadDatas
      $state.loaded()
      if (this.flatDataCount >= this.data.length) {
        $state.complete()
      }
    },

    handleTrMouseenter (e, isLeaf, data) {
      // 同时绑定mouseenter、mouseleave、click，chrome特性会不定触发
      if (!e.relatedTarget) {
        return null
      }
      let dataIndex = e.currentTarget.getAttribute('data-index')
      let doms = document.querySelectorAll(`#${this.id} .ss-table-tbody tr[data-index="${dataIndex}"]`)
      for (let i = 0; i < doms.length; i++) {
        doms[i].classList.add('ss-table-tr-hover')
      }
      if (isLeaf) {
        this.$emit('row-mouseenter', data)
      }
    },

    handleTrMouseleave (e, isLeaf, data) {
      // 同时绑定mouseenter、mouseleave、click，chrome特性会不定触发
      if (!e.relatedTarget) {
        return
      }
      let dataIndex = e.currentTarget.getAttribute('data-index')
      let doms = document.querySelectorAll(`#${this.id} .ss-table-tbody tr[data-index="${dataIndex}"]`)
      for (let i = 0; i < doms.length; i++) {
        doms[i].classList.remove('ss-table-tr-hover')
      }
      if (isLeaf) {
        this.$emit('row-mouseleave', data)
      }
    },

    handleGroupTrGroup (data) {
      if (data.is_leaf) {
        return
      }
      let result = this.data
      _.each(result, (v) => {
        if (v.group_guid === data.group_guid) {
          v.is_expand = !v.is_expand
        }
        // 需要展开的
        if (data.is_expand && v.group_parent_cid === data.group_cid) {
          v.is_expand_show = true
        }
        // 需要收缩的
        if (!data.is_expand && v.group_parent_cid && v.group_parent_cid.indexOf(data.group_cid) > -1) {
          v.is_expand = false
          v.is_expand_show = false
        }
      })
      this.sourceData = result.filter(v => {
        return v.is_expand_show
      })
    },

    groupNameFormat (data) {
      let { groupCustomName } = this.group
      if (groupCustomName) {
        let str = groupCustomName.replace('{0}', data.group_name).replace('{1}', data.all_child_length)
        return str
      }
      return data.group_name
    },

    getTableCellClass (data, column) {
      let str = `special-cell-${column.name} `
      let value = data[column.name]
      value = _.isString(value) ? Pinyin(value)[0] : value
      if ((value || value === 0) && _.indexOf(['string', 'number', 'boolean'], typeof value) > -1 && value.toString().length < 10) {
        str = str + `special-cell-${value}`
      }
      return str
    },

    getTableRowClass (data, index) {
      let valueArr = this.dataValueAsClass
      let classes = index % 2 ? 'ss-table-tr-odd' : 'ss-table-tr-even'
      _.each(valueArr, (v) => {
        let vpinyin = _.isString(data[v]) ? Pinyin(data[v])[0] : data[v]
        let nstr = `ss-table-tr-field-${vpinyin || ''}`
        classes += ` ${nstr}`
      })
      return classes
    },

    getTableTheadHtml (column) {
      let { text, unit } = column
      let ntext = text
      if (unit) {
        ntext = `${ntext}<br/><span class="ss-table-thead-unit">${unit}</span>`
      }
      ntext = ntext.replace('m3', 'm<sup>3</sup>').replace('m2', 'm<sup>2</sup>')
      return ntext
    }
  }
}
</script>
<style>
</style>
