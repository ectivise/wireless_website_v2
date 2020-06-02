<template>
<div class='container'>
  <span>
        <button @click.prevent="$emit('logout')" id="logout">Log out</button>
  </span>
  <user_table 
  v-bind:users="users"
  @edit:user="edituser" 
  @delete:user="deleteuser"/>
</div>
  
</template>

<script>
import user_table from "../components/user_table.vue"

export default {
  name: 'user_overview',
  components:{
    user_table,
  },
  data(){
    return{
      users: [
        {
          userCode: "",
          blocked: false,
          mobile: "mobile1",
          countryCode: 65,
          region: "",
          language: "",
          birthday: 0,
          name: "",
          nickName: "",
          gender: 0, //0 = male, 1 = female
          token: "",
          password: "password1",
          status: 0, //0 login, 1 logout, 2 disabled, 3, locked, 4 new user 5 signup
          registerDate: 0,
          lastlogin: 0,
          device: {},
          accountType: 0,
          customer: 0,
          roleType: 0,
          enabled: false,
          email: "",
          logintime: 0,
          application: 0, //appid
        },
        {
          userCode: "",
          blocked: false,
          mobile: "mobile2",
          countryCode: 65,
          region: "",
          language: "",
          birthday: 0,
          name: "",
          nickName: "",
          gender: 0, //0 = male, 1 = female
          token: "",
          password: "password2",
          status: 0, //0 login, 1 logout, 2 disabled, 3, locked, 4 new user 5 signup
          registerDate: 0,
          lastlogin: 0,
          device: {},
          accountType: 0,
          customer: 0,
          roleType: 0,
          enabled: false,
          email: "",
          logintime: 0,
          application: 0, //appid
        },
        {
          userCode: "",
          blocked: false,
          mobile: "mobile3",
          countryCode: 65,
          region: "",
          language: "",
          birthday: 0,
          name: "",
          nickName: "",
          gender: 0, //0 = male, 1 = female
          token: "",
          password: "password3",
          status: 0, //0 login, 1 logout, 2 disabled, 3, locked, 4 new user 5 signup
          registerDate: 0,
          lastlogin: 0,
          device: {},
          accountType: 0,
          customer: 0,
          roleType: 0,
          enabled: false,
          email: "",
          logintime: 0,
          application: 0, //appid
        },
        {
          userCode: "",
          blocked: false,
          mobile: "mobile4",
          countryCode: 65,
          region: "",
          language: "",
          birthday: 0,
          name: "",
          nickName: "",
          gender: 0, //0 = male, 1 = female
          token: "",
          password: "password4",
          status: 0, //0 login, 1 logout, 2 disabled, 3, locked, 4 new user 5 signup
          registerDate: 0,
          lastlogin: 0,
          device: {},
          accountType: 0,
          customer: 0,
          roleType: 0,
          enabled: false,
          email: "",
          logintime: 0,
          application: 0, //appid
        },
      ],
      users_copy:this.users,
    }
  },
  methods:{
    edituser(mobile, updateduser) {
      this.users = this.users.map((user) =>
        user.mobile === mobile ? updateduser : user
      );
      this.users_copy = this.users;
    },
    deleteuser(mobile) {
      this.users = this.users.filter(
        (user) => user.mobile !== mobile
      );
      // filtered side also delete
      // this.filtered_users = this.filtered_users.filter(
      //   (user) => user.mobile !== mobile
      // );
    },
  }
  
}
</script>

<style scoped>
span button{
    position: absolute;
    top: 10px;
    right: 10px;
}
.container{
  background-color: #eef1f4;
  max-width: 100%;
  margin: 0px;
  padding: 20px;
}
</style>