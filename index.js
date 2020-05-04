import SsTable from './src/views/table'
import SsTableGroup from './src/views/table-group'
import SsSimpleTable from './src/views/table-simple'

const sstable = {
  SsTable,
  SsTableGroup,
  SsSimpleTable
}

const install = function (Vue = {}) {
  Object.keys(sstable).forEach(key => {
    Vue.component(key, sstable[key])
  })
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export { sstable }
export default (sstable, { install })
