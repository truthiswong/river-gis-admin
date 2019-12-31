import Vue from 'vue'
import {
  login,
  logout,
  projectMinesTructure
} from '@/api/login'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import {
  welcome
} from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      name,
      welcome
    }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({
      commit,
      rootState
    }, userInfo) {
      console.log(userInfo);

      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, 'Bearer ' + result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', 'Bearer ' + result.token)
          projectMinesTructure().then(res => {
            var arr = res.data
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].children.length > 0) {
                commit('show', arr[i].children[0].id)
                // Vue.ls.set('SET_PROJECT_ID', arr[i].children[0].id)
                break
              }
            }
            // if (rootState.defautProject.length <= 0) {
            //   let defautArr = []
            //   if (arr[0].children.length > 0) {
            //     defautArr.push(arr[0].id)
            //     defautArr.push(arr[0].children[0].id)
            //   }
            //   commit('SET_DEFAUT_PROJECT', defautArr)
            // }
            resolve()
          })
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    // GetInfo ({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(response => {
    //       const result = response.result

    //       if (result.role && result.role.permissions.length > 0) {
    //         const role = result.role
    //         role.permissions = result.role.permissions
    //         role.permissions.map(per => {
    //           if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
    //             const action = per.actionEntitySet.map(action => { return action.action })
    //             per.actionList = action
    //           }
    //         })
    //         role.permissionList = role.permissions.map(permission => { return permission.permissionId })
    //         commit('SET_ROLES', result.role)
    //         commit('SET_INFO', result)
    //       } else {
    //         reject(new Error('getInfo: roles must be a non-null array !'))
    //       }

    //       commit('SET_NAME', { name: result.name, welcome: welcome() })
    //       commit('SET_AVATAR', result.avatar)

    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    Logout({
      commit,
      state
    }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user