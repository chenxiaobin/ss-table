let simpleConfig = {
  columns: 2,
  labelStyle: {},
  valueStyle: {},
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
      name: '水势',
      unit: '单位'
    },
    {
      field: 'address1',
      name: '地址',
      colspan: 3
    }
  ]
}

export default { simpleConfig }
