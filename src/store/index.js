import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: false,
    user_type:"",
    plugins: [createPersistedState()],
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
    filterbuilding: "",
    filterlevel: "",
    filterraspi_id: "",
    filterstatus: "",
  },
  mutations: {
    register(state, user) {
      state.users.push(user);
    },
    login(state, type){
      state.user_type = type;
      state.login = true;
    },
    loginotp(state){
      state.login = true;
      state.user_type = 'operator'
    },
    filterraspi_id(state, raspi_id){
      state.filterraspi_id = raspi_id;
    },
    filterbuilding(state, building){
      state.filterbuilding = building;
    },
    filterlevel(state, level){
      state.filterlevel = level;
    },
    filterstatus(state, status){
      // 0 normal, 1 warning, 2 critical
      state.filterstatus = status
    }
  },
  actions: {
  },
  modules: {
  }
})
