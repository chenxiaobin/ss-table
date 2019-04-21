import _ from 'lodash'
let Utils = {
  /**
   * 配置节点
   * @param  {[type]}  config [配置]
   * @return {Boolean}        [是否存在该配置]
   */
  hasConfig: (config) => {
    let _configExist = config && !_.isEmpty(config)

    let _dataExist = config && config.data && !_.isEmpty(config.data)

    let _groupSortExist = config && config.group_sort && !_.isEmpty(config.group_sort)

    return _configExist && (_dataExist || _groupSortExist)
  },
  /**
   * 是否是扁平化结构
   * @param  {[type]}  type [数据结构类型]
   * @return {Boolean}      [description]
   */
  isFlatStructure: (type) => {
    if (type === 'flat') {
      return true
    }

    return false
  },

  /**
   * 分组后扁平化输出，排序无法对字符串排序，可以用分组的方法排序
   * @param  {[type]} data [description]
   * @param  {[type]} attr [description]
   * @return {[type]}      [description]
   */
  groupAndFlatData: (data, attr) => {
    let _result = []

    let _groupData = _.groupBy(data, function (v) {
      return v[attr]
    })

    for (let prop in _groupData) {
      _result.push(_groupData[prop])
    }

    return _.flatten(_result)
  }
}
export default Utils
