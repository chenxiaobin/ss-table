<template>
  <div class="hello">
    <div class="ss-simple-table-example">
      <ss-simple-table :data="simpleData" :config="simpleConfig"></ss-simple-table>
    </div>
  </div>
</template>

<script>
import SsSimpleTable from '@/components/ss-simple-table'
import sData from './data'
import sConfig from './config'

export default {
  data () {
    return {
      simpleData: [],
      simpleConfig: {},
      loading: true
    }
  },
  components: {
    SsSimpleTable
  },
  created () {
    setTimeout(() => {
      this.simpleData = sData.simpleDatas
      this.simpleConfig = sConfig.simpleConfig
      this.loading = false
    }, 1000)
  },
  methods: {
  }
}
</script>
<style>
.hello {
  width: 100%;
  height: 100%;
}
.ss-simple-table-example{
  width: 400px;
  height: 300px;
}
</style>
