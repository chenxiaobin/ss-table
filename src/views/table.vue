<template>
  <div class="ss-config-table" ref="SSConfigTable">
    <div class="ss-config-table-extend" ref="SSConfigExtend">
      <slot name="frontSearch"></slot>
      <div class="ss-config-table-search" v-if="searchItems && searchItems.length > 0">
        <el-input :placeholder="searchMode === 'default' ? `请输入${lodash.map(searchItems, 'name').join('、')}进行搜索` : '请输入搜索内容'" v-model="searchInput" size="small"  class="ss-config-table-search-select">
          <template v-if="searchMode === 'select'">
            <el-select v-model="searchValue" slot="prepend" placeholder="请选择">
              <el-option v-for="(item, key) in searchItems" :key="key" :label="item.name" :value="item.field"></el-option>
            </el-select>
          </template>
        </el-input>
      </div>
      <slot name="afterSearch"></slot>
    </div>
    <div class="ss-config-table-container" ref="SSConfigContainer"
         :style="{height: [maxHeight + 'px']}"
         @mouseenter="handleTableMouseenter($event)"
         @mouseleave="handleTableMouseleave($event)">
      <table-core
        v-if="colModels.length"
        ref="RefCustomTable"
        :data="useDatas"
        :max-height="maxHeight"
        :col-models="colModels"
        :loading="loading"
        :data-type="dataType"
        :group="group"
        :thead-style="theadStyle"
        :pagination="pagination"
        :groupAsync="onGroupAsync"
        @cell-click="onCellClick"
        @row-mouseenter="onRowMouseenter"
        @row-mouseleave="onRowMouseleave"></table-core>
    </div>
    <div class="ss-config-table-operate" ref="SSConfigOperate">
      <!-- <div @click="handleExportExcel">导出excel</div> -->
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import Velocity from 'velocity-animate'

import xlsx from '../utils/xlsx'
import { guid } from '../utils/utils'
import { getRawData, getSearchData, getSearchItemData } from '../utils/data'
import TableCore from './table-core'

import Vue from 'vue'
import {Input, Select, Option, Button, Pagination} from 'element-ui'

Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Pagination)

export default {
  name: 'ss-table',
  provide () {
    return {
      root: this
    }
  },
  props: {
    width: Number,
    height: Number,
    config: {
      type: Object,
      default () {
        return {}
      }
    },
    datas: {
      type: Array,
      default () {
        return []
      }
    },
    callbacks: {
      type: Object,
      default () {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    searchMode: {
      type: String,
      default: 'default'
    },
    headVisible: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    primaryKey: String
  },
  components: {
    TableCore
  },
  computed: {
    id () {
      return this.config.id || guid()
    },
    borderShow () {
      return this.config.borderShow || false
    },
    showSummary () {
      return !!(this.config.summaryCols && this.config.summaryCols.length > 0)
    },
    summaryText () {
      return this.config.summaryText || '合计'
    },
    summaryCols () {
      return this.config.summaryCols && this.config.summaryCols.length > 0 ? this.config.summaryCols.join(',') : ''
    },
    leftFrozen () {
      return this.config.frozen && this.config.frozen.leftColNums
    },
    rightFrozen () {
      return this.config.frozen && this.config.frozen.rightColNums
    },
    pagination () {
      return this.config.pagination || {}
    },
    group () {
      return this.config.group
    },
    dataValueAsClass () {
      return this.config.dataValueAsClass || []
    },
    /** 本页面使用的内容 */
    searchItems () {
      this.calcMaxHeight()
      return this.config.searchItems
    },
    /** 函数配置 */
    onCellClick () {
      return typeof this.callbacks.cellClick === 'function' ? this.callbacks.cellClick : () => {}
    },

    onRowMouseenter () {
      return typeof this.callbacks.rowMouseenter === 'function' ? this.callbacks.rowMouseenter : () => {}
    },

    onRowMouseleave () {
      return typeof this.callbacks.rowMouseleave === 'function' ? this.callbacks.rowMouseleave : () => {}
    },

    onGroupAsync () {
      return typeof this.callbacks.groupAsync === 'function' ? this.callbacks.groupAsync : () => {}
    },

    /** 根据配置默认处理的值 */
    dataType () {
      let { group } = this.config
      return JSON.stringify(group) !== '{}' && group ? 'group' : 'flat'
    },
    flatDataLoadType () {
      return !this.config.group ? (this.config.pagination ? 'pagination' : 'scroll') : null
    },
    /** 根据editable配置情况以及ex_operate判断编辑模式 */
    editMode () {
      let isExist = this.colModels.find((v) => {
        return v.name === 'ex_operate'
      })
      return isExist ? 'rowedit' : 'celledit'
    },
    theadStyle () {
      return this.config && this.config.theadStyle
    }
  },
  data () {
    return {
      maxHeight: null,
      searchInput: '',
      searchValue: '',
      useDatas: [],
      lodash: _,
      colModels: []
    }
  },
  watch: {
    datas () {
      this.useDatas = this.getUseData()
      this.searchFilterData()
    },
    searchValue () {
      this.searchInput = ''
    },
    searchInput () {
      this.searchFilterData()
    },
    height () {
      this.calcMaxHeight()
    },
    dataType () {
      this.useDatas = this.getUseData()
    },
    'config.colModels': {
      deep: true,
      handler () {
        this.colModels = this.getColumns()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.colModels = this.getColumns()
      this.calcMaxHeight()
    })
    this.useDatas = this.getUseData()
  },
  methods: {
    getColumns () {
      let cMdoels = this.config.colModels || []
      let isExistNoWidth = 0
      let plusWidth = 0
      cMdoels.map((v) => {
        if (v.items) {
          v.items.map(d => {
            d.width ? (plusWidth += (d.width || 100)) : (isExistNoWidth++)
          })
        } else {
          v.width ? (plusWidth += v.width) : (isExistNoWidth++)
        }
      })

      if (!isExistNoWidth) {
        return cMdoels
      }

      let totalWidth = (this.$el && this.$el.offsetWidth) || (this.$parent && this.$parent.$el && this.$parent.$el.offsetWidth) || this.width
      cMdoels.map((v) => {
        if (!v.width && !v.items) {
          v.width = (totalWidth - plusWidth) / isExistNoWidth
        }
        if (v.items) {
          v.items.map(d => {
            d.width = (totalWidth - plusWidth) / isExistNoWidth
          })
        }
      })
      return cMdoels
    },
    getUseData () {
      return getRawData(this.datas)
    },
    calcMaxHeight () {
      this.$nextTick(() => {
        if (!this.$refs.SSConfigTable || !this.$refs.SSConfigExtend || !this.$refs.SSConfigOperate) {
          return
        }
        this.maxHeight = (this.height || this.$refs.SSConfigTable.offsetHeight) -
              this.$refs.SSConfigExtend.offsetHeight -
              this.$refs.SSConfigOperate.offsetHeight -
              1
      })
    },
    handleTableMouseenter (e) {
      if (!this.config.toggle) {
        return
      }
      // 同时绑定mouseenter、mouseleave、click，chrome特性会不定触发
      if (!e.relatedTarget) {
        return
      }
      Velocity(e.currentTarget, 'stop')
      let customDom = e.currentTarget.querySelector('.ss-table-tbody table')
      let width = customDom ? customDom.offsetWidth + 10 : 0
      if (width) {
        let marginLeft = e.currentTarget.parentNode.offsetWidth - width
        let style = this.config.toggle === 'right' ? {width} : {width, marginLeft}
        e.currentTarget.classList.add('ss-table-toggle')
        this.playAnimate(e.currentTarget, style)
      }
    },
    handleTableMouseleave (e) {
      if (!this.config.toggle) {
        return
      }
      // 同时绑定mouseenter、mouseleave、click，chrome特性会不定触发
      if (!e.relatedTarget) {
        return
      }
      let width = e.currentTarget.parentNode.offsetWidth
      let marginLeft = 0
      let style = this.config.toggle === 'right' ? {width} : {width, marginLeft}
      this.playAnimate(e.currentTarget, style)
      e.currentTarget.classList.remove('ss-table-toggle')
    },
    playAnimate (el, targetStyle, option) {
      Velocity(el, 'stop')
      Velocity(el, targetStyle, option || {
        duration: 1000,
        easing: [ 0.4, 0.01, 0.165, 0.99 ]
      })
    },
    searchFilterData () {
      let {
        searchInput: sinput,
        searchValue: svalue,
        searchMode: smode,
        searchItems: sitems
      } = this
      let data = this.getUseData()
      if (sinput === '' || (smode === 'select' && svalue === '')) {
        this.useDatas = data
      } else if (smode === 'default') {
        this.useDatas = getSearchItemData(data, sitems, sinput)
      } else {
        this.useDatas = getSearchData(data, svalue, sinput)
      }
    },
    handleExportExcel () {
      xlsx(this.getUseData())
    },
    getEditDatas () {
      if (this.$refs.RefCustomTable) {
        return this.$refs.RefCustomTable.tempEditData
      }
      return []
    }
  }
}
</script>
<style>
@import '../../public/public/icon/iconfont.css';
@import '../../public/theme/default/style.css';
@import '../../public/theme/blue/style.css';
/* @import '../../public/theme/gray/style.css'; */
</style>
