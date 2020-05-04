```html vue-run
<template>
  <div class="example-table">
    <ss-table-group :datas="data" :config="config" :loading="loading"></ss-table-group>
  </div>
</template>

<script>
// import Vue from 'vue'
// import SsTable from '@idev1/ss-table'
// Vue.use(SsTable)
// import { parentData } from '../doc-example/data'

let config = [
  {
    label: '按地区',
    colModels: [
      {
        name: 'unit_name',
        text: '单位名称'
      },
      {
        name: 'name',
        text: '姓名'
      },
      {
        name: 'duty',
        text: '职务'
      },
      {
        name: 'areaname',
        text: '所在地区'
      }
    ],
    group: {
      isUseParent: true,
      isShowColumns: true,
      groupCustomName: '{0}({1})'
    }
  }
]

export default {
  data () {
    return {
      data: [],
      config: {},
      loading: true
    }
  },
  created () {
    setTimeout(() => {
      this.data = parentData
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

```