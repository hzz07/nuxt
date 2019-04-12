const state = () => ({menu: [], hotPlace: []})

const mutations = {
  setMenu(state, val) {
    state.menu = val
  },
  setHotPlace(state, val) {
    state.hotPlace = val
  }
}
//actions提交的是mutations，必须先定义好
const actions = {
  setMenu: ({commit}, menu) => {commit('setMenu', menu)},
  setHotPlace: ({commit}, hotPlace) => {commit('setHotPlace', hotPlace)}
}

export default {namespaced: true, state, mutations, actions}
