````html vue-run
<template>
  <div class="example-table">
    <ss-table-group
      :datas="data"
      :config="config"
      :loading="loading">
    </ss-table-group>
  </div>
</template>

<script>
// SsTable、riverData示例代码外部传入了
// import Vue from 'vue'
// import SsTable from '@idev1/ss-table'
// Vue.use(SsTable)
// import { riverData } from './data'
let config = [
  {
    label: '不分组',
    colModels: [
      {
        name: 'river_name',
        text: '河流名称',
        width: 80
      },
      {
        name: 'river_length',
        text: '河流长度<br/>(m)',
        width: 120
      },
      {
        name: 'manager',
        text: '河管员',
        width: 80
      },
      {
        name: 'title',
        text: '职务',
        width: 120
      },
      {
        name: 'telephone',
        text: '联系方式',
        align: 'left',
        width: 200
      },
      {
        name: 'begin_position',
        text: '河流起点',
        width: 120
      },
      {
        name: 'end_position',
        text: '河流终点',
        width: 120
      },
      {
        name: 'is_expand',
        text: '河流终点',
        width: 120
      }
    ]
  },
  {
    label: '按地区',
    toggle: 'right',
    colModels: [
      {
        name: 'river_name',
        text: '河流名称',
        width: 80
      },
      {
        name: 'river_length',
        text: '河流长度<br/>(m)',
        width: 120
      },
      {
        name: 'manager',
        text: '河管员',
        width: 80
      },
      {
        name: 'title',
        text: '职务',
        width: 120
      },
      {
        name: 'telephone',
        text: '联系方式',
        align: 'left',
        width: 200
      },
      {
        name: 'begin_position',
        text: '河流起点',
        width: 120
      },
      {
        name: 'end_position',
        text: '河流终点',
        width: 120
      },
      {
        name: 'is_expand',
        text: '河流终点',
        width: 120
      }
    ],
    group: {
      groupCustomName: '{0}({1})',
      groupTemplate: 'area',
      groupTemplateMinLevel: 'town'
    }
  }
]
export default {
  data () {
    return {
      data: [],
      config: [],
      loading: true
    }
  },
  created () {
    setTimeout(() => {
      this.data = riverData
      this.config = config
      this.loading = false
    }, 1000)
  }
}
</script>
<style>
.example-table{
  width: 100%;
  height: 100%;
}
</style>
````
