export default function (datas) {
  import('xlsx').then((XLSX) => {
    /* eslint-disable */
    let wopts = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    }
    let workBook = {
      SheetNames: ['Sheet1'],
      Sheets: {},
      Props: {}
    }

    datas.splice(0, 0, {id: '标题头'})

    let json2Excel = () => {
      // 1、XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
      // 2、将数据放入对象workBook的Sheets中等待输出
      workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(datas, {
        header: ['id', 'name', 'val', 'lng', 'lat']
      })

      workBook.Sheets['Sheet1']['!merges'] = [{
        e: { c: 5, r: 0 },
        s: { c: 0, r: 0 }
      }]
      // debugger
      console.log(workBook)
      // 3、XLSX.write() 开始编写Excel表格
      // 4、changeData() 将数据处理成需要输出的格式
      // saveAs(new Blob([changeData(XLSX.write(workBook, wopts))], {type: 'application/octet-stream'}))
    }

    let changeData = (s) => {
      // 如果存在ArrayBuffer对象(es6) 最好采用该对象
      if (typeof ArrayBuffer !== 'undefined') {
        // 1、创建一个字节长度为s.length的内存区域
        let buf = new ArrayBuffer(s.length)

        // 2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
        let view = new Uint8Array(buf)

        // 3、返回指定位置的字符的Unicode编码
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
        return buf
      } else {
        let buf = new Array(s.length)
        for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
        return buf
      }
    }

    let saveAs = (obj, fileName) => { // 当然可以自定义简单的下载文件实现方式
      let tmpa = document.createElement('a')

      tmpa.download = fileName || '下载.xlsx'
      tmpa.href = URL.createObjectURL(obj) // 绑定a标签
      tmpa.click() // 模拟点击实现下载

      setTimeout(() => { // 延时释放
        URL.revokeObjectURL(obj) // 用URL.revokeObjectURL()来释放这个object URL
      }, 100)
    }
    /* eslint-disable */
    json2Excel()
  })
}