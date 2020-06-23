import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'dev/dataSource/page',
    method: 'get',
    params: query
  })
}

export function getTableInfoById(query,id) {
  return request({
    url: 'dev/dataSource/'+id,
    method: 'get',
    params: query
  })
}


export function generator(id,data) {
  return request({
    url: 'dev/code/'+id+'/generator',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  }).then((response) => { // 处理返回的文件流
    const blob = new Blob([response.data], {type: 'application/zip'})
    const filename = data.moduleName + '.zip'
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function () {
      URL.revokeObjectURL(blob)
      document.body.removeChild(link)
    }, 0)
  })
}
