<template>
  <div id="app">
    <header>
      <h1>Speedtest Monitoring</h1>
      <h6>by Ectivise Solutions Pte Ltd</h6>
      <div id="nav" v-if="logged_in">
        <router-link to="/accesspoint" v-if="this.user_type == 'admin'" >Access Point</router-link>
        <router-link to="/raspberrypi" v-if="this.user_type == 'admin'" >Raspberry Pi</router-link>
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
    async signup(user){
      // this.$store.commit('register',user)
      try {
        var urlencoded = new URLSearchParams();
        urlencoded.append(
          "token",
          "ectivisecloudDBAuthCode:b84846daf467cede0ee462d04bcd0ade"
        );
        urlencoded.append("mobile", user.phone_number);
        urlencoded.append("password", user.password);

        const response = await fetch(
          "http://dev1.ectivisecloud.com:8081/api/users/signup",
          {
            method: "POST",
            body: urlencoded,
            headers: { "Content-type": "application/x-www-form-urlencoded" },
          }
        );

        const data = await response.json();
        console.log(data.message);
        alert(data.message);
      } catch (error) {
        console.error(error.message);
      }
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
  width: 100%;
  position: relative;
  padding: 20px 20px 0px 20px;
  text-align: center;
  background-color: #333;
}

header h1{
  color: #f2f2f2;
}
header h6{
  padding:3px;
  color: #f2f2f2;
}
#app {
  /* remove website default margins and padding */
  margin: 0px;
  padding: 0px;

}

#nav a {
  position: relative;
  font-weight: bold;
  font-size: 20px;
  color: #f2f2f2;
  text-decoration: none;
  padding:10px 10px 5px 10px;
}

#nav a:hover{
    background-color: #ddd;
    color: black;
    transition: .5s;
}

#nav a.router-link-exact-active {
  background-color: #4CAF50;
}

@media screen and (max-width: 760px){
  header{
    padding: 20px 0px 0px 0px;
  }
  #nav a{
    display:block;
    width: 100vw;
  }

  #nav a:hover{
    background-color: #f2f2f2;
  }
}
</style>
