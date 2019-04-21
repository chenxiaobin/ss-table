import _ from 'lodash'

class main {
  constructor (data, config) {
    this._data = data
    this._config = config
    this._tempLevelFields = _.cloneDeep(this._config.groupingView || [])
    this._isExcludeParent = _.isBoolean(this._config.isExcludeParent)
      ? this._config.isExcludeParent
      : true
  }

  buildTree () {
    this._treeArray = []

    let data = this._data

    let result = []

    if (!this._config.isUseParent) {
      this._getTreeGridData(data, 0)

      result = _.sortBy(_.flatten(this._treeArray), v => {
        return v.group_cid
      })

      if (this._config.groupDataSort) {
        // result = this._buildTreeSorted(this._treeArray);
      }
    } else {
      result = this._relyParentBuildTree(data, this._config)

      if (this._config.groupDataSort) {
        // let _sortConfig = this._config.groupDataSort || {};

        // let _sortBy = [_sortConfig.data || [], {
        //   name: 'group_cid',
        //   order: 'asc'
        // }];

        result = this._treeArray //  DataHandle._dataHandleSorted(['flat', { data: _.flatten(_sortBy) }, this._treeArray]);
      }
    }

    return data && data.length ? result : []
  }

  _getTreeGridData (data, levelIndex) {
    let fieldOp = this._tempLevelFields[levelIndex]

    let groups = _.groupBy(data, v => {
      if (!v[fieldOp.field]) {
        v[fieldOp.field] = fieldOp.emptyValue
      }
      return v[fieldOp.field]
    })

    function excludeParentGroup () {
      let treeLevelFields = this._tempLevelFields

      this._tempLevelFields =
        treeLevelFields.length > 1 ? _.rest(treeLevelFields) : treeLevelFields

      fieldOp = this._tempLevelFields[levelIndex]

      groups = _.groupBy(data, v => {
        if (!v[fieldOp.field]) {
          v[fieldOp.field] = fieldOp.emptyValue
        }
        return v[fieldOp.field]
      })

      if (
        _.keys(groups).length === 1 &&
        _.keys(groups)[0] === fieldOp.emptyValue
      ) {
        excludeParentGroup()
      }
    }

    // 是否要处理不显示父级分组的处理（适用省市县通用版本，市县级数据不需要省级分组的情况）
    if (this._isExcludeParent) {
      if (
        _.keys(groups).length === 1 &&
        _.keys(groups)[0] === fieldOp.emptyValue
      ) {
        excludeParentGroup()
      }
    }

    let count = 0

    _.each(groups, (v, k) => {
      let parents = {
        group_name: k,
        group_childs: [],
        group_childs_length: 0,
        group_cid: 'v-' + this._countAddDigits(count),
        group_parent_cid: 0,
        group_level: levelIndex,
        isLeaf: false,
        all_child_length: v.length
      }

      this._copyCustomAttrToParent(parents, v[0])

      let _pcdata = this._getExcludeCurrent(v, k)

      parents = Object.assign(parents, _pcdata.parents) // $.extend(true, {}, parents, _pcdata.parents)

      this._getChildsData(parents, _pcdata.childs, levelIndex + 1)

      this._treeArray.push(parents)

      count++
    })
  }

  _getExcludeCurrent (data, value) {
    let { currentLevelAttr } = this._config
    let parents = {}
    let childs = data
    if (currentLevelAttr) {
      parents =
        _.find(data, v => {
          return v[currentLevelAttr] === value
        }) || {}

      childs =
        _.filter(data, v => {
          return v[currentLevelAttr] !== value
        }) || data
    }
    return { parents, childs }
  }

  _getChildsData (parents, data, levelIndex) {
    let fieldOp = this._tempLevelFields[levelIndex]

    let notNextGroup = _.find(data, v => {
      return v.not_next_group
    })

    if (!fieldOp || notNextGroup) {
      parents.group_childs_length = data.length

      _.each(data, (v, k) => {
        v.isLeaf = true

        v.group_level = levelIndex

        v.group_cid = parents.group_cid + this._countAddDigits(k)

        v.group_parent_cid = parents.group_cid

        this._treeArray.push(v)
      })

      return
    }

    let groups = _.groupBy(data, v => {
      let currentLevel = fieldOp.currentLevel

      if (
        currentLevel &&
        v[currentLevel.orignName] === v[currentLevel.compareName]
      ) {
        v[fieldOp.field] = currentLevel.replaceName

        v.not_next_group = true
      } else if (!v[fieldOp.field]) {
        v[fieldOp.field] = fieldOp.emptyValue
      }
      return v[fieldOp.field]
    })

    parents.group_childs_length = _.keys(groups).length

    let count = 0

    _.each(groups, (v, k) => {
      let childs = {
        group_name: k,
        group_childs: [],
        group_childs_length: 0,
        group_cid: parents.group_cid + this._countAddDigits(count),
        group_parent_cid: parents.group_cid,
        group_level: levelIndex,
        isLeaf: false,
        all_child_length: v.length
      }

      this._copyCustomAttrToParent(childs, v[0])

      let _pcdata = this._getExcludeCurrent(v, k)

      childs = Object.assign(childs, _pcdata.parents) // $.extend(true, {}, childs, _pcdata.parents)

      this._treeArray.push(childs)

      this._getChildsData(childs, _pcdata.childs, levelIndex + 1)

      count++
    })
  }

  _countAddDigits (count) {
    let defStr = '00000'
    let countLen = count.toString().length
    return defStr.substr(countLen - defStr.length) + count
  }

  _relyParentBuildTree (data = [], config) {
    if (!data.length) {
      return []
    }

    let { key = 'id', parentKey = 'parent_code', groupName = 'name' } = config

    // let rootValue = config.rootParentValue || '0' // 根节点值

    let result = []

    _.each(data, v => {
      let pValue = v[parentKey] && v[parentKey].toString().trimRight()

      let npCode = _.find(data, d => {
        return pValue === d[key].toString().trimRight()
      })

      if (!npCode) {
        result.push(v)
      }
    })

    result = _.flatten(result)

    if (!result.length) {
      // throw '未找到根节点数据，怎么进行树形构建'
    }

    let newResult = []

    let count = 0

    function childGroupBuild (dataArray, parent) {
      _.each(dataArray, (v, k) => {
        // 判断是否是最后一级的根节点
        count = parent.group_level + 1 > count ? parent.group_level + 1 : count

        v.group_level = parent.group_level + 1

        v.group_name = v[groupName]

        v.group_cid = parent.group_cid + this._countAddDigits(k)

        v.group_parent_cid = parent.group_cid

        v.group_childs = _.filter(data, d => {
          return (
            d[parentKey] &&
            d[parentKey].toString().trimRight() === v[key].trimRight()
          )
        })

        v.group_childs_length = v.group_childs.length

        v.isLeaf = !!(!v.group_childs_length && v.group_level === count)

        newResult.push(v)

        if (v.group_childs_length) {
          childGroupBuild(v.group_childs, v)
        }
      })
    }

    childGroupBuild(result, {
      group_level: -1,
      group_cid: 'v-'
    })

    if (this._config.totalAllChilds) {
      _.each(newResult, v => {
        let regexp = new RegExp('^' + v.group_cid)

        v.group_childs_length =
          _.filter(newResult, d => {
            return regexp.test(d.group_cid)
          }).length - 1
      })
    }

    return newResult
  }
  // 根据parent结构化end

  _buildTreeSorted (data, config) {
    let ndata = []

    let temp = Object.assign([], data) // $.extend(true, [], data)

    // let _sortConfig = this._config.groupDataSort || {};

    let fdata = [_.min(data, 'group_level')]

    function pushChildNodeBySorted (childData) {
      let sdata = childData // DataHandle._dataHandleSorted(['flat', _sortConfig || {}, childData]);

      _.each(sdata, v => {
        if (!v.isPush) {
          v.isPush = true

          ndata.push(v)

          let regexp = new RegExp('^' + v.group_cid + '.')

          let cfdata = _.filter(temp, d => {
            return regexp.test(d.group_cid)
          })

          if (cfdata.length) {
            pushChildNodeBySorted(cfdata)
          }
        }
      })
    }

    pushChildNodeBySorted(fdata)

    return ndata
  }

  _copyCustomAttrToParent (parent, data) {
    let { groupKeyCopyToParent } = this._config

    if (groupKeyCopyToParent.length && data) {
      _.each(groupKeyCopyToParent, d => {
        parent[d] = data[d]
      })
    }
    return parent
  }
}

export default main
