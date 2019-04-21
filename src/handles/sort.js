import _ from 'lodash'
import Utils from './utils'

/**
 * 数据排序-单对象属性排序
 * @param  {[type]} config [description]
 * @param  {[type]} data   [description]
 * @return {[type]}        [description]
 */
let _sortBySingleAttr = (config, index, data, groupFlag) => {
  let _sort = config.data[index]
  let _order = _sort.order

  // 指定排序顺序
  if (_.isArray(_order)) {
    data = _assignSortValue(_sort, data, groupFlag)
  } else if (_order.toLowerCase() === 'asc') {
    data = _sortAsc(_sort, data, groupFlag)
  } else if (_order.toLowerCase() === 'desc') {
    data = _sortDesc(_sort, data, groupFlag)
  }

  return data
}

/**
 * 数据排序-多对象属性排序
 * @param  {[type]} config [description]
 * @param  {[type]} data   [description]
 * @return {[type]}        [description]
 */
let _sortByMultiAttr = (config, data) => {
  data = _sortBySingleAttr(config, 0, data, true)

  let _result = []

  let _length = config.data.length

  function _multiSortArray (sortData, index) {
    for (let prop in sortData) {
      if (_length - index > 1) {
        let _second = _sortBySingleAttr(config, index, sortData[prop], true)

        _multiSortArray(_second, index + 1)
      } else {
        _result.push(_sortBySingleAttr(config, index, sortData[prop]))
      }
    }
  }

  _multiSortArray(data, 0)

  return _.flatten(_result)
}

/**
 * 数据排序-升序排序
 * 多值排序时候，第一次排序实际是分组
 * @param  {[type]} attr [description]
 * @param  {[type]} data [description]
 * @param  {[type]} groupFlag [是否需要返回分组的数据]
 * @return {[type]}      [description]
 */
let _sortAsc = (sort, data, groupFlag) => {
  let _result = []

  if (sort.type === 'string') {
    _result = Utils.groupAndFlatData(data, sort.name)
  } else {
    _result = _.sortBy(data, function (v) {
      return v[sort.name]
    })
  }

  // 是否分组输出
  if (!groupFlag) {
    return _result
  }

  return _.groupBy(_result, function (v) {
    return v[sort.name]
  })
}

/**
 * 数据排序-降序排序，当存在undefined值时无法降序排序，需进行过滤处理
 * @param  {[type]} attr [description]
 * @param  {[type]} data [description]
 * @param  {[type]} groupFlag [是否需要返回分组的数据]
 * @return {[type]}      [description]
 */
let _sortDesc = (sort, data, groupFlag) => {
  if (sort.type === 'string') {
    _sortAsc(sort, data, groupFlag)

    return
  }

  let _newData = []

  let attr = sort.name

  let _undefinedData = _.filter(data, function (v) {
    return _.isUndefined(v[attr]) || _.isNull(v[attr])
  })

  let _data = _.filter(data, function (v) {
    return !_.isUndefined(v[attr]) && !_.isNull(v[attr])
  })

  let _descData = _.sortBy(_data, function (v) {
    return -v[attr]
  })

  _newData.push(_descData, _undefinedData)

  if (!groupFlag) {
    return _.flatten(_newData)
  }

  return _.groupBy(_.flatten(_newData), function (v) {
    return v[attr]
  })
}

/**
 * 数据排序-指定排序的排序
 * @param  {[type]} sort [sort配置]
 * @param  {[type]} data  [description]
 * @return {[type]}       [一个根据排序值返回的分组，未出现的值分为other组中]
 */
let _assignSortValue = (sort, data, groupFlag) => {
  let _newData = {}

  let _groupData = _.groupBy(data, function (v) {
    return v[sort.name] ? v[sort.name].toString() : v[sort.name]
  })

  let _sortOrder = []

  _.each(sort.order, function (v) {
    if (_.isBoolean(v)) {
      v = v.toString()
    }

    _sortOrder.push(v)

    _newData[v] = _groupData[v]
  })

  _newData.other = []

  for (let prop in _groupData) {
    if (_sortOrder.indexOf(prop) + 1 === 0) {
      _newData.other.push(_groupData[prop])
    }
  }

  _newData.other = _.flatten(_newData.other)

  if (groupFlag) {
    return _newData
  }

  let _array = []

  _.each(_sortOrder, function (v) {
    if (_newData[v]) {
      _array.push(_newData[v])
    }
  })

  _array.push(_.flatten(_newData.other))

  return _.flatten(_array)
}

let _dataHandleSorted = function (type, configObject, data, groupAttrName, configName) {
  let _isDataExist = configObject.data && !_.isEmpty(configObject.data)

  let _dataLength = _isDataExist ? configObject.data.length : 0

  function sortLengthSwitch (data, sortConfig, _dataLength) {
    let reData = data

    if (_dataLength === 1) {
      reData = _sortBySingleAttr(sortConfig, 0, data)
    } else if (_dataLength > 1) {
      reData = _sortByMultiAttr(sortConfig, data)
    }

    return reData
  }

  /* 排序配置中扩展group参数，如果配置group参数，则先分组再排序，如果没有配置group，则按原来的方式排序 */
  let groupConfig = configObject.group || []
  // 分组中而外判断条件 ---lyy1 20170704
  let groupFilters = configObject.groupFilters || []

  let groupLen = groupConfig.length

  function groupFilter (groupName) {
    return _.filter(groupFilters, function (g) {
      return g.groupName === groupName
    }) || []
  }

  if (Utils.isFlatStructure(type)) {
    if (groupLen > 0) {
      let sortedData = []
      let groupData = []
      let filterOp = {
        data: [],
        filter_type: 'and'
      }

      for (let idx = 0; idx < groupLen; idx++) {
        for (let i = 0; i < _dataLength; i++) {
          // 用groupName 把groupFilters中符合条件的数据过滤出来合并到filterOp.data中

          let groupFilterOP = groupFilter(groupConfig[idx].groupName)

          filterOp.data = _.union(groupFilterOP, [_.extend({}, groupConfig[idx], {
            name: configObject.data[i].name
          })])

          groupData = groupFilter([type, filterOp, data, groupAttrName, configName])

          groupData = sortLengthSwitch(groupData, configObject, _dataLength)

          sortedData = _.union(sortedData, groupData)
        }
      }

      data = sortedData
    } else {
      data = sortLengthSwitch(data, configObject, _dataLength)
    }
    /* 排序配置中扩展group参数，如果配置group参数，则先分组再排序，如果没有配置group，则按原来的方式排序 */
  } else {
    _.each(data, function (v) {
      v[groupAttrName] = sortLengthSwitch(v[groupAttrName], configObject, _dataLength)
    })

    // 分组结构的时候，调整分组数据

    let groupSortConfig = configObject.group_sort

    if (groupSortConfig && _.isArray(groupSortConfig.order) && groupSortConfig.order.length) {
      data = _assignSortValue(configObject.group_sort, data)
    }
  }
  return data
}

export default _dataHandleSorted
