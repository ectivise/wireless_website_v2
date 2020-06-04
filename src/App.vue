<template>
  <div id="app">
    <header>
      <h1>Speedtest Monitoring</h1>
      <img src="@/assets/legrovelogo.png" alt="Le Grove Logo" />
      <div id="nav" v-if="logged_in">
        <router-link to="/accesspoint" v-if="this.user_type == 'admin'" >Access Point</router-link>
        <router-link to="/raspberrypi" v-if="this.user_type == 'admin'" >Raspberry Pi</router-link>
        <router-link to="/user" v-if="this.user_type == 'admin'" >User</router-link>
      </div>
    </header>
    <body>
    <login_form v-if="!logged_in" @login="login" @login_otp="loginotp" @testlogin="testlogin" @handle2fa="handle2fa"/>
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
    this.logged_in = JSON.parse(localStorage.getItem(STORAGE_KEY)).logged_in;
    this.user_type = JSON.parse(localStorage.getItem(STORAGE_KEY)).user_type;
    this.$store.commit('synclogin',this.logged_in);
    this.$store.commit('syncuser_type',this.user_type);
  },
  methods: {
    async testlogin(phone_number,password){
      var response_result = ""

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "connect.sid=s%3AcH-Rp3eJ59QMQavxlhXCq4ek4_4keiNV.SKLmtBi9Hzd2YeSExMa1QtTDMdruJZkN5zBOJ1YlpJM");

      var urlencoded = new URLSearchParams();
      urlencoded.append("type", "mobile");
      urlencoded.append("mobile", phone_number);
      urlencoded.append("token", this.$store.state.frontend_token);
      urlencoded.append("password", password);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      await fetch(this.$store.state.backend_api+"login", requestOptions)
        .then(response => response.text())
        .then(result => this.$store.commit('login_result', JSON.parse(result)))
        .catch(error => console.log('error', error));

      response_result = this.$store.state.login_result;

      console.log(response_result.message);

      if(response_result.message == "mobile login success"){
        var role_type
        switch(response_result.data.roleType){
          case 0:
            role_type = 'normal';
            break;
          case 1:
            role_type = 'admin';
            break;
          case 2:
            role_type = 'superuser';
            break;
        }
        this.logged_in = true;

        let obj = {
          user_type : role_type,
          logged_in : this.logged_in,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

        let url = "/accesspoint";
        this.$router.push(url);
      } else{
        alert("error loging in")
      }
    },
    async login(phone_number, password) {
      
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "connect.sid=s%3A9ZCCTu10vRkP-58flVxctwh5ZK398sZ9.aUE9Qr7ozuEj1Djz%2BstettQL566xKmM%2B77E94vZF%2Byg");

      var urlencoded = new URLSearchParams();
      urlencoded.append("type", "mobile");
      urlencoded.append("mobile", phone_number);
      urlencoded.append("token", this.$store.state.frontend_token);
      urlencoded.append("password", password);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      await fetch(this.$store.state.backend_api+"login", requestOptions)
        .then(response => response.text())
        .then(result => this.$store.commit('login_result', JSON.parse(result)))
        .catch(error => console.log('error', error));

      console.log(this.$store.state.login_result.message)

      if (this.$store.state.login_result.message == 'mobile login success' ) {
        var role_type
        switch(this.$store.state.login_result.data.roleType){
          case 0:
            role_type = 'normal';
            break;
          case 1:
            role_type = 'admin';
            break;
          case 2:
            role_type = 'superuser';
            break;
        }
        this.logged_in = true;

        let obj = {
          user_type : role_type,
          logged_in : this.logged_in,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

        let url = "/accesspoint";
        this.$router.push(url);

      } else{
        alert("invalid username and password");
      }
    },
    async handle2fa(phone_number, otp){
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "connect.sid=s%3AcA85QD1cUMlHMmmc9aLBzwqeEPVHopDk.MfjgC7ImMeqXIyZXIcbwRHxnUcChsy3KaIZ%2Feu0aLoE");

      var urlencoded = new URLSearchParams();
      urlencoded.append("type", "2fa");
      urlencoded.append("mobile", phone_number);
      urlencoded.append("token", this.$store.state.frontend_token);
      urlencoded.append("otp", otp);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      await fetch(this.$store.state.backend_api + "login", requestOptions)
        .then(response => response.text())
        .then(result => this.$store.commit('login_result',JSON.parse(result)))
        .catch(error => console.log('error', error));

      console.log(this.$store.state.login_result.message)

      if (this.$store.state.login_result.message == 'otp login success!' ) {

        var role_type
        switch(this.$store.state.login_result.data.roleType){
          case 0:
            role_type = 'normal';
            break;
          case 1:
            role_type = 'admin';
            break;
          case 2:
            role_type = 'superuser';
            break;
        }

        this.logged_in = true;

        let obj = {
          user_type : role_type,
          logged_in : this.logged_in,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

        let url = "/accesspoint";
        this.$router.push(url);

      } else{
        alert("invalid username and password");
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
    async logout(){

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "connect.sid=s%3A9ZCCTu10vRkP-58flVxctwh5ZK398sZ9.aUE9Qr7ozuEj1Djz%2BstettQL566xKmM%2B77E94vZF%2Byg");

      var urlencoded = new URLSearchParams();
      urlencoded.append("token", this.$store.state.frontend_token);
      urlencoded.append("mobile", this.$store.state.login_result.data.mobile);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      await fetch(this.$store.state.backend_api+"logout", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

      this.logged_in = false;
      this.$store.commit("logout");

      let obj = {
          user_type : "",
          logged_in : this.logged_in,
        }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

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
