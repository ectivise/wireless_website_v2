<template>
  <div>
    <button id="create-button" @click.prevent="$emit('open:popupwindow')">Create New Access Point</button>
  </div>
</template>

<script>
export default {
  name: "create_ap_button",
};
</script>

<style scoped>

button:focus{
  outline: none;
}

#create-button{
  margin: 0 0.5rem 0 0;  
  background: #009435;
  border: 1px solid #009435;
}

@media screen and (max-width: 760px){
  button {
  display: block;
}
}
</style>
