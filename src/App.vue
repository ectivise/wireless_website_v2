<template>
  <div id="app">
    <header>
      <h1>Ectivise Wireless Monitor</h1>
      <div id="nav" v-if="logged_in">
        <router-link to="/accesspoint" >Access Point</router-link><strong v-if="this.user_type == 'admin'" style=""> | </strong>
        <router-link to="/raspberrypi" v-if="this.user_type == 'admin'">Raspberry Pi</router-link>
      </div>
    </header>
    <body>
    <login_form v-if="!logged_in" @login="login" @signup="signup"/>
    <router-view v-else @logout="logout" :key="$route.fullPath"/>
    </body>
  </div>
</template>

<script>
import login_form from "./components/login_form.vue";

export default {
  components: {
    login_form,
  },
  data() {
    return {
      logged_in: this.$store.state.login,
      user_type:"",
    };
  },
  methods: {
    login(username, password) {
      var target = this.$store.state.users.filter(
        (user) => user.username == username && user.password == password
      );
      // console.log(target);
      if (target == "" ) {
        alert("invalid username and password");
      } else {
        this.$store.commit('login',target[0].type);
        this.user_type = target[0].type;
        this.logged_in = this.$store.state.login;
        let url = "/accesspoint";
        this.$router.push(url);
      }
    },
    signup(user){
      this.$store.commit('register',user)
    },
    logout(){
      this.logged_in = false;
      let url = "/";
      this.$router.push(url);
    }
  },
};
</script>

<style scoped>
* {
  margin: 0;
}

header {
  position: relative;
  padding: 20px;
  text-align: center;
  background-color: #8ee4af;
}
#app {
  /* remove website default margins and padding */
  margin: 0px;
  padding: 0px;

}

#nav a {
  font-weight: bold;
  font-size: 30px;
  color: #05386b;
}

#nav a.router-link-exact-active {
  color: #379683;
}
</style>
