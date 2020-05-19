<template>
  <div id="app">
    <h1>Ectivise Wireless Monitor</h1>
    <div id="nav">
      <router-link to="/accesspoint">Access Point</router-link> |
      <router-link to="/raspberrypi">Raspberry Pi</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#nav {
  padding: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
