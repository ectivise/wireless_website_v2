<template>
  <div id="app">
    <header>
      <h1>Speedtest Monitoring</h1>
      <img src="@/assets/legrovelogo.png" alt="Le Grove Logo" />
      <div id="nav" v-if="logged_in">
        <router-link to="/accesspoint" v-if="this.user_type == 'admin'" >Access Point</router-link>
        <router-link to="/raspberrypi" v-if="this.user_type == 'admin'" >Raspberry Pi</router-link>
      </div>
    </header>
    <body>
    <login_form v-if="!logged_in" @login="login" @signup="signup" @login_otp="loginotp"/>
    <router-view v-else @logout="logout" :key="$route.fullPath"/>
    </body>
    <footer>
      <h6>copyright © 2020 Le Grove. All rights reserved</h6>
      <h6>by Ectivise Solutions Pte Ltd</h6>
      <h6 style="display:inline">Terms & Conditions | </h6>
      <h6 style="display:inline">Privacy Policy | </h6> 
      <h6 style="display:inline">Terms of Use</h6>
    </footer>
  </div>
</template>

<script>
import login_form from "./components/login_form.vue";

const STORAGE_KEY = 'data_storage'

export default {
  components: {
    login_form,
  },
  data() {
    return {
      logged_in: false,
      user_type:"",
    };
  },
  created () {
    this.logged_in = JSON.parse(localStorage.getItem(STORAGE_KEY));
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
        this.logged_in = true;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logged_in));

        let url = "/accesspoint";
        this.$router.push(url);
      }
    },
    loginotp(otp){
      if(otp == '123456'){
        this.$store.commit('loginotp');
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logged_in));
      let url = "/";
      this.$router.push(url);
    }
  },
};
</script>

<style scoped>

@media screen and (min-width: 761px){
  img {
  position: absolute;
  width: 180px;
  top: 5px;
  left: 5px;
  background-color: whitesmoke;
  padding: 10px;
}
}

* {
  margin: 0;
}

header {
  height: 95px;
  width: 100%;
  position: relative;
  padding: 20px 20px 0px 20px;
  text-align: center;
  background-color: #333;
}

footer {
  width: 100%;
  position: relative;
  bottom: 0;
  left: 0;
  background-color: #333;
  text-align: center;
  color: #f2f2f2;
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
  img {
  display: none;
  }
  #nav a{
    display:block;
    width: 100vw;
  }

  #nav a:hover{
    background-color: #f2f2f2;
  }

  #nav a.router-link-exact-active {
  background-color: #4CAF50;
  }
}
</style>
