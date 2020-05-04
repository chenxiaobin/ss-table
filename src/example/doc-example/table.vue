<template>
  <div class="main">
    <div class="tree">
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
            <span :class="data.filePath ? 'dui' :'cuo'"></span>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="config">
      <div class="config_run" @click="handleCodeChange">运行</div>
      <div class="config_code">
        <codemirror ref="myCm2"
                v-model="code"
                :options="cmOptions">
        </codemirror>
      </div>
    </div>
    <div class="demo">
      <markdown-run v-if="isLoad" :scope="scope" :mark="code" highlight-style-file-name="github"/>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vue/vue'
import 'codemirror/theme/lesser-dark.css'

import SsTable from '../../../index'

import { waterData, riverData, simpleDatas, parentData, parentData1 } from './data'
import { allApi } from './config'

import { Tree } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MarkdownRun from 'vue-markdown-run'
Vue.use(SsTable)
Vue.use(Tree)
Vue.use(MarkdownRun)

export default {
  data () {
    return {
      isLoad: true,
      apis: JSON.parse(JSON.stringify(allApi.data)),
      code: '',
      cmOptions: {
        tabSize: 2,
        lineWrapping: true,
        mode: 'text/x-vue',
        theme: 'lesser-dark',
        lineNumbers: true,
        line: true
      },
      type: 'default',
      scope: {
        waterData, riverData, simpleDatas, parentData, parentData1
      }
    }
  },
  components: {
    codemirror
  },
  mounted () {
    this.$refs.TreeApis.setCurrentKey('基本功能')
    this.handleTreeClick(this.$refs.TreeApis.getCurrentNode(), this.$refs.TreeApis.getNode('基本功能'))
  },
  methods: {
    handleTreeClick (data, node) {
      if (!node.isLeaf || !data.filePath) {
        return null
      }
      axios.get(data.filePath).then((result) => {
        this.isLoad = false
        this.$nextTick(() => {
          this.isLoad = true
          this.$set(this, 'code', result.data)
        })
      })
    },
    handleCodeChange () {
      this.isLoad = false
      this.$nextTick(() => {
        this.isLoad = true
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
  overflow: auto;
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
.config .config_code{
  height: calc(100% - 25px);
}

.config .config_run{
  height: 25px;
  line-height: 25px;
  text-align: right;
  cursor: pointer;
  text-decoration: underline;
  color: white;
  font-size: 13px;
  padding-right: 10px;
  background: #262626;
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

.demo>div{
  width: 100%;
  height: 100%;
}
.demo .markdown-common{
  display: none;
}
.demo .vue-markdown-run{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
