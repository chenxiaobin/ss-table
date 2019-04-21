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
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'basicColumns'
                }
              ],
              tips: `api：colModels<br/>
                     说明：自定义配置列；表头固定；滚动加载数据（扁平化数据特有）；隔行变色，tr上都有绑定class="ss-table-tr-even"和"ss-table-tr-odd"可以样式重置；悬停变色，tr上绑定class="ss-table-tr-hover"可以样式重置<br/>
                     测试：`
            },
            {
              index: 113,
              label: '固定列',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'basicColumns'
                },
                {
                  api: 'frozen',
                  allConfigKey: 'frozen'
                }
              ],
              tips: `api：frozen<br/>
                     说明：<br/>
                     测试：`
            },
            {
              index: 117,
              label: '单元格数据格式化',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'formatColumns'
                }
              ],
              tips: `api：colModels.format<br/>
                     说明：提供三种格式化：时间、保留小数位、保留有效数字<br/>
                     测试：`
            },
            {
              index: 115,
              label: '合计行统计',
              type: '通用',
              ccheck: true,
              etest: true,
              etestcontent: '复杂表头统计失效',
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'basicColumns'
                },
                {
                  api: 'summaryCols',
                  allConfigKey: 'summaryCols'
                },
                {
                  api: 'summaryText',
                  allConfigKey: 'summaryText'
                }
              ],
              tips: `api：summaryCols、summaryText<br/>
                     说明：summaryCols自定义需要统计的列，summaryText第一列不进行统计，默认显示合计; 格式化根据字段的格式化配置<br/>
                     测试：`
            },
            {
              index: 116,
              label: '扩展序号列',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'indexColumns'
                }
              ],
              tips: `api: <br/>
                     说明：内置功能，name为ex_rowid，extend为true<br/>
                     测试：`
            },
            {
              index: 118,
              label: '表格内部搜索',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'basicColumns'
                },
                {
                  api: 'searchItems',
                  allConfigKey: 'searchItems'
                }
              ],
              tips: `api: searchItems<br/>
                     说明: <br/>
                     测试：`
            },
            {
              index: 119,
              label: '复杂表头',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'complexColumns'
                }
              ],
              tips: `api: colModels.items<br/>
                     说明: 列中嵌套item <br/>
                     测试：`
            },
            {
              index: 1110,
              label: '不同数据行自定义颜色',
              type: '通用',
              ccheck: false
            },
            {
              index: 1111,
              label: '是否显示表格单元格竖线',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'basicColumns'
                },
                {
                  api: 'borderShow',
                  allConfigKey: 'borderShow'
                }
              ],
              tips: `api：borderShow<br/>
                     说明：提供了class="ss-custom-border"的类型进行样式重写<br/>
                     测试：`
            },
            {
              index: 12,
              label: '对外提供插槽用于自定义显示内容',
              type: '通用',
              ccheck: true
            },
            {
              index: 13,
              label: '悬停表格面板弹开',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'basicColumns'
                },
                {
                  api: 'toggle',
                  allConfigKey: 'toggle'
                }
              ],
              tips: `api：toggle<br/>
                     说明：取值left、right<br/>
                     测试：`
            },
            {
              index: 15,
              label: '数据加载时，有加载中的效果',
              type: '通用',
              ccheck: true
            },
            {
              index: 16,
              label: '单元格悬停提示',
              type: '通用',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'tooltipColumns'
                }
              ],
              tips: `api：colModels.tooltip<br/>
                     说明：如果没有特殊，配置为空对象，还可以设置colModels.tooltip.effect = '跟着element官网走', 默认light；colModels.tooltip.placement = '跟着element官网走', 默认bottom<br/>
                     测试：`
            },
            {
              index: 114,
              label: '单元格点击事件',
              type: '通用',
              ccheck: true
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
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'sortColumns'
                }
              ],
              tips: `api：colModels.sortable<br/>
                     说明：<br/>
                     测试：`
            },
            {
              index: 19,
              label: '扩展复选框列',
              type: '扁平',
              ccheck: false
            },
            {
              index: 21,
              label: '扁平化分页加载',
              type: '扁平',
              ccheck: true,
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'basicColumns'
                },
                {
                  api: 'pagination',
                  allConfigKey: 'pagination'
                }
              ],
              tips: `api：pagination<br/>
                     说明：分页配置可以参考element分页，主要三个属性：pageSize、pageSizes、layout<br/>
                     测试：`
            }
          ]
        },
        {
          id: 3,
          label: '分组(树形)功能',
          children: [
            {
              index: 22,
              label: '分组/树形展示',
              type: '分组',
              ccheck: true,
              etest: true,
              mockData: 'river',
              config: [
                {
                  api: 'colModels',
                  allConfigKey: 'riverColumns'
                },
                {
                  api: 'group',
                  allConfigKey: 'group'
                },
                {
                  api: 'searchItems',
                  allConfigKey: 'searchItems'
                }
              ],
              tips: `api：group<br/>
                     说明：<br/>
                     测试：`
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
          ccheck: true,
          config: true,
          tips: `api：<br/>
                 说明：<br/>
                 测试：`
        }
      ]
    }
  ]
}
let allConfig = {
  toggle: 'left',
  borderShow: true,
  frozen: {
    leftColNums: 2
  },
  summaryCols: ['val'],
  summaryText: '统计',
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
  },
  basicColumns: [
    {
      name: 'id',
      text: '测站编码',
      width: 150
    },
    {
      name: 'name',
      text: '测站名称',
      width: 150
    },
    {
      name: 'val',
      text: '水位<br/>(m)',
      width: 120
    },
    {
      name: 'time',
      text: '时间',
      width: 200
    },
    {
      name: 'ensure_val',
      text: '保证水位<br/>(m)',
      width: 120
    },
    {
      name: 'out_val',
      text: '流量<br/>(m³/s)',
      width: 120
    },
    {
      name: 'water_potential',
      text: '水势',
      width: 120
    },
    {
      name: 'address',
      text: '所在地址',
      align: 'left',
      width: 200
    }
  ],
  tooltipColumns: [
    {
      name: 'id',
      text: '测站编码',
      width: 150,
      tooltip: {}
    },
    {
      name: 'name',
      text: '测站名称',
      width: 150,
      tooltip: {}
    },
    {
      name: 'val',
      text: '水位<br/>(m)',
      width: 120
    },
    {
      name: 'time',
      text: '时间',
      width: 200
    },
    {
      name: 'ensure_val',
      text: '保证水位<br/>(m)',
      width: 120
    },
    {
      name: 'out_val',
      text: '流量<br/>(m³/s)',
      width: 120
    },
    {
      name: 'water_potential',
      text: '水势',
      width: 120
    },
    {
      name: 'address',
      text: '所在地址',
      align: 'left',
      width: 200
    }
  ],
  formatColumns: [
    {
      name: 'id',
      text: '测站编码',
      width: 150
    },
    {
      name: 'name',
      text: '测站名称',
      width: 150
    },
    {
      name: 'val',
      text: '水位<br/>(m)',
      width: 120,
      format: {
        type: 'fixed',
        value: 2
      }
    },
    {
      name: 'time',
      text: '时间',
      width: 200,
      format: {
        type: 'date',
        value: 'YYYY-MM-DD'
      }
    },
    {
      name: 'ensure_val',
      text: '保证水位<br/>(m)',
      width: 120,
      format: {
        type: 'precision',
        value: 3
      }
    },
    {
      name: 'out_val',
      text: '流量<br/>(m³/s)',
      width: 120
    },
    {
      name: 'water_potential',
      text: '水势',
      width: 120
    },
    {
      name: 'address',
      text: '所在地址',
      align: 'left',
      width: 200
    }
  ],
  indexColumns: [
    {
      name: 'ex_rowid',
      text: '序号',
      width: 50,
      extend: true
    },
    {
      name: 'id',
      text: '测站编码',
      width: 150
    },
    {
      name: 'name',
      text: '测站名称',
      width: 150
    },
    {
      name: 'val',
      text: '水位<br/>(m)',
      width: 120
    },
    {
      name: 'time',
      text: '时间',
      width: 200
    },
    {
      name: 'ensure_val',
      text: '保证水位<br/>(m)',
      width: 120
    },
    {
      name: 'out_val',
      text: '流量<br/>(m³/s)',
      width: 120
    },
    {
      name: 'water_potential',
      text: '水势',
      width: 120
    },
    {
      name: 'address',
      text: '所在地址',
      align: 'left',
      width: 200
    }
  ],
  complexColumns: [
    {
      name: 'ex_rowid',
      text: '序号',
      width: 50,
      extend: true
    },
    {
      text: '水情测站',
      items: [
        {
          name: 'id',
          text: '测站编码',
          width: 150
        },
        {
          name: 'name',
          text: '测站名称',
          width: 150
        }
      ]
    },
    {
      name: 'val',
      text: '水位<br/>(m)',
      width: 120
    },
    {
      name: 'time',
      text: '时间',
      width: 200
    },
    {
      name: 'ensure_val',
      text: '保证水位<br/>(m)',
      width: 120
    },
    {
      name: 'out_val',
      text: '流量<br/>(m³/s)',
      width: 120
    },
    {
      name: 'water_potential',
      text: '水势',
      width: 120
    },
    {
      name: 'address',
      text: '所在地址',
      align: 'left',
      width: 200
    }
  ],
  sortColumns: [
    {
      name: 'id',
      text: '测站编码',
      width: 150,
      sortable: true
    },
    {
      name: 'name',
      text: '测站名称',
      width: 150
    },
    {
      name: 'val',
      text: '水位<br/>(m)',
      width: 120,
      sortable: true
    },
    {
      name: 'time',
      text: '时间',
      width: 200
    },
    {
      name: 'ensure_val',
      text: '保证水位<br/>(m)',
      width: 120,
      sortable: true
    },
    {
      name: 'out_val',
      text: '流量<br/>(m³/s)',
      width: 120,
      sortable: true
    },
    {
      name: 'water_potential',
      text: '水势',
      width: 120
    },
    {
      name: 'address',
      text: '所在地址',
      align: 'left',
      width: 200
    }
  ],
  riverColumns: [
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
  },
  simpleConfig: {
    columns: 2,
    colModles: [
      {
        field: 'id',
        name: '测站编码'
      },
      {
        field: 'time',
        name: '时间',
        format: 'YYYY-MM-DD'
      },
      {
        field: 'lng',
        name: '经度'
      },
      {
        field: 'lat',
        name: '纬度',
        fixed: 2
      },
      {
        field: 'type_name',
        name: '类型'
      },
      {
        field: 'area_name',
        name: '行政区划'
      },
      {
        field: 'city_name',
        name: '所在地市'
      },
      {
        field: 'water_potential',
        name: '水势'
      },
      {
        field: 'address1',
        name: '地址',
        colspan: 3
      }
    ]
  }
}
export { allApi, allConfig }
