<template>
  <div class="main">
    <div class="tree">
      <div class="tree_buttons">
        <el-button type="danger">功能开发情况</el-button>
      </div>
      <el-tree class="tree_nodes"
        ref="TreeApis"
        :data="apis"
        node-key="label"
        default-expand-all
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="handleTreeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="node.isLeaf">
            <span :class="data.etest == true ? 'bug' :''"></span>
            <span :class="data.ccheck == true ? 'dui' :'cuo'"></span>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="config">
      <div class="config_vue">
        <codemirror ref="myCm1"
                :value="type == 'default' ? vueTemplate : simpleTemplate"
                :options="vuOptions">
        </codemirror>
      </div>
      <div class="config_code">
        <codemirror ref="myCm2"
                :value="code"
                :options="cmOptions">
        </codemirror>
      </div>
      <div class="config_tips">
        <div v-html="tips"></div>
      </div>
    </div>
    <div class="demo" v-if="type == 'default'">
      <ss-table v-if="JSON.stringify(tableConfig) !== '{}'" :config="tableConfig" :datas="datas"></ss-table>
    </div>
    <div class="demo" v-if="type == 'simple'">
      <ss-simple-table :config="simpleConfig" :data="simpleDatas"></ss-simple-table>
    </div>
    <el-alert v-if="!datas.length" class="table-error" title="功能开发中，敬请期待~~~" type="error" show-icon></el-alert>
  </div>
</template>
<script>
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/vue/vue'
import 'codemirror/theme/eclipse.css'

import { SsTable, SsSimpleTable } from '../../../index'

import { waterData, riverData, simpleDatas } from './data'
import { allApi, allConfig } from './config'

import Vue from 'vue'
import { Tree, Button, Alert } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Tree)
Vue.use(Button)
Vue.use(Alert)

export default {
  data () {
    return {
      apis: JSON.parse(JSON.stringify(allApi.data)),
      code: '',
      cmOptions: {
        tabSize: 2,
        lineWrapping: true,
        mode: 'text/javascript',
        theme: 'eclipse',
        lineNumbers: true,
        line: true
      },
      vuOptions: {
        tabSize: 2,
        lineWrapping: true,
        mode: 'text/x-vue',
        theme: 'eclipse',
        lineNumbers: true,
        line: true
      },
      type: 'default',
      datas: [],
      tableConfig: {},
      simpleConfig: allConfig.simpleConfig,
      simpleDatas: simpleDatas,
      tips: '',
      vueTemplate: `<template>
  <ss-table :datas="data" :config="config"></ss-table>
<template>`,
      simpleTemplate: `<template>
  <ss-simple-table :datas="data" :config="config"></ss-simple-table>
<template>`
    }
  },
  components: {
    codemirror, SsTable, SsSimpleTable
  },
  watch: {
    tableConfig: {
      deep: true,
      handler (curVal, oldVal) {
        this.code = `let config = ${JSON.stringify(this.tableConfig, null, 2)}`
      }
    }
  },
  mounted () {
    this.$refs.TreeApis.setCurrentKey('基本功能')
    this.handleTreeClick(this.$refs.TreeApis.getCurrentNode(), this.$refs.TreeApis.getNode('基本功能'))
  },
  methods: {
    handleTreeClick (data, node) {
      if (!node.isLeaf) {
        return null
      }

      if (data.key === 'simple') {
        this.type = 'simple'
      } else {
        this.type = 'default'
      }

      this.tableConfig = {}
      this.tips = ''

      if (!data.ccheck || !data.config) {
        this.datas = []
        return
      }

      this.$nextTick(() => {
        let { config, mockData } = data
        let newTabaleConfig = {}
        _.each(config, (v) => {
          let { api, allConfigKey } = v
          newTabaleConfig[api] = allConfig[allConfigKey]
        })

        this.tableConfig = this.type === 'default' ? JSON.parse(JSON.stringify(newTabaleConfig)) : JSON.parse(JSON.stringify(this.simpleConfig))

        this.tips = data.tips

        if (!mockData) {
          this.datas = waterData
        } else if (mockData === 'river') {
          this.datas = riverData
        }
      })
    }
  }
}
</script>
<style>
.main{
  width: 100%;
  height: 100%;
}
.tree{
  width: 25%;
  height: 100%;
  float: left;
  background: #f7f9fd;
}

.tree .tree_buttons{
  height: 0px;
}
.tree .tree_nodes{
  height: calc(100% - 0px)
}

.tree .el-tree{
  background:  #f7f9fd;
}
.tree .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree .bug,
.tree .dui,
.tree .cuo{
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-top: 2px;
}
.tree .dui{
  background: url('~public/public/gou.png');
  background-size: 100% 100%;
}
.tree .cuo{
  background: url('~public/public/cha.png');
  background-size: 100% 100%;
}
.tree .bug{
  background: url('~public/public/bug.png');
  background-size: 100% 100%;
}

.tree .el-tree-node__content{
  height: 30px;
}
.tree .el-tree-node__content:hover {
  background-color: #dfedf3;
}
.tree .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
  background: #579CDD;
  color: #ffffff;
}
.config{
  width: calc(35% - 2px);
  height: 100%;
  float: left;
  border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
}
.config .vue-codemirror,
.config .CodeMirror{
  height: 100%;
  z-index: 0;
}
.config .config_tips{
  height: 10%;
}
.config .config_tips div{
  padding: 10px;
  font-size: 13px;
}
.config .config_vue{
  height: 10%;
}
.config .config_code{
  height: 80%;
}
.demo{
  width: 40%;
  height: 100%;
  float: left;
}
.table-error.el-alert--error{
  position: absolute;
  background-color: #fef0f0;
  color: red;
  z-index: 4;
  width: auto;
  top: 47%;
  left: 47%;
}

/*滚动条*/
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 12px;
  background: #9dc3e6;
  box-shadow: inset 0 0 6px #d1cfcf;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px #d1cfcf;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #579CDD;
}
</style>
