import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    signup_result:{},
    saveuser_result:{},
    login_result:{},
    getotp_result:{},
    backend_api:process.env.VUE_APP_BACKEND_API,
    frontend_token: process.env.VUE_APP_FRONTEND_TOKEN,
    plugins: [createPersistedState()],
    login: false,
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
    filter_accesspoint_building:[],
    filter_accesspoint_storey: [],
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
    logout(state){
      state.user_type = '';
      state.login = false;
    },
    loginotp(state){
      state.login = true;
    },
    synclogin(state, login){
      state.login = login;
    },
    syncuser_type(state,usertype){
      state.user_type = usertype;
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
      state.filterstatus = status;
    },
    filter_accesspoint_building(state, access_point_list){
      state.filter_accesspoint_building = access_point_list;
    },
    filter_accesspoint_storey(state, access_point_list){
      state.filter_accesspoint_storey = access_point_list;
    },
    signup_result(state, signup_result){
      state.signup_result = signup_result;
    },
    saveuser_result(state, saveuser_result){
      state.saveuser_result = saveuser_result;
    },
    login_result(state, login_result){
      state.login_result = login_result;
    },
    getotp_result(state,getotp_result){
      state.getotp_result = getotp_result;
    },
  },
  actions: {
  },
  modules: {
  }
})
