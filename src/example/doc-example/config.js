let allApi = {
  data: [
    {
      index: 1,
      label: '复杂表格',
      children: [
        {
          index: 11,
          label: '基础通用功能',
          children: [
            {
              index: 111,
              label: '基本功能',
              type: '通用',
              filePath: 'doc/basic.md'
            },
            {
              index: 113,
              label: '固定列',
              type: '通用',
              filePath: 'doc/frozen.md'
            },
            {
              index: 117,
              label: '单元格数据格式化',
              type: '通用',
              filePath: 'doc/format.md'
            },
            {
              index: 114,
              label: '单元格展示格式化',
              type: '通用',
              filePath: 'doc/display.md'
            },
            {
              index: 115,
              label: '合计行统计',
              type: '通用',
              filePath: 'doc/summary.md'
            },
            {
              index: 116,
              label: '扩展序号列',
              type: '通用',
              filePath: 'doc/serial.md'
            },
            {
              index: 118,
              label: '表格内部搜索(两种模式)',
              type: '通用',
              filePath: 'doc/search.md'
            },
            {
              index: 119,
              label: '表头-复杂表头',
              type: '通用',
              filePath: 'doc/complex-header.md'
            },
            {
              index: 115,
              label: '表头-无表头',
              type: '通用',
              filePath: 'doc/head-visible.md'
            },
            {
              index: 1151,
              label: '表头-自定义样式',
              type: '通用',
              filePath: 'doc/head-style.md'
            },
            {
              index: 1110,
              label: '不同数据行自定义颜色',
              type: '通用'
            },
            {
              index: 1111,
              label: '是否显示表格单元格竖线',
              type: '通用',
              filePath: 'doc/border.md'
            },
            {
              index: 12,
              label: '对外提供插槽用于自定义显示内容',
              type: '通用',
              filePath: 'doc/slot.md'
            },
            {
              index: 13,
              label: '悬停表格面板弹开',
              type: '通用',
              filePath: 'doc/toggle.md'
            },
            {
              index: 15,
              label: '数据加载时，有加载中的效果',
              type: '通用'
            },
            {
              index: 16,
              label: '单元格悬停提示',
              type: '通用',
              filePath: 'doc/tooltip.md'
            },
            {
              index: 114,
              label: '单元格点击事件',
              type: '通用',
              filePath: 'doc/row-click.md'
            },
            {
              index: 116,
              label: '追加行字段展示',
              type: '通用',
              filePath: 'doc/cell-append.md'
            },
            {
              index: 117,
              label: '导出excel',
              type: '通用'
            },
            {
              index: 118,
              label: '编辑-基于单元格编辑',
              type: '通用',
              filePath: 'doc/edit-cell.md'
            },
            {
              index: 119,
              label: '编辑-基于行数据编辑(包括修改数据获取)',
              type: '通用',
              filePath: 'doc/edit-row.md'
            },
            {
              index: 120,
              label: '编辑-可编辑列控制',
              type: '通用',
              filePath: 'doc/edit-col.md'
            },
            {
              index: 121,
              label: '编辑-单元格编辑数据限制',
              type: '通用',
              filePath: 'doc/edit-cell-limit.md'
            },
            {
              index: 122,
              label: '编辑-基于行数据编辑-行编辑权限控制',
              type: '通用',
              filePath: 'doc/edit-row-permission.md'
            },
            {
              index: 123,
              label: '数据行合并',
              type: '通用',
              filePath: 'doc/rowspan.md'
            },
            {
              index: 124,
              label: '外部定位高亮行',
              type: '通用'
            }
          ]
        },
        {
          id: 2,
          label: '扁平化功能',
          children: [
            {
              index: 18,
              label: '表头点击排序',
              type: '扁平',
              filePath: 'doc/sort.md'
            },
            {
              index: 19,
              label: '扩展复选框列',
              type: '扁平'
            },
            {
              index: 21,
              label: '扁平化分页加载',
              type: '扁平',
              filePath: 'doc/pagination.md'
            }
          ]
        },
        {
          id: 3,
          label: '分组(树形)功能',
          children: [
            {
              index: 22,
              label: '分组1',
              type: '分组',
              filePath: 'doc/group.md'
            },
            {
              index: 23,
              label: '分组2',
              type: '分组',
              filePath: 'doc/group-area.md'
            },
            {
              index: 24,
              label: '分组3(通过parent_id构建父子级)',
              type: '分组',
              filePath: 'doc/group-parent.md'
            },
            {
              index: 25,
              label: '分组3(通过parent_id构建父子级)异步加载',
              type: '分组',
              filePath: 'doc/group-async.md'
            }
          ]
        }
      ]
    },
    {
      id: 1,
      label: '简单表格',
      children: [
        {
          key: 'simple',
          index: 24,
          label: '基础功能',
          filePath: 'doc/simple-table.md'
        }
      ]
    }
  ]
}
let allConfig = {
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
  }
}
export { allApi, allConfig }
