/**
 * handle Blob data to json
 * @param {Blob} data
 */
export function blobToJson(data) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(data, 'utf-8')
    reader.onload = function(event) {
      const res = JSON.parse(event.target.result)
      resolve(res)
    }
    reader.onerror = function() {
      reader.abort()
      reject(new Error('Problem parsing file'))
    }
  })
}

export function getFileNameFromDisposition(disposition) {
  let fileName = ''
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = filenameRegex.exec(disposition)
    if (matches != null && matches[1]) {
      fileName = matches[1].replace(/['"]/g, '')
    }
  }

  return fileName
}

export function downloadExcelFile(responseData, fileName, type) {
  const blob = new Blob([responseData], { type })
  const elink = document.createElement('a')
  elink.download = fileName
  elink.style.display = 'none'
  elink.href = URL.createObjectURL(blob)
  document.body.appendChild(elink)
  elink.click()
  document.body.removeChild(elink) // 移除
}
