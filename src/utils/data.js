import { DataHandles, DataTreeHandles } from '@idev1/ss-handle'

/**
 * 返回原始数据
 * @param {*} data 原始数据
 */
export function getRawData (data) {
  return data
}

/**
 * 获取单一搜索结果
 * @param {*} data 原始数据
 * @param {*} key 搜索的key
 * @param {*} value 搜索的key值
 */
export function getSearchData (data, key, value) {
  return data.filter((v) => {
    return v[key] && v[key].indexOf(value) > -1
  })
}

/**
 * 获取匹配多搜索结果
 * @param {*} data 原始数据
 * @param {*} sitem 搜索的对象
 * @param {*} value 搜索的key值
 * sitem: {
 *  field: '需要匹配搜索的key'
 * }
 */
export function getSearchItemData (data, sitem, value) {
  return data.filter((v) => {
    let isMath = null
    sitem.map((d) => {
      let isResult = d.field && v[d.field] && v[d.field].indexOf(value) > -1
      isMath = isMath === null ? isResult : isMath || isResult
    })
    return isMath
  })
}

/**
 * 获取结构化分组数据
 * @param {*} data 原始数据
 * @param {*} group 分组配置
 * group: {
 *  具体详见DataTreeHandles
 * }
 */
export function getTreeData (data, group) {
  /**
  * 处理完的树形数据需要包含的字段
  * group_name: 分组名称
  * all_child_length: 各分组数据统计个数
  * group_guid: 唯一标识
  * group_level: 分组层级
  * group_cid: 构建父子关系
  * group_parent_cid: 构建父子关系
  * is_expand_show: 分组是否显示
  * is_expand: 分组是否展开
  * is_leaf: 是否叶子节点
  */
  return new DataTreeHandles(data, group).buildTree()
}

/**
 * 获取截取到某位置的数据
 * @param {*} data 原始数据
 * @param {*} toindex 截止位置索引
 */
export function getSliceData (data, toindex) {
  return data.slice(0, toindex)
}

/**
 * 获取分页数据
 * @param {*} data 原始数据
 * @param {*} pageSize 每页数据条数
 * @param {*} currentPage 当前页数
 */
export function getSourceData (data, pageSize, currentPage) {
  return data.slice(
    pageSize * (currentPage - 1),
    pageSize * currentPage
  )
}

/**
 * 获取默认需要展开的数据
 * @param {*} data 原始数据
 */
export function getGroupExpendData (data) {
  let nindex = 1
  data.map((v) => {
    if (v.is_leaf) {
      v.__index = nindex
      nindex++
    } else {
      nindex = 1
    }
  })
  let result = data.filter(v => {
    return v.is_expand_show
  })
  return result
}

/**
 * 获取排序数据
 * @param {*} data 原始数据
 * @param {*} sortType 排序类型
 * @param {*} field 排序字段
 * @param {*} isgroup 是否是分组
 */
export function getSortData (data, sortType, field, group) {
  let result = data
  let isgroup = JSON.stringify(group) !== '{}' && group
  if (!isgroup && sortType) {
    result = DataHandles.DataSort(data,
      {
        data: [
          {
            name: field,
            order: sortType
          }
        ]
      }
    )
  } else if (sortType) {
    result = new DataTreeHandles(data, group).buildTree({
      dataSort: {
        data: [
          {
            name: field,
            order: sortType
          }
        ]
      }
    })
  }

  return sortType ? result : data
}
