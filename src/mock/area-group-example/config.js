let groupConfig = [
  {
    label: '不分组',
    toggle: 'right',
    borderShow: false,
    frozen: {
      leftColNums: 2
    },
    summaryCols: ['val'],
    summaryText: '统计',
    colModels: [
      {
        name: 'river_name',
        text: '河流名称',
        width: 80,
        tooltip: {}
      },
      {
        name: 'river_length',
        text: '河流长度<br/>(m)',
        width: 120,
        format: {
          type: 'fixed',
          value: 2
        },
        sortable: true
      },
      {
        name: 'manager',
        text: '河管员',
        width: 80
      },
      {
        name: 'title',
        text: '职务',
        width: 120
      },
      {
        name: 'telephone',
        text: '联系方式',
        align: 'left',
        width: 200
      },
      {
        name: 'begin_position',
        text: '河流起点',
        width: 120
      },
      {
        name: 'end_position',
        text: '河流终点',
        width: 120
      },
      {
        name: 'is_expand',
        text: '河流终点',
        width: 120
      }
    ],
    searchItems: [
      {
        name: '测站编码',
        field: 'id'
      },
      {
        name: '测站名称',
        field: 'name'
      }
    ],
    pagination: {
      pageSize: 100,
      pageSizes: [100, 200, 300], // total表格内部自己算
      layout: 'prev, pager, next, total' // total, sizes, prev, pager, next, jumper
    }
  },
  {
    label: '按地区',
    toggle: 'right',
    colModels: [
      {
        name: 'river_name',
        text: '河流名称',
        width: 80,
        tooltip: {}
      },
      {
        name: 'river_length',
        text: '河流长度<br/>(m)',
        width: 120,
        format: {
          type: 'fixed',
          value: 2
        },
        sortable: true
      },
      {
        name: 'manager',
        text: '河管员',
        width: 80
      },
      {
        name: 'title',
        text: '职务',
        width: 120
      },
      {
        name: 'telephone',
        text: '联系方式',
        align: 'left',
        width: 200
      },
      {
        name: 'begin_position',
        text: '河流起点',
        width: 120
      },
      {
        name: 'end_position',
        text: '河流终点',
        width: 120
      },
      {
        name: 'is_expand',
        text: '河流终点',
        width: 120
      }
    ],
    group: {
      groupCustomName: '{0}({1})',
      groupTemplate: 'area',
      groupTemplateMinLevel: 'town'
    }
  }
]
export default { groupConfig }
