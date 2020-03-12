import { login, logout, getInfo } from '@/api/user'
import { getMenu } from '@/api/menu'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { encryption } from '@/utils/encryption'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, rfToken) => {
    state.refresh_token = rfToken
  },
  SET_EXPIRES_IN: (state, expires_in) => {
    state.expires_in = expires_in
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_PERMISSION: (state, permissions) => {
    state.permissions = permissions
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  login({ commit }, userInfo) {
    const user = encryption({
      data: userInfo,
      key: '*4%mMZTrk',
      param: ['password']
    })
    return new Promise((resolve, reject) => {
      login(user.username, user.password).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
        commit('SET_EXPIRES_IN', data.expires_in)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const data = response.data.data || {}
        if (!data) {
          reject('验证失败，请重新登录.')
        }
        const { sysUser, roles, permissions } = data
        const { username, avatar } = sysUser
        if (!roles || roles.length <= 0) {
          reject('当前账号没有任何角色,请联系管理员!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_PERMISSION', permissions)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户菜单
  getMenu({ commit }) {
    return new Promise((resolve, reject) => {
      getMenu().then((response) => {
        const data = response.data
        if (!data) {
          this.$message({
            message: '菜单数据加载异常,请联系管理员',
            type: 0
          })
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}