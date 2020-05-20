<template>
  <div id="app">
    <header>
      <h1>Ectivise Wireless Monitor</h1>
      <div id="nav">
        <router-link to="/accesspoint">Access Point</router-link> |
        <router-link to="/raspberrypi">Raspberry Pi</router-link>
      </div>
    </header>
    <router-view />
  </div>
</template>

<style scoped>
*{
  margin: 0;
}

header {
  position: relative;
  padding: 20px;
  text-align: center;
  background-color: #8EE4AF;
}
#app {
  /* remove website default margins and padding */
  margin: 0px;
  padding: 0px;
  max-width: 100%;
}

#nav {
  /* padding: 20px; */
}

#nav a {
  font-weight: bold;
  font-size: 30px;
  color: #05386B;
}

#nav a.router-link-exact-active {
  color: #379683;
}
</style>
