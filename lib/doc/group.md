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
// import { riverData } from './data'
export default {
  data () {
    return {
      data: riverData,
      config: {
        group: {
          groupCustomName: '{0}({1})',
          groupingView: [
            {
              field: 'county_name',
              emptyValue: '其他'
            },
            {
              field: 'town_name',
              emptyValue: '乡镇级',
              currentLevel: {
                orignName: 'area_name',
                compareName: 'county_name',
                replaceName: '本级'
              }
            },
            {
              field: 'village_name',
              emptyValue: '村级',
              currentLevel: {
                orignName: 'area_name',
                compareName: 'town_name',
                replaceName: '本级'
              }
            }
          ],
          groupKeyCopyToParent: ['county_code', 'town_code', 'village_code'],
          groupDataSort: {
            data: [
              {
                name: 'county_code',
                order: 'asc'
              },
              {
                name: 'town_code',
                order: 'asc'
              },
              {
                name: 'village_code',
                order: 'asc'
              }
            ]
          }
        },
        colModels: [
          {
            name: 'id',
            text: '河流编码',
            width: 150
          },
          {
            name: 'name',
            text: '河流名称',
            width: 150
          },
          {
            name: 'begin_position',
            text: '起点',
            width: 120
          },
          {
            name: 'end_position',
            text: '终点',
            width: 200
          },
          {
            name: 'manager',
            text: '河长',
            width: 120
          },
          {
            name: 'title',
            text: '职务',
            width: 120
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
