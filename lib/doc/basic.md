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
        // 1. 数据列配置
        colModels: [
          {
            name: 'id', // 2. 数据中的属性名
            text: '测站编码', // 3. 列名称
            width: 150 // 4. 列宽, 不配置列宽自动等分计算
          },
          {
            name: 'name',
            text: '测站名称',
            width: 150
          },
          {
            name: 'val',
            text: '水位<br/>(m)',  // 单位的两种方式1
            width: 120
          },
          {
            name: 'out_val',
            text: '流量',
            unit: '(m³/s)', // 单位的两种方式2
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
