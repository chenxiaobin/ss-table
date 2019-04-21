let groupConfig = [
  {
    label: '按地区',
    toggle: 'right',
    colModels: [
      {
        name: 'unit_name',
        text: '单位名称',
        width: 130
      },
      {
        name: 'name',
        text: '姓名',
        width: 70,
        sortable: true
      },
      {
        name: 'duty',
        text: '职务',
        width: 200
      },
      {
        name: 'areaname',
        text: '所在地区',
        width: 80
      }
    ],
    group: {
      isUseParent: true,
      groupCustomName: '{0}({1})'
    }
  }
]
export default { groupConfig }
