<template>
  <div id="app">
    <header>
      <h1>Ectivise Wireless Monitor</h1>
      <div id="nav" v-if="logged_in">
        <router-link to="/accesspoint">Access Point</router-link> |
        <router-link to="/raspberrypi">Raspberry Pi</router-link>
      </div>
    </header>
    <body>
    <login_form v-if="!logged_in" @login="login" @signup="signup"/>
    <router-view v-else />
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
      logged_in: false,
      users: [],
    };
  },
  // computed: {
  //   getusers(){
  //     return
  //   }
  // }
  methods: {
    login(username, password) {
      var target = this.$store.state.users.filter(
        (user) => user.username == username && user.password == password
      );
      console.log(target);
      if (target == "" ) {
        alert("invalid username and password");
      } else {
        this.logged_in = true;
        this.$store.commit('login',target.type);
      }
    },
    signup(user){
      this.$store.commit('register',user)
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
  max-width: 100%;
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
