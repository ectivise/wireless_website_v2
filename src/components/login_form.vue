<template>
  <div class="container">
    <img src="@/assets/legrovelogo.png" alt="Le Grove Logo" />
    <!-- login page -->
    <div class="card" v-if="login_otp == false && register == false">
      <div class="sign-in">
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
        <strong id="forgetpw">Forget Password?</strong>
        <p>
          Not Registered?
          <strong id="register" @click.prevent="userregister">Register</strong>
        </p>
      </span>
    </div>
    <!-- one time password page -->
    <div class="card" v-else-if="login_otp == true">
      <strong id="back" @click.prevent="back"> &#8249; </strong>
      <h2>Login via OTP</h2>
      <p>
        We will send you a One Time Password <br />to your Phone Number via SMS
      </p>
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
          Send OTP</button
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
        <button @click.prevent="handleotp">
          Enter
        </button>
        <p>Didn't received OTP? <strong>Send OTP</strong> again</p>
      </form>
    </div>
    <!-- register page -->
    <div class="card" v-else-if="register == true">
      <strong id="back" @click.prevent="back"> &#8249; </strong>
      <h2>Register</h2>
      <form action="">
        <input
          v-model="phone_number"
          type="text"
          id="phone_number"
          placeholder="Phone Number"
          :class="{ 'has-error': loging_in_otp && invalidphone_number_otp }"
          @focus="clearstatus"
          @keypress="clearstatus"
        /><br>
        <input
          v-model="password"
          type="text"
          id="password"
          placeholder="Password"
          :class="{ 'has-error': loging_in_otp && invalidpassword }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />
        <p> Verify Phone Number with OTP</p>
        <button @click.prevent="handleregister">
          Verify
        </button>
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
      login_otp: false,
      loging_in_otp: false,
      register: false,
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
    handlesignup() {
      this.signing_up = true;
      if (this.invalidusername || this.invalidpassword || this.invalidtype) {
        this.error = true;
        alert("fill in username, password and choose a type");
        return;
      } else {
        this.$emit("signup", this.user);
      }
    },
    userotp() {
      this.login_otp = true;
      this.clearstatus();
    },
    sendotp() {
      this.loging_in_otp;
      if (this.phone_number === "") {
        alert("fill in phone number");
      } else {
        alert("otp = 123456");
      }
    },
    handleotp() {
      this.loging_in_otp;
      if (this.otp == "") {
        alert("fill in otp");
      } else {
        this.$emit("login_otp", this.otp);
      }
    },
    userregister() {
      this.register = true;
    },
    handleregister() {
      this.register = false;
      this.login_otp = true;
    },
    clearstatus() {
      this.success = false;
      this.error = false;
      this.loging_in = false;
    },
    back() {
      this.login_otp = false;
      this.register = false;
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
      return this.user.password === "";
    },

    invalidotp() {
      return this.otp === "";
    },
  },
};
</script>

<style scoped>
img {
  position: absolute;
  width: 180px;
  top: 5px;
  left: 5px;
  background-color: whitesmoke;
  padding: 10px;
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

  .card h2 {
    font-size: 30px;
  }
}
</style>
