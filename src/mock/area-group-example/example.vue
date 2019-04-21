<template>
  <div class="hello">
    <div class="switch">
      <el-button type="success" @click="changeData">改变数据长度</el-button>
    </div>
    <div class="table">
      <ss-table
        :type="type"
        :datas="data"
        :config="config"
        :callbacks="callbacks"
        :loading="loading">
        <div class="ss-total-express" slot="frontSearch">这是一段统计性的文字</div>
      </ss-table>
    </div>
  </div>
</template>

<script>
import SsTable from '@/components/ss-table-group'
import SsSimpleTable from '@/components/ss-simple-table'
import data from './config'
import riverData from './data'

export default {
  name: 'test',
  data () {
    return {
      data: [],
      config: {},
      callbacks: {},
      type: 'custom',
      loading: true
    }
  },
  components: {
    SsTable, SsSimpleTable
  },
  created () {
    setTimeout(() => {
      this.data = riverData.data
      this.config = data.groupConfig

      this.loading = false
    }, 1000)

    this.callbacks.cellClick = this.handleCellClick
  },
  methods: {
    buttonClick (type) {
      this.type = type
    },
    handleCellClick (data, rowindex, colindex) {
      console.log(data)
      console.log(rowindex)
      console.log(colindex)
    },
    changeData () {
      this.data = data.data.slice(0, data.data.length - 10)
    }
  }
}
</script>
<style>
.hello {
  width: 100%;
  height: 100%;
}
.switch{
  margin: 20px 0px 20px 20px;
}

.table {
  width: 400px;
  height: 650px;
  border-bottom: 1px solid red;
  float: left;
  margin-left: 20px;
}
</style>
