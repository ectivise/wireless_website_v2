<template>
  <div class="container">
    <h2>Sign in</h2>
    <form action="">
      <!-- look for id -->
      <label for="username">Username:</label>
      <input
        v-model="username"
        type="text"
        id="username"
        placeholder="Enter username"
      />
      <label for="password">Password:</label>
      <input
        v-model="password"
        type="text"
        id="password"
        placeholder="Enter password"
      />
      <button @click.prevent="$emit('login', username, password)">
        Log In
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "login_form",
  data() {
    return {
      username: "",
      password: "",
    };
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin: auto;
}

.container form {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container form label {
  font-size: 30px;
}

.container form input {
  max-width: 200px;
  position: relative;
}
</style>
