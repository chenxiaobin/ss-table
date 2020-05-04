<template>
  <div ref="GridTable" class="ss-custom" :class="borderShow ? 'ss-custom-border': ''" :id="id">
    <div class="ss-table-main" :style="{height: [mainHeight + 'px']}">
      <!-- 主表 -->
      <div ref="RSsTable" class="ss-table">
        <!-- 表头 -->
        <div ref="RSsThead" class="ss-table-thead" v-if="headVisible">
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
                    :style="getTheadStyles(col, row)">
                  <div @click="handleTheadSort(column)">
                    <span v-html="getTableTheadHtml(column)"></span>
                    <!-- 是否使用排序 -->
                    <span v-if="column.sortable" class="ss-table-sort">
                        <template v-if="theadSortActive.colKey == column.name">
                          <i v-if="theadSortActive.sort === 'asc'" class="iconfont ss-icon-xiangshang"></i>
                          <i v-if="theadSortActive.sort === 'desc'" class="iconfont ss-icon-xiangxia"></i>
                        </template>
                        <!-- <i v-if="theadSortActive.sort === ''" class="iconfont ss-icon-paixu"></i> -->
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
          <table v-if="data && data.length">
            <colgroup>
                <col v-for="(item,key) in colModelsFlat" :key="key" :width="item.width" />
            </colgroup>

            <tbody>
              <!-- 扁平化的tr处理 -->
              <template v-if="dataType === 'flat'">
                <table-row v-for="(tritem, key) in sourceData" :key="key"
                          :style="key%2 ? oddStyle : evenStyle"
                          :data-index="key"
                          :data-primary-key="primaryKey ? tritem[primaryKey] : null"
                          :tr-item="tritem"
                          :tr-key="key"
                          :data-type="dataType"
                          v-on="$listeners"
                          @update-row="handleUpdateRow"></table-row>

                <!-- 滚动加载的时候设置的加载条 -->
                <template v-if="flatDataLoadType == 'scroll'">
                  <infinite-loading @infinite="flatDataScrollLoad">
                    <span slot="no-more"></span>
                  </infinite-loading>
                </template>
              </template>
              <!-- 分组树形tr处理 -->
              <template v-if="dataType == 'group'">
                <table-row v-for="(tritem, key) in sourceData" :key="key" v-if="tritem.is_expand_show"
                          :style="key%2 ? oddStyle : evenStyle"
                          :data-index="key"
                          :tr-item="tritem"
                          :tr-key="key"
                          :data-type="dataType"
                          :group="group"
                          v-on="$listeners"
                          @click.native.stop="handleGroupTrGroup(tritem)"
                          @update-row="handleUpdateRow"
                          @in-group-async="handleInGroupAsync"></table-row>
              </template>
            </tbody>
          </table>

          <!-- <div v-else-if="!data.length && !loading" class="ss-table-nodata-text">{{noDataText}}</div> -->
          <!-- 无数据展示，确保内容居中，且跟随滚动条移动 -->
          <template v-else-if="!data.length && !loading">
            <div class="ss-table-nodata-text">{{noDataText}}</div>
            <table :style="Object.assign(tableStyle, {height: '100%'})">
              <colgroup>
                  <col v-for="(item,key) in colModelsFlat" :key="key" :width="item.width" />
              </colgroup>
            </table>
          </template>

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
                <!--因为滚动条占位补齐-->
                <table-cell v-for="(tditem, key) in colSummary"
                            cell-type="summary"
                            :key="key"
                            :cell-item="tditem"
                            :cell-key="key"
                            :editable="editable">
                </table-cell>
                <td>
                  <div class="ss-table-scroll-cell"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 冻结表（左侧） -->
      <template v-if="leftFrozen">
        <div class="ss-table ss-table-fixed">
          <!-- 冻结表头 -->
          <div ref="RSsTheadFixed" class="ss-table-thead"  v-if="headVisible">
            <table>
              <colgroup>
                <col v-for="(item, key) in getFrozenColumns(colModelsFlat, 'left', leftFrozen)"
                    :key="key"
                    :width="item.width" />
              </colgroup>
              <thead>
                <tr v-for="(item, row) in theaderRows" :key="row" >
                  <!-- 表头数据列 -->
                  <th v-for="(column, col) in getFrozenColumns(item, 'left', leftFrozen)"
                      :key="col"
                      :rowspan="!column.items && theaderRows.length-column._row"
                      :colspan="column.colspan"
                      :style="getTheadStyles(col, row)">
                    <div @click="handleTheadSort(column)">
                      <span v-html="column.text"></span>
                      <!-- 是否使用排序 -->
                      <span v-if="column.sortable" class="ss-table-sort">
                        <template v-if="theadSortActive.colKey == column.name">
                          <i v-if="theadSortActive.sort === 'asc'" class="iconfont ss-icon-xiangshang"></i>
                          <i v-if="theadSortActive.sort === 'desc'" class="iconfont ss-icon-xiangxia"></i>
                        </template>
                        <!-- <i v-if="theadSortActive.sort === ''" class="iconfont ss-icon-paixu"></i> -->
                      </span>
                    </div></th>
                </tr>
              </thead>
            </table>
          </div>
          <!-- 冻结表体 -->
          <div ref="RSsTbodyFixedLeft" class="ss-table-tbody" :style="{height: [(tbodyHeight - 16) + 'px']}" >
            <table v-if="data && data.length">
              <colgroup>
                  <col v-for="(item, key) in getFrozenColumns(colModelsFlat, 'left', leftFrozen)"
                      :key="key"
                      :width="item.width" />
              </colgroup>

              <tbody>
                <!-- 扁平化的tr处理 -->
                <template v-if="dataType === 'flat'">
                  <table-row v-for="(tritem, key) in sourceData" :key="key"
                          :style="key%2 ? oddStyle : evenStyle"
                          :data-index="key"
                          :tr-item="tritem"
                          :tr-key="key"
                          :data-type="dataType"
                          v-on="$listeners"
                          :frozen-left-col="leftFrozen"
                          @update-row="handleUpdateRow"></table-row>
                </template>
                <!-- 分组树形tr处理 -->
                <template v-if="dataType == 'group'">
                  <table-row v-for="(tritem, key) in sourceData" :key="key" v-if="tritem.is_expand_show"
                          :style="key%2 ? oddStyle : evenStyle"
                          :data-index="key"
                          :tr-item="tritem"
                          :tr-key="key"
                          :data-type="dataType"
                          :group="group"
                          v-on="$listeners"
                          :frozen-left-col="leftFrozen"
                          @click.stop="handleGroupTrGroup(tritem)"
                          @update-row="handleUpdateRow"></table-row>
                </template>
              </tbody>
            </table>

          </div>
        </div>
      </template>

      <!-- 冻结表（右侧） -->
      <template v-if="rightFrozen">
        <div class="ss-table ss-table-fixed-right">
          <!-- 冻结表头 -->
          <div ref="RSsTheadFixed" class="ss-table-thead"  v-if="headVisible">
            <table>
              <colgroup>
                <col v-for="(item, key) in getFrozenColumns(colModelsFlat, 'right', rightFrozen)"
                    :key="key"
                    :width="item.width" />
              </colgroup>
              <thead>
                <tr v-for="(item, row) in theaderRows" :key="row" >
                  <!-- 表头数据列 -->
                  <th v-for="(column, col) in getFrozenColumns(item, 'right', rightFrozen)"
                      :key="col"
                      :rowspan="!column.items && theaderRows.length-column._row"
                      :colspan="column.colspan"
                      :style="getTheadStyles(col, row)">
                    <div @click="handleTheadSort(column)">
                      <span v-html="column.text"></span>
                      <!-- 是否使用排序 -->
                      <span v-if="column.sortable" class="ss-table-sort">
                        <template v-if="theadSortActive.colKey == column.name">
                          <i v-if="theadSortActive.sort === 'asc'" class="iconfont ss-icon-xiangshang"></i>
                          <i v-if="theadSortActive.sort === 'desc'" class="iconfont ss-icon-xiangxia"></i>
                        </template>
                        <!-- <i v-if="theadSortActive.sort === ''" class="iconfont ss-icon-paixu"></i> -->
                      </span>
                    </div></th>
                </tr>
              </thead>
            </table>
          </div>
          <!-- 冻结表体 -->
          <div ref="RSsTbodyFixedRight" class="ss-table-tbody" :style="{height: [(tbodyHeight - 16) + 'px']}" >
            <table v-if="data && data.length">
              <colgroup>
                  <col v-for="(item, key) in getFrozenColumns(colModelsFlat, 'right', rightFrozen)"
                      :key="key"
                      :width="item.width" />
              </colgroup>

              <tbody>
                <!-- 扁平化的tr处理 -->
                <template v-if="dataType === 'flat'">
                  <table-row v-for="(tritem, key) in sourceData" :key="key"
                          :style="key%2 ? oddStyle : evenStyle"
                          :data-index="key"
                          :tr-item="tritem"
                          :tr-key="key"
                          :data-type="dataType"
                          :frozen-col-models="getFrozenColumns(colModelsFlat, 'right', rightFrozen)"
                          v-on="$listeners"
                          @update-row="handleUpdateRow"></table-row>
                </template>
                <!-- 分组树形tr处理 -->
                <template v-if="dataType == 'group'">
                  <table-row v-for="(tritem, key) in sourceData" :key="key" v-if="tritem.is_expand_show"
                          :style="key%2 ? oddStyle : evenStyle"
                          :data-index="key"
                          :tr-item="tritem"
                          :tr-key="key"
                          :data-type="dataType"
                          :group="group"
                          :frozen-col-models="getFrozenColumns(colModelsFlat, 'right', rightFrozen)"
                          v-on="$listeners"
                          @click.stop="handleGroupTrGroup(tritem)"
                          @update-row="handleUpdateRow"></table-row>
                </template>
              </tbody>
            </table>

          </div>
        </div>
      </template>

      <!--统计合计冻结列-->
      <template v-if="showSummary">
        <div class="ss-table-summary ss-table-summary-fixed">
            <table :style="tableStyle">
              <colgroup>
                  <col v-for="(item, key) in getFrozenColumns(colModelsFlat, 'left', leftFrozen)"
                      :key="key"
                      :width="item.width" />
              </colgroup>
              <tbody>
                <tr>
                  <table-cell v-for="(tditem, key) in colSummary"
                            cell-type="summary"
                            :key="key"
                            :cell-item="tditem"
                            :cell-key="key">
                  </table-cell>
                </tr>
              </tbody>
            </table>
          </div>
      </template>
    </div>

    <!-- 表格分页 -->
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

    <!-- 加载中 -->
    <div class="ss-table-loading" v-if="loading || loadingInTable">
      <div class="ss-table-loading-svg iconfont ss-icon-jiazai"><div>加载中...</div></div>
    </div>
  </div>
</template>
<script>

import _ from 'lodash'
import InfiniteLoading from 'vue-infinite-loading'
import { getTreeData, getSliceData, getSourceData, getGroupExpendData, getSortData } from '../utils/data'
import TableRow from '../components/row'
import TableCell from '../components/cell'

export default {
  name: 'table-core',
  inject: ['root'],
  provide () {
    return {
      self: this
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    dataType: String,
    group: Object,
    colModels: {
      type: Array,
      required: true
    },
    noDataText: {
      type: String,
      default: '暂无数据'
    },
    oddStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    evenStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    initLoadDatas: {
      type: Number,
      default: 30
    },
    perLoadDatas: {
      type: Number,
      default: 20
    },
    maxHeight: Number,
    loading: Boolean,
    theadStyle: Function,
    pagination: Object,
    groupAsync: {
      type: Function,
      default () {
        return () => { return [] }
      }
    }
  },
  components: {
    InfiniteLoading, TableRow, TableCell
  },
  data () {
    let { headerRows, headerColumns } = this.initTheadRows()

    // 直接读取root值
    let {
      id, flatDataLoadType, borderShow, leftFrozen, rightFrozen, dataValueAsClass,
      showSummary, summaryText, summaryCols, headVisible, editable, editMode, primaryKey
    } = this.root

    let rootValues = {
      id,
      flatDataLoadType,
      borderShow,
      leftFrozen,
      rightFrozen,
      showSummary,
      summaryText,
      summaryCols,
      dataValueAsClass,
      headVisible,
      editable,
      editMode,
      primaryKey
    }

    return Object.assign(rootValues, {
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
      groupDataIndex: 0,

      tempEditData: [],
      cdatas: []
    })
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
      // 左侧列滚动定位
      if (this.$refs.RSsTbodyFixedLeft) {
        this.$refs.RSsTbodyFixedLeft.scrollTop = this.tbodyVScroll
      }
      // 右侧列滚动定位
      if (this.$refs.RSsTbodyFixedRight) {
        this.$refs.RSsTbodyFixedRight.scrollTop = this.tbodyVScroll
      }
    },
    complexValue () {
      this.cdatas = this.dataType === 'flat' ? this.data : getTreeData(this.data, this.group)
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
      this.theadSortActive = {
        sort: '',
        colKey: '',
        className: ''
      }
      this.initMainHeight()
    },
    sourceData () {
      this.getModelsSummary()
    },
    group () {
      this.updateSourceData()
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
    this.cdatas = this.dataType === 'flat' ? this.data : getTreeData(this.data, this.group)
    this.updateSourceData()
    this.getModelsSummary()
    this.getScrollSize()
  },
  methods: {
    updateSourceData () {
      this.sourceData = this.dataType === 'flat' ? this.getFlatData(this.cdatas) : getGroupExpendData(this.cdatas)
    },
    getFlatData (data) {
      if (this.flatDataLoadType === 'scroll') {
        return getSliceData(data, this.flatDataCount)
      } else if (this.flatDataLoadType === 'pagination') {
        return getSourceData(data, this.pageSize, this.currentPage)
      }
    },
    initMainHeight () {
      this.mainHeight = this.maxHeight - (JSON.stringify(this.pagination) !== '{}' && this.cdatas && this.cdatas.length > 0 && this.dataType === 'flat' ? 35 : 0)
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
    getTheadStyles (col, row) {
      let sdata = {
        height: [this.theadHeight && !col && !row ? this.theadHeight + 'px' : 'auto']
      }
      let sfuncdata = {}
      if (typeof this.theadStyle === 'function') {
        sfuncdata = this.theadStyle(col + 1) || {}
      }
      return Object.assign({}, sfuncdata, sdata)
    },
    initTableSize () {
      let fixedHeight = this.$refs.RSsTheadFixed && this.$refs.RSsTheadFixed.offsetHeight
      let headHeight = this.headVisible ? this.$refs.RSsThead.offsetHeight : 0
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
        const values = this.cdatas.map(item => Number(item[column.name]))
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
     * 点击列排序
     */
    handleTheadSort (column) {
      let { name } = column

      if (name !== this.theadSortActive.colKey) {
        this.theadSortActive = {
          sort: '',
          colKey: ''
        }
      }
      this.theadSortActive.colKey = name
      let { sort } = this.theadSortActive

      sort = sort === '' ? sort = 'desc' : (sort === 'desc' ? sort = 'asc' : '')

      this.theadSortActive = { sort, colKey: name }
      this.sourceData = this.getSourceDatas()
    },
    getSourceDatas (datas) {
      let { sort, colKey } = this.theadSortActive
      let sortdata = getSortData(datas || this.cdatas, sort, colKey, this.group)
      return this.dataType === 'flat' ? this.getFlatData(sortdata) : getGroupExpendData(sortdata)
    },
    handleSizeChange (nums) {
      this.pageSize = nums
    },
    flatDataScrollLoad ($state) {
      this.flatDataCount += this.perLoadDatas
      $state.loaded()
      if (this.flatDataCount >= this.cdatas.length) {
        $state.complete()
      }
    },

    handleGroupTrGroup (data) {
      if (data.is_leaf) {
        return
      }
      let result = this.cdatas
      // 缓存当前分组展开状态，不用实时的，因为会被修改
      let isExpand = data.is_expand
      _.each(result, (v) => {
        // 将点击的这条记录收起
        if (v.group_guid === data.group_guid) {
          v.is_expand = v.temp_expand = !v.is_expand
        }
        // isExpand=false需要展开的
        if (!isExpand && v.group_parent_cid === data.group_cid) {
          v.is_expand_show = v.temp_expand_show = true
        }
        // isExpand=true需要收缩的
        if (isExpand && v.group_parent_cid && v.group_parent_cid.indexOf(data.group_cid) > -1) {
          v.is_expand = v.temp_expand = false
          v.is_expand_show = v.temp_expand_show = false
        }
      })
      result = this.getSourceDatas(result)
      this.sourceData = result.filter(v => {
        return v.is_expand_show
      })
    },
    getTableTheadHtml (column) {
      let { text, unit } = column
      let ntext = text
      if (unit) {
        ntext = `${ntext}<br/><span class="ss-table-thead-unit">${unit}</span>`
      }
      ntext = ntext.replace('m3', 'm<sup>3</sup>').replace('m2', 'm<sup>2</sup>')
      return ntext
    },
    handleUpdateRow (index, data) {
      if (this.tempEditData.length) {
        this.tempEditData = _.filter(this.tempEditData, (v) => {
          return v[this.primaryKey] !== data[this.primaryKey]
        })
      }
      this.tempEditData.push(data)
      this.$set(this.sourceData, index, data)
    },
    // 有用，在cell.vue中调用
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
     * columns：列数组数组
     * direction: 方向（left、right）
     * nums：固定列数
     */
    getFrozenColumns (columns, direction, nums) {
      let len = columns.length
      let start = 0
      let end = nums
      if (direction === 'right') {
        start = len - nums
        end = len
      }
      return columns.slice(start, end)
    },

    handleInGroupAsync (data) {
      let callback = (result) => {
        let temp = this.cdatas.concat(result)
        temp = getTreeData(temp, this.group)
        let { key = 'id', parentKey = 'parent_id' } = this.group
        // 新增的id数组
        let values = _.map(result, key)
        // 新增的父级id数组
        let pvalues = _.uniq(_.map(result, parentKey))
        temp.map((v, vkey) => {
          // 已经点击过的设置为非async，记录索引，最后一步设置
          if (data[key] === v[key]) {
            v.no_async = true
          }
          // 在id和parent_id数组中的数据设置为展开
          if (values.indexOf(v[key]) > -1) {
            v.is_expand_show = true
          }
          if (pvalues.indexOf(v[key]) > -1) {
            v.is_expand = true
          }
          return v
        })

        // 缓存分组展开数据，避免第二次添加的时候被还原
        temp.map(v => {
          if (data[key] === v[key]) {
            v.temp_expand = true
            v.temp_expand_show = true
          } else {
            v.temp_expand = _.isBoolean(v.temp_expand) ? v.temp_expand : v.is_expand
            v.temp_expand_show = _.isBoolean(v.temp_expand_show) ? v.temp_expand_show : v.is_expand_show
          }
        })
        // 还原上一次的分组展开情况
        temp.map(v => {
          v.is_expand = _.isBoolean(v.temp_expand) ? v.temp_expand : v.is_expand
          v.is_expand_show = _.isBoolean(v.temp_expand_show) ? v.temp_expand_show : v.is_expand_show
        })
        this.cdatas = temp
        // let newSource = getGroupExpendData(this.cdatas)
        // this.sourceData = newSource
        this.sourceData = this.getSourceDatas()
      }
      this.groupAsync(data, callback)
    }
  }
}
</script>
<style>
</style>
