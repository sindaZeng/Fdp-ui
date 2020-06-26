<script>
import {getQueryString} from '@/utils/util'

export default {
  name: 'AuthRedirect',
  created() {
    const url = window.location.href
    const code = getQueryString(url, 'code')
    let state = getQueryString(url, 'state')
    if (state) {
      const type = state.split('-')[1]
      state = state.split('-')[2]
      if (state === 'login'){
        const url = `${window.location.origin}/#/login?state=${type}&code=${code}&time=` + new Date().getTime()
        console.log(url)
        window.opener.location.href = url
        window.close()
      }
    } else {
      const hash = window.location.search.slice(1)
      if (window.localStorage) {
        window.localStorage.setItem('x-admin-oauth-code', hash)
        window.close()
      }
    }
  },
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
