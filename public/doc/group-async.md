```html vue-run
<template>
  <div class="example-table">
    <ss-table-group :datas="data" :config="config" :loading="loading" :callbacks="callbacks"></ss-table-group>
  </div>
</template>

<script>

// import { parentData1, parentData } from './data'
// import Vue from 'vue'
// import SsTable from '../../index'

// Vue.use(SsTable)

let config = [
  {
    label: '按地区',
    colModels: [
      {
        name: 'unit_name',
        text: '单位名称'
      },
      {
        name: 'sortid',
        text: '排行',
        sortable: true
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
      async: true,
      isUseParent: true,
      isShowColumns: false,
      groupCustomName: '{0}({1})',
      groupDataSort: {
        data: [{
          name: 'sortid',
          order: 'desc'
        }]
      }
    }
  }
]

export default {
  data () {
    return {
      data: [],
      config: {},
      callbacks: {
        groupAsync: (data, callback) => {
          setTimeout(() => {
            let result = parentData.filter((v) => {
              return data.id === v.parent_id
            })
            callback(result)
          }, 1500)
        }
      },
      loading: true
    }
  },
  components: {
  },
  created () {
    setTimeout(() => {
      this.data = parentData1
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