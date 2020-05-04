````html vue-run
<template>
  <div class="example-table">
    <ss-simple-table :data="data" :config="config" @ss-table-time="handleCellClick"></ss-simple-table>
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
      data: simpleDatas,  // 单个对象的数组
      config: {
        columns: 2,   // 分为两列显示，一列对应一组的键值对
        labelStyle: {},
        valueStyle: {},
        colModles: [
          {
            field: 'id',
            name: '测站编码'
          },
          {
            field: 'time',
            name: '时间',
            format: 'YYYY-MM-DD',
            cellClickEmit: 'ss-table-time'   // 单元格点击事件
          },
          {
            field: 'lng',
            name: '经度'
          },
          {
            field: 'lat',
            name: '纬度',
            fixed: 2
          },
          {
            field: 'type_name',
            name: '类型'
          },
          {
            field: 'area_name',
            name: '行政区划',
            linkMode: {
              showName: '点击链接',  // 不显示值，只显示固定文本
              // linkAttr: 'attr',
              linkFixed: 'https://fanyi.baidu.com'
            }
          },
          {
            field: 'city_name',
            name: '所在地市',
            linkMode: {
              linkFixed: 'https://fanyi.baidu.com'  // 绑定点击链接
            }
          },
          {
            field: 'water_potential',
            name: '水势',
            unit: '单位'
          },
          {
            field: 'address1',
            name: '地址',
            colspan: 3  // 地址占满三格
          }
        ]

      }
    }
  },
  methods: {
    handleCellClick (data) {
      alert(JSON.stringify(data))
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
