<template>
  <div class="ss-simple-table">
    <table v-for="(ditem, dkey) in data" :key="dkey+'A'">
      <tbody>
        <tr v-for="(titem, tkey) in splitColModels" :key="tkey+'B'">
          <template v-for="(item, key) in titem.tdDatas">
            <td :key="key+'C'" class="ss-column-name">{{item.name}}</td>
            <td :colspan="item.colspan" :key="key+'D'">{{formatData(item, ditem)}}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'ss-simple-table',
  data () {
    return {

    }
  },
  props: {
    config: Object,
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    columns () {
      return (this.config && this.config.columns) || 1
    },
    colModles () {
      return this.config && this.config.colModles
    },
    splitColModels () {
      let indexs = 0
      let defIndex = 1
      let _columnDataArray = [] // 列数组
      let _lineDataArray = [] // 行数组
      let cellLen = this.columns * 2
      let _tempDataLen = this.colModles.length

      _.each(this.colModles, function (v, key) {
        v.colspan = v.colspan ? v.colspan : 1
        let currCol = defIndex + v.colspan // 一组数据占的列数
        indexs += currCol

        if (indexs <= cellLen) {
          _lineDataArray.push(v)
          // 判断最后一个
          if (key === _tempDataLen - 1) {
            if (indexs < cellLen) {
              // 判断最后一个的列数不等于总列数，进行补充列数处理
              let colspans = 0
              _.each(_lineDataArray, function (v) {
                let colspan = (v.colspan || 1) + 1
                colspans += colspan
              })
              if (colspans < cellLen) {
                _lineDataArray.push({
                  colspan: cellLen - colspans
                })
              }
              _columnDataArray.push({
                tdDatas: _lineDataArray
              })
              _lineDataArray = []
              indexs = 0
            }
          }

          // 如果列数等于要求的列数则插入到_columnDataArray数组中
          if (indexs === cellLen) {
            _columnDataArray.push({
              tdDatas: _lineDataArray
            })
            _lineDataArray = []
            indexs = 0
          }
        } else {
          console.warn(`[${v.name}-${v.field}]字段colspan长度超出实际规定列数,所以不会显示!`)
        }
      })
      return _columnDataArray
    }
  },
  created () {
  },
  methods: {
    formatData (item, data) {
      let value = data[item.field]
      if (value && typeof value === 'number' && item.fixed) {
        value = value.toFixed(item.fixed)
      }
      if (value && item.format) {
        value = moment(value).format(item.format)
      }
      if ((value || value === 0) && item.unit) {
        value += ` ${item.unit}`
      }
      return value
    }
  }
}
</script>
<style>

/*
 * ss-simple-table 样式
 */
.ss-simple-table table {
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;
  table-layout: fixed;
  width: 100%;
}
.ss-simple-table table td{
  padding: 8px 6px;
  text-align: center;
}
/*
 * ss-simple-table 灰色样式
 */
.ss-simple-table table td{
  border: 1px solid #E6E6E6;
}
.ss-simple-table .ss-column-name{
  background: #F5F5F5;
  color: #636363;
}
</style>
