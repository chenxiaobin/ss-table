````html vue-run
<template>
  <div class="example-table">
    <ss-table :datas="data" :config="config"></ss-table>
  </div>
</template>
<script>
// SsTable、waterData示例代码外部传入了
// import Vue from 'vue'
// import SsTable from '@idev1/ss-table'
// Vue.use(SsTable)
// import { waterData } from './data'
export default {
  data () {
    return {
      data: waterData,
      config: {
        // 固定列配置
        frozen: {
          leftColNums: 2
        },
        colModels: [
          {
            name: 'id',
            text: '测站编码',
            width: 150
          },
          {
            name: 'name',
            text: '测站名称',
            width: 150
          },
          {
            name: 'val',
            text: '水位<br/>(m)',
            width: 120
          },
          {
            name: 'time',
            text: '时间',
            width: 200
          },
          {
            name: 'ensure_val',
            text: '保证水位<br/>(m)',
            width: 120
          },
          {
            name: 'out_val',
            text: '流量<br/>(m³/s)',
            width: 120
          },
          {
            name: 'water_potential',
            text: '水势',
            width: 120
          },
          {
            name: 'address',
            text: '所在地址',
            align: 'left',
            width: 200
          }
        ]
      }
    }
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
