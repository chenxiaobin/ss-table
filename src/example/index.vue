<template>
  <div class="example-table">
    <button @click="getChangeData">获取修改数据</button>
    <ss-table ref="SsTable"
              :datas="data"
              :config="config"
              :head-visible="true"
              :editable="true"
              :height="500"
              primary-key="id"></ss-table>
  </div>
</template>
<script>
import Vue from 'vue'
import SsTable from '../../index'
import { waterData } from './data'

Vue.use(SsTable)
export default {
  components: {
  },
  data () {
    return {
      data: waterData,
      config: {
        borderShow: true,
        summaryCols: ['val', 'ensure_val'],
        summaryText: '统计',
        frozen: {
          leftColNums: 2
        },
        // 1. 数据列配置
        colModels: [
          {
            name: 'ex_rowid',
            text: '序号',
            width: 50,
            extend: true
          },
          {
            name: 'id', // 2. 数据中的属性名
            text: '测站编码', // 3. 列名称
            sortable: true,
            width: 150 // 4. 列宽, 不配置列宽自动等分计算
          },
          {
            name: 'name',
            text: '测站名称',
            width: 150
          },
          {
            text: '水情测站',
            items: [
              {
                name: 'val',
                text: '水位<br/>(m)',
                width: 120,
                format: {
                  type: 'fixed',
                  value: 2
                },
                display: (data, column, rowindex) => {
                  let val = data[column.name]
                  if (val > 2) {
                    val += '<span style="color: red; display:inline-block;"> ↑</span>'
                  } else {
                    val += '<span style="color: blue; display:inline-block;"> ↓</span>'
                  }
                  return val
                },
                limit: (newValue, oldValue, rowindex, data) => {
                  let result = newValue >= oldValue ? {
                    status: true,
                    limitTips: ''
                  } : {
                    status: false,
                    limitTips: '输入数值不能小于原始值!'
                  }
                  console.log(rowindex)
                  console.log(data)
                  return result
                }
              },
              {
                name: 'ensure_val',
                text: '保证水位<br/>(m)',
                width: 120
              }
            ]
          },
          {
            name: 'time',
            text: '时间',
            width: 200,
            tooltip: {},
            editable: false,
            format: {
              type: 'date',
              value: 'YYYY-MM-DD HH:mm'
            }
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
            width: 120
          },
          {
            name: 'ex_operate',
            text: '操作',
            width: 200,
            extend: true,
            permission (rowdata, rowkey) {
              return rowdata && rowdata.area_id === '331002'
            }
          }
        ],
        theadStyle (colIndex) {
          if (colIndex === 3) {
            return {
              background: 'red'
            }
          }
        }
      }
    }
  },
  methods: {
    getChangeData () {
      alert(JSON.stringify(this.$refs.SsTable.getEditDatas()))
    }
  }
}
</script>
<style>
.example-table{
  width: 900px;
  height: 100%;
}
*,:after,:before {
  box-sizing:border-box
}
</style>
