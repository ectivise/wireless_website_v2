import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user_type:"",
    users: [
      {
        username: "admin",
        password: "admin@123",
        type: "admin",
      },
      {
        username: "operator",
        password: "operator@123",
        type: "operator",
      },
    ],
  },
  mutations: {
    register(state, user) {
      state.users.push(user);
    },
    login(state, type){
      state.user_type = type;
    },
  },
  actions: {
  },
  modules: {
  }
})
