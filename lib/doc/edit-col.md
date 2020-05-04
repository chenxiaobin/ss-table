````html vue-run
<template>
  <div class="example-table">
    <!-- 通过editable开启全表编辑模式, 添加了扩展列变成整行编辑模式 -->
    <!-- 编辑模式 :primary-key 必传 -->
    <ss-table :datas="data" :config="config" :editable="true" primary-key="id"></ss-table>
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
        colModels: [
          {
            name: 'ex_operate',  //添加扩展列，用来编辑操作
            text: '操作',
            width: 140,
            extend: true
          },
          {
            name: 'id',
            text: '测站编码',
            width: 150,
            editable: false  //可编辑关闭
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
            width: 200,
            editable: false  //可编辑关闭
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
