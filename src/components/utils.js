let objDeepCopy = (source) => {
  let sourceCopy = source instanceof Array ? [] : {}
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
  }
  return sourceCopy
}

let Utils = {
  objDeepCopy: objDeepCopy,
  getSourceData (data, isPagination, pageSize, currentPage) {
    let ndata = objDeepCopy(data)
    if (!isPagination) {
      return ndata
    }

    return ndata.slice(
      pageSize * (currentPage - 1),
      pageSize * currentPage
    )
  }
}
export default Utils
