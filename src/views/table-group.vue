<template>
  <div class="ss-table-group" ref="SsTableGroup">
    <div class="ss-group-radio" v-if="cacheConfig.length > 1">
      <el-radio-group v-model="currentGroup">
        <el-radio :label="item.label" v-for="(item, key) in cacheConfig" :key="key">{{item.label}}</el-radio>
      </el-radio-group>
    </div>
    <div class="ss-group-table" :style="{height: [tableHeight + 'px']}">
      <ss-table :height="tableHeight"
                :callbacks="callbacks"
                :datas="datas"
                :loading="loading"
                :config="tableConfig"></ss-table>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import SsTable from './table'

import Vue from 'vue'
import { Radio, RadioGroup } from 'element-ui'

Vue.use(Radio)
Vue.use(RadioGroup)

export default {
  name: 'ss-table-group',
  props: {
    height: Number,
    config: [Array, Object],
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
    SsTable
  },
  data () {
    return {
      tableHeight: this.height,
      tableConfig: {},
      cacheConfig: [],
      currentGroup: null
    }
  },
  watch: {
    config: {
      deep: true,
      handler () {
        let height = 0
        if (!this.height) {
          height = this.$refs.SsTableGroup.offsetHeight
        }
        this.cacheConfig = _.isArray(this.config) ? this.config : [this.config]
        this.tableHeight = (this.height || height) - (this.cacheConfig.length > 1 ? 30 : 0)
        this.tableConfig = this.cacheConfig.filter((v) => {
          return v.default
        })[0] || this.cacheConfig[0]
        this.currentGroup = this.tableConfig.label
      }
    },
    currentGroup () {
      this.tableConfig = this.cacheConfig.filter((v) => {
        return v.label === this.currentGroup
      })[0]
      this.tableLoading = true
    }
  }
}
</script>
<style>
.ss-table-group{
  height: 100%;
  position: relative;
}
.ss-group-table{
  height: 100%;
}
.ss-group-radio{
  height:30px;
}
.ss-group-radio .el-radio-group{
  margin: 7px;
  float: left;
}
</style>
