<template>
  <div class="login">
  </div>
</template>

<script>
export default {
  data(){
    return {
      login:this.$store.state.login
    }
  },
  mounted(){
    this.goto_accesspoint()
  },
  methods:{
    goto_accesspoint(){
      if(this.login == true){
        let url = "/accesspoint";
        this.$router.push(url);
      }
    },
  }
}
</script>

<style scoped></style>
