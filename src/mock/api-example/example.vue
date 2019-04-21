<template>
  <div class="hello">
    <div class="switch">
      <el-button :type="type == 'custom' ? 'primary' : ''" @click="buttonClick('custom')">显示自定义的表格</el-button>
      <el-button :type="type == 'element' ? 'primary' : ''" @click="buttonClick('element')">显示element表格</el-button>
      <el-button type="success" @click="changeData">改变数据长度</el-button>
    </div>
    <div class="api" v-if="type == 'simple' ? false : true">
      <el-table :data="apis" style="width: 100%" border :max-height="600">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="name" label="功能" width="200"></el-table-column>
        <el-table-column align="center" prop="type" label="分类" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.type === '分组/树形' ? 'success' : (scope.row.type === '树形' ? 'info': (scope.row.type === '扁平' ? 'danger':'primary'))" disable-transitions>{{scope.row.type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ccheck" label="开发Custom表格">
          <template slot-scope="scope">
            <div :class="scope.row.ccheck == true ? 'dui' :'cuo'"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ctest" label="测试情况" width="90">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.ctestcontent" placement="bottom" effect="light">
              <div :class="scope.row.ctest == true ? 'bug' :''"></div>
            </el-tooltip>

          </template>
        </el-table-column>
        <el-table-column align="center" prop="echeck" label="集成Element表格">
          <template slot-scope="scope">
            <div :class="scope.row.echeck == true ? 'dui' :'cuo'"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="etest" label="测试情况" width="90">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.etestcontent" placement="bottom" effect="light">
              <div :class="scope.row.etest == true ? 'bug' :''"></div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table">
      <ss-table
        v-if="type !== 'simple'"
        :type="type"
        :datas="data"
        :config="config"
        :callbacks="callbacks"
        :loading="loading">
        <div class="ss-total-express" slot="frontSearch">这是一段统计性的文字</div>
      </ss-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {Table, TableColumn, Tooltip, Tag} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import SsTable from '@/components/ss-table'
import data from './mock'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Tag)
let apis = [
  {
    index: 1,
    name: '自定义配置列',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 2,
    name: '表头固定',
    type: '通用',
    ccheck: true,
    echeck: true,
    etest: true,
    etestcontent: '复杂表头固定列判断有问题'
  },
  {
    index: 3,
    name: '固定列',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 4,
    name: '表头点击排序',
    type: '扁平',
    ccheck: true,
    echeck: true
  },
  {
    index: 5,
    name: '单元格点击事件',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 6,
    name: '合计行统计',
    type: '通用',
    ccheck: true,
    echeck: true,
    etest: true,
    etestcontent: '复杂表头统计失效'
  },
  {
    index: 7,
    name: '扩展序号列',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 8,
    name: '扩展复选框列',
    type: '扁平',
    ccheck: false,
    echeck: false
  },
  {
    index: 9,
    name: '单元格数据格式化(小数位、有效数、时间)',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 10,
    name: '表格内部搜索',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 11,
    name: '复杂表头',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 12,
    name: '分组树形展示',
    type: '分组/树形',
    ccheck: true,
    echeck: false,
    ctest: true,
    ctestcontent: '搜索的时候怎么处理显示问题'
  },
  {
    index: 14,
    name: '扁平化滚动加载',
    type: '扁平',
    ccheck: true,
    echeck: true
  },
  {
    index: 15,
    name: '扁平化分页加载',
    type: '扁平',
    ccheck: true,
    echeck: true
  },
  {
    index: 16,
    name: '不同数据行自定义颜色',
    type: '通用',
    ccheck: false,
    echeck: false
  },
  {
    index: 17,
    name: '是否显示表格单元格竖线',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 18,
    name: '对外提供插槽用于自定义显示内容',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 19,
    name: '悬停表格面板弹开',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 20,
    name: '悬停行能变色',
    type: '通用',
    ccheck: true,
    echeck: true
  },
  {
    index: 21,
    name: '数据加载时，有加载中的效果',
    type: '通用',
    ccheck: true,
    echeck: false
  },
  {
    index: 22,
    name: '单元格悬停提示',
    type: '通用',
    ccheck: true,
    echeck: false
  },
  {
    index: 23,
    name: '隔行变色',
    type: '通用',
    ccheck: true,
    echeck: true
  }
]
export default {
  name: 'test',
  data () {
    return {
      data: [],
      config: {},
      callbacks: {},
      type: 'custom',
      apis: apis,
      loading: true
    }
  },
  components: {
    SsTable
  },
  created () {
    setTimeout(() => {
      this.data = data.data
      this.config = data.config
      this.loading = false
    }, 1000)

    this.callbacks.cellClick = this.handleCellClick
  },
  methods: {
    buttonClick (type) {
      this.type = type
    },
    handleCellClick (data, rowindex, colindex) {
      console.log(data)
      console.log(rowindex)
      console.log(colindex)
    },
    changeData () {
      this.data = data.data.slice(0, data.data.length - 10)
    }
  }
}
</script>
<style>
.hello {
  width: 100%;
  height: 100%;
}
.switch{
  margin: 20px 0px 20px 20px;
}
.api {
  width: 800px;
  height: 100%;
  float: left;
  margin-left: 20px;
}
.table {
  width: 400px;
  height: 650px;
  border-bottom: 1px solid red;
  float: left;
  margin-left: 20px;
}
.api .el-table--border th{
  background: #f5f7fa;
  color: #606266;
}
.api .bug,
.api .dui,
.api .cuo{
  width: 16px;
  height: 16px;
  margin: auto;
}
.api .bug{
  background: url('~public/public/bug.png');
  background-size: 100% 100%;
}
.api .dui{
  background: url('~public/public/gou.png');
  background-size: 100% 100%;
}
.api .cuo{
  background: url('~public/public/cha.png');
  background-size: 100% 100%;
}
.ss-total-express{
  margin: 5px 0;
  font-size: 13px;
}
</style>
