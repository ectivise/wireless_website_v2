<template>
  <div class="container">
    <div class="card">
      <div class="sign-in">
        <h2>Sign In</h2>
        <form action="">
          <!-- look for id -->
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Phone Number"
            :class="{ 'has-error': loging_in && invalidphone_number_login }"
            @focus="clearstatus"
            @keypress="clearstatus"
            ref="first"
          />
          <br>
          <input
            v-model="password"
            type="text"
            id="password"
            placeholder="password"
            :class="{ 'has-error': loging_in && invalidpassword_login }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          
          <p>One time Password</p>
          <button @click.prevent="handlelogin">
            Log In
          </button>
        </form>
      </div>
      <p>Forget Password</p>
      <div class="sign-up">
        <h2>Register</h2>
        <form action="">
          <!-- look for id -->
          <input
            v-model="user.phone_number"
            type="text"
            id="phone_number"
            placeholder="Phone Number"
            :class="{ 'has-error': signing_up && invalidphone_number }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <br>
          <input
            v-model="user.password"
            type="text"
            id="password"
            placeholder="Password"
            :class="{ 'has-error': signing_up && invalidpassword }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <br>
          <button @click.prevent="handlesignup">
            Sign up
          </button>
        </form>
      </div>
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
      user: {
        phone_number: "",
        password: "",
      },
      username: "",
      password: "",
    };
  },
  methods: {
    handlelogin() {
      this.loging_in = true;
      if (this.invalidusername_login || this.invalidpassword_login) {
        this.error = true;
        alert("Enter username and password");
        return;
      } else {
        this.$emit("login", this.username, this.password);
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
    clearstatus() {
      this.success = false;
      this.error = false;
    },
  },
  computed: {
    invalidusername_login() {
      return this.username === "";
    },

    invalidpassword_login() {
      return this.password === "";
    },
    invalidphone_number() {
      return this.user.username === "";
    },

    invalidpassword() {
      return this.user.password === "";
    },

    invalidtype() {
      return this.user.type === "";
    },
  },
};
</script>

<style scoped>
.container {
  height: 90vh;
  text-align: center;
  max-width: unset;
  background-image: linear-gradient(120deg,#23395B,#C5D5EA);
  align-items: center;
  justify-content: center;
  display: flex;
}

.card {
  width: 40vw;
  padding-bottom: 20px;
  background-color: whitesmoke;
  border-radius: 20px;
  font-size: 1vw;
}

p{
  margin: 0.5vh;
}
.card h2{
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

@media screen and (max-width: 760px) {
  .card {
  width: 90vw;
  padding-bottom: 20px;
  background-color: whitesmoke;
  border-radius: 20px;
  font-size: 15px;
}

.card h2{
  font-size: 30px;
}
}
</style>
