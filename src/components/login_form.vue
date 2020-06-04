<template>
  <div class="container">
    <!-- login page -->
    <div class="card" v-if="register_otp == false && register == false && login_otp == false">
      <div class="sign-in">
        <img src="@/assets/legrovelogo.png" alt="Le Grove Logo" />
        <h2>User Login</h2>
        <form action="">
          <input
            v-model="phone_number"
            type="text"
            id="phone_number"
            placeholder="Phone Number"
            :class="{ 'has-error': loging_in && invalidphone_number_login }"
            @focus="clearstatus"
            @keypress="clearstatus"
            ref="first"
          />
          <br />
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="password"
            :class="{ 'has-error': loging_in && invalidpassword_login }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <br />
          <button @click.prevent="handlelogin">
            Login
          </button>
          <br />
          <h6>or</h6>
          <button @click.prevent="userotp">
            Login with OTP
          </button>
        </form>
      </div>
      <span>
        <strong id="forgetpw" @click.prevent="userforgetpw">Forget Password?</strong>
        <p>
          Not Registered?
          <strong id="register" @click.prevent="userregister">Register</strong>
        </p>
      </span>
    </div>
    <!-- login to one time password page -->
    <div class="card" v-else-if="login_otp == true">
      <strong id="back" @click.prevent="back"> &#8249; </strong>
      <h2>Login via OTP</h2>
      <p>We send you a One Time Password <br />to your Phone Number via SMS</p>
      <form action="">
        <input
          v-model="phone_number"
          type="text"
          id="phone_number"
          placeholder="Phone Number"
          :class="{ 'has-error': loging_in_otp && invalidphone_number_otp }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />
        <button @click.prevent="sendotp">
          Resend OTP</button
        ><br />
        <input
          v-model="otp"
          type="text"
          id="otp"
          placeholder="One Time Password"
          :class="{ 'has-error': loging_in_otp && invalidotp }"
          @focus="clearstatus"
          @keypress="clearstatus"
          ref="first"
        />
        <br />
        <button @click.prevent="$emit('handle2fa',phone_number,otp)">
          Verify & Login
        </button>
        <p>Didn't received OTP? <strong>Send OTP</strong> again</p>
      </form>
    </div>
    <!-- register page -->
    <div class="card" v-else-if="register == true">
      <strong id="back" @click.prevent="back"> &#8249; </strong>
      <h2 v-if="forgetpw == true">Forget Password</h2>
      <h2 v-else>Register</h2>
      <form action="">
        <input
          v-model="phone_number"
          type="text"
          id="phone_number"
          placeholder="Phone Number"
          :class="{ 'has-error': loging_in_otp && invalidphone_number_otp }"
          @focus="clearstatus"
          @keypress="clearstatus"
        /><br />
        <p>Verify Phone Number via OTP</p>
        <button @click.prevent="handleregister">
          Enter
        </button>
      </form>
    </div>
    <!-- register to one time password page -->
    <div class="card" v-else-if="register_otp == true">
      <strong id="back" @click.prevent="back"> &#8249; </strong>
      <h2>Login via OTP</h2>
      <p>We send you a One Time Password <br />to your Phone Number via SMS</p>
      <form action="">
        <input
          v-model="phone_number"
          type="text"
          id="phone_number"
          placeholder="Phone Number"
          :class="{ 'has-error': loging_in_otp && invalidphone_number_otp }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />
        <button @click.prevent="sendotp">
          Resend OTP</button
        ><br />
        <input
          v-model="otp"
          type="text"
          id="otp"
          placeholder="One Time Password"
          :class="{ 'has-error': loging_in_otp && invalidotp }"
          @focus="clearstatus"
          @keypress="clearstatus"
          ref="first"
        />
        <br />
        <input
          v-model="password"
          type="text"
          id="password"
          placeholder="Password"
          :class="{ 'has-error': loging_in_otp && invalidpassword }"
          @focus="clearstatus"
          @keypress="clearstatus"
        /><br />
        <button @click.prevent="handleotp">
          Verify & Login
        </button>
        <p>Didn't received OTP? <strong>Send OTP</strong> again</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login_form",
  data() {
    return {
      signing_up: false,
      loging_in: false,
      success: false,
      error: false,
      register_otp: false,
      loging_in_otp: false,
      register: false,
      login_otp:false,
      forgetpw:false,
      phone_number: "",
      password: "",
      otp: "",
    };
  },
  methods: {
    handlelogin() {
      this.loging_in = true;
      if (this.invalidphone_number_login || this.invalidpassword_login) {
        this.error = true;
        alert("Enter username and password");
        return;
      } else {
        this.$emit("login", this.phone_number, this.password);
      }
    },
    async userotp() {

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "connect.sid=s%3A9ZCCTu10vRkP-58flVxctwh5ZK398sZ9.aUE9Qr7ozuEj1Djz%2BstettQL566xKmM%2B77E94vZF%2Byg");

      var urlencoded = new URLSearchParams();
      urlencoded.append("type", "getotp");
      urlencoded.append("mobile", this.phone_number);
      urlencoded.append("token", this.$store.state.frontend_token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      await fetch(this.$store.state.backend_api +"login", requestOptions)
        .then(response => response.text())
        .then(result => this.$store.commit('getotp_result',JSON.parse(result)))
        .catch(error => console.log('error', error));
      

      var response = this.$store.state.getotp_result;
      console.log(response.message);
      alert('one time password: '+ response.data.verifyCode)
      this.login_otp = true;
      this.clearstatus();
    },
    sendotp() {
      this.loging_in_otp = true;
      if (this.phone_number === "") {
        alert("fill in phone number");
      } else {
        alert("otp = 123456");
      }
    },
    async handleotp() {
      this.loging_in_otp = true;

      let token = this.$store.state.signup_result.data.token;
      
      var myHeaders = new Headers();
      
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Cookie", "connect.sid=s%3A829xHOM7bnJoNfrQu2bsIxxZd4_ajmK6.M0yKY%2F7H6hTJsQUcMB3QKtLVXeCpUToqEOAI%2FwVh3%2Fk");

      var urlencoded = new URLSearchParams();
      urlencoded.append("token", token);
      urlencoded.append("mobile", this.phone_number);
      urlencoded.append("otp", this.otp);
      urlencoded.append("password", this.password);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      await fetch(this.$store.state.backend_api+"saveuser", requestOptions)
        .then(response => response.text())
        .then(result => this.$store.commit('saveuser_result', JSON.parse(result)))
        .catch(error => console.log('error', error));

      var response = this.$store.state.saveuser_result
      console.log(response.message);
      this.$emit("testlogin", this.phone_number, this.password);
    },
    userregister() {
      this.register = true;
    },
    userforgetpw() {
      this.forgetpw = true;
      this.register = true;
    },
    async handleregister() {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append(
        "Cookie",
        "connect.sid=s%3Anc_caKSBWZ5ggwzlDp3ZN5nw8uigMoRc.p89j1G4CYzkCqXi4GGZjRsYNk6xmuBoQ0DTzA1jg24g"
      );

      var urlencoded = new URLSearchParams();
      urlencoded.append(
        "token",
        this.$store.state.frontend_token
      );
      urlencoded.append("mobile", this.phone_number);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      await fetch(
        this.$store.state.backend_api+"signup",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => this.$store.commit('signup_result', JSON.parse(result)))
        .catch((error) => console.log("error", error));
      
      console.log(this.$store.state.signup_result.message);

      var otp = this.$store.state.signup_result.data.verifyCode;
      alert("you received otp: " + otp);

      this.register = false;
      this.register_otp = true;
    },
    clearstatus() {
      this.success = false;
      this.error = false;
      this.loging_in = false;
    },
    back() {
      this.register_otp = false;
      this.register = false;
      this.login_otp = false;
    },
  },
  computed: {
    invalidphone_number_login() {
      return this.phone_number === "";
    },

    invalidpassword_login() {
      return this.password === "";
    },
    invalidphone_number_otp() {
      return this.phone_number === "";
    },

    invalidpassword() {
      return this.password === "";
    },

    invalidotp() {
      return this.otp === "";
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 761px) {
  img {
    display: none;
  }
}
.container {
  height: 90vh;
  text-align: center;
  max-width: unset;
  background-image: linear-gradient(120deg, #23395b, #c5d5ea);
  align-items: center;
  justify-content: center;
  display: flex;
}

.card {
  position: relative;
  width: 40vw;
  padding-bottom: 20px;
  background-color: whitesmoke;
  border-radius: 20px;
  font-size: 1vw;
}
.card h6 {
  padding: 0px;
  margin: 0px;
}
.card span {
  font-size: 1vw;
}
#forgetpw {
  cursor: pointer;
}
#register {
  cursor: pointer;
}

#forgetpw:hover,
#register:hover {
  text-decoration: underline;
}

p {
  margin: 0.5vh;
}
.card h2 {
  font-size: 2vw;
  margin: 0.5vh;
}

.container form input {
  max-width: 13em;
  left: calc(50% - 10em);
  border-radius: 20px;
  display: inline-block;
}

.container button {
  margin: 10px;
  width: 200px;
  border: none;
  border-radius: 20px;
}

.container button:focus {
  outline: none;
}

#back {
  position: absolute;
  top: 5px;
  left: 20px;
  cursor: pointer;
  font-size: 1.7rem;
}

@media screen and (max-width: 760px) {
  .card {
    width: 90vw;
    padding-bottom: 20px;
    background-color: whitesmoke;
    border-radius: 20px;
    font-size: 15px;
  }

  img {
    position: relative;
    width: 250px;
    background-color: whitesmoke;
    padding: 10px;
    margin-left: 30px;
  }

  .card h2 {
    font-size: 30px;
  }

  .card span {
    font-size: unset;
  }
}
</style>
