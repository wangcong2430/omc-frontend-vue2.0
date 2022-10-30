// oa-ticket setting

const query_string = location.href.indexOf('?') > -1 ? location.href.split('?').pop() : ''
const query_params = query_string.split('&').map(item => item.split('=')).reduce((prev, next) => {
  prev[next[0]] = next[1]
  return prev
}, {})

if (query_params['ticket']) {
  const setCookie = function(cname, cvalue, exdays) {
    const d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + '; ' + expires
  }

  const cookies = document.cookie.split(';').map(item => item.split('=')).reduce((prev, next) => {
    prev[next[0].trim()] = next[1]
    return prev
  }, {})
  if (!cookies['RIO_TCOA_TICKET']) {
    setCookie('RIO_TCOA_TICKET', 'tof:' + query_params['ticket'], 1)
  }
}
