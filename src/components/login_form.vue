<template>
  <div class="container">
    <div class="sign-in">
      <h2>Sign In</h2>
      <form action="">
        <!-- look for id -->
        <label for="username">Username:</label>
        <input
          v-model="username"
          type="text"
          id="username"
          placeholder="Enter username"
          :class="{ 'has-error': loging_in && invalidusername_login }"
          @focus="clearstatus"
          @keypress="clearstatus"
          ref="first"
        />
        <label for="password">Password:</label>
        <input
          v-model="password"
          type="text"
          id="password"
          placeholder="Enter password"
          :class="{ 'has-error': loging_in && invalidpassword_login }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />
        <button @click.prevent="handlelogin">
          Log In
        </button>
      </form>
    </div>
    <div class="sign-up">
      <h2>Sign Up</h2>
      <form action="">
        <!-- look for id -->
        <label for="username">Username:</label>
        <input
          v-model="user.username"
          type="text"
          id="username"
          placeholder="Enter username"
          :class="{ 'has-error': signing_up && invalidusername }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />
        <label for="password">Password:</label>
        <input
          v-model="user.password"
          type="text"
          id="password"
          placeholder="Enter password"
          :class="{ 'has-error': signing_up && invalidpassword }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />

        <input
          v-model="user.type"
          type="radio"
          id="admin"
          value="admin"
          :class="{ 'has-error': signing_up && invalidtype }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />
        <label for="admin">Admin</label>
        <input
          v-model="user.type"
          type="radio"
          id="operator"
          value="operator"
          :class="{ 'has-error': signing_up && invalidtype }"
          @focus="clearstatus"
          @keypress="clearstatus"
        />
        <label for="operator">Operator</label><br />

        <button @click.prevent="handlesignup">
          Sign up
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
      user: {
        username: "",
        password: "",
        type: "",
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
        alert("fill in username and password")
        return;
      } else{
          this.$emit("login", this.username, this.password);
      }
    },
    handlesignup() {
        this.signing_up = true;
        if (this.invalidusername || this.invalidpassword || this.invalidtype) {
        this.error = true;
        alert("fill in username, password and choose a type")
        return;
        } else {
            this.$emit('signup', this.user)
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
    invalidusername() {
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
#admin,
#operator {
  margin: 10px;
}

.container form label {
  font-size: 20px;
  display: inline;
}

.container form input {
  max-width: 200px;
}

.container button {
  margin: 10px;
}
</style>
