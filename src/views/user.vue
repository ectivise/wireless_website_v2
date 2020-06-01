<template>
<div class='container'>
  <span>
        <button @click.prevent="$emit('logout')" id="logout">Log out</button>
  </span>
  <user_table/>
</div>
  
</template>

<script>
import user_table from "../components/user_table.vue"

export default {
  name: 'user_overview',
  components:{
    user_table,
  },
  data(){
    return{
      users:this.$store.state.users,
    }
  }
}
</script>

<style scoped>
span button{
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>