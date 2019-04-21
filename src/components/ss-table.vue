<template>
  <div class="ss-config-table" ref="SSConfigTable">
    <div class="ss-config-table-extend" ref="SSConfigExtend">
      <slot name="frontSearch"></slot>
      <div class="ss-config-table-search" v-if="searchItems && searchItems.length > 0">
        <el-input :placeholder="searchMode === 1 ? `请输入${lodash.map(searchItems, 'name').join('、')}进行搜索` : '请输入搜索内容'" v-model="searchInput" size="small"  class="ss-config-table-search-select">
          <template v-if="searchMode === 2">
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
      <template v-if="tableType == 'custom'">
        <ss-custom-table
          :id="id"
          :data="useDatas"
          :col-models="colModels"
          :border-show="borderShow"
          :show-summary="showSummary"
          :summary-cols="summaryCols"
          :summary-text="summaryText"
          :left-frozen="leftFrozen"
          :pagination="pagination"
          :data-type="dataType"
          :flat-data-load-type="flatDataLoadType"
          :maxHeight="maxHeight"
          :group="group"
          :loading="loading"
          :dataValueAsClass="dataValueAsClass"
          @cell-click="handleCellClick"
          @row-mouseenter="handleRowMouseenter"
          @row-mouseleave="handleRowMouseleave"></ss-custom-table>
      </template>

      <template v-else-if="tableType == 'element'">
        <ss-element-table
          :id="id"
          :data="useDatas"
          :col-models="colModels"
          :border-show="borderShow"
          :show-summary="showSummary"
          :summary-cols="summaryCols"
          :summary-text="summaryText"
          :left-frozen="leftFrozen"
          :pagination="pagination"
          :data-type="dataType"
          :flat-data-load-type="flatDataLoadType"
          :maxHeight="maxHeight"
          :group="group"
          @cell-click="handleCellClick"></ss-element-table>
      </template>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { DataTreeHandles } from '@idev1/ss-handle'
import Velocity from 'velocity-animate'

import SsCustomTable from './ss-custom-table'
import SsElementTable from './ss-element-table'

import Vue from 'vue'
import {Input, Select, Option, Button, Pagination, Tooltip} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Tooltip)

export default {
  name: 'ss-table',
  props: {
    height: Number,
    config: {
      type: Object,
      default () {
        return {}
      }
    },
    type: String,
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
    }
  },
  components: {
    SsCustomTable,
    SsElementTable
  },
  computed: {
    id () {
      return this.config.id || this.initGuid()
    },
    tableType () {
      return this.type || (this.config.type || 'custom')
    },
    colModels () {
      return this.config.colModels || []
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
    handleCellClick () {
      return typeof this.callbacks.cellClick === 'function' ? this.callbacks.cellClick : () => {}
    },

    handleRowMouseenter () {
      return typeof this.callbacks.rowMouseenter === 'function' ? this.callbacks.rowMouseenter : () => {}
    },

    handleRowMouseleave () {
      return typeof this.callbacks.rowMouseleave === 'function' ? this.callbacks.rowMouseleave : () => {}
    },

    /** 根据配置默认处理的值 */
    dataType () {
      let {group} = this.config
      return JSON.stringify(group) !== '{}' && group ? 'group' : 'flat'
    },
    flatDataLoadType () {
      return !this.config.group ? (this.config.pagination ? 'pagination' : 'scroll') : null
    }
  },
  data () {
    return {
      maxHeight: null,
      searchInput: '',
      searchValue: '',
      useDatas: [],
      searchMode: 1,
      lodash: _
    }
  },
  watch: {
    datas () {
      this.useDatas = this.getUseData()
    },
    searchValue () {
      this.searchInput = ''
    },
    searchInput () {
      if (this.searchInput === '' || (this.searchMode === 2 && this.searchValue === '')) {
        this.useDatas = this.datas
      } else if (this.searchMode === 1) {
        this.useDatas = this.datas.filter((v) => {
          let isMath = null
          _.each(this.searchItems, (d) => {
            let isResult = d.field && v[d.field].indexOf(this.searchInput) > -1
            isMath = isMath === null ? isResult : isMath || isResult
          })
          return isMath
        })
      } else {
        this.useDatas = this.datas.filter((v) => {
          return v[this.searchValue] && v[this.searchValue].indexOf(this.searchInput) > -1
        })
      }

      if (this.dataType === 'group') {
        this.useDatas = new DataTreeHandles(this.useDatas, this.group).buildTree()
      }
    },
    height () {
      this.calcMaxHeight()
    },
    dataType () {
      this.useDatas = this.getUseData()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.calcMaxHeight()
    })
    this.useDatas = this.getUseData()
  },
  methods: {
    getUseData () {
      let datas = this.datas
      if (this.dataType === 'group') {
        datas = new DataTreeHandles(datas, this.group).buildTree()
      }
      return datas
    },
    calcMaxHeight () {
      this.$nextTick(() => {
        this.maxHeight = (this.height || this.$refs.SSConfigTable.offsetHeight) - this.$refs.SSConfigExtend.offsetHeight - 1
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
      let elementDom = e.currentTarget.querySelector('.el-table__body-wrapper table')
      let width = this.tableType === 'custom' ? (customDom ? customDom.offsetWidth + 10 : 0) : (elementDom ? elementDom.offsetWidth + 10 : 0)
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
    initGuid () {
      return 'domxxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0
        let v = (c === 'x' ? r : (r & 0x3 | 0x8))
        return v.toString(16)
      })
    }
  }
}
</script>
<style>
@import '../../public/public/icon/iconfont.css';
@import '../../public/theme/default/style.css';
@import '../../public/theme/blue/style.css';
</style>
