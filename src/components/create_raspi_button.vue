<template>
  <div>
    <button id="create-button" @click.prevent="$emit('open:popupwindow')">Create New Raspberry Pi</button>
  </div>
</template>

<script>
export default {
  name: "create_raspi_button",
};
</script>

<style scoped>
#create-button{
  margin: 0 0.5rem 0 0;  
  background: #009435;
  border: 1px solid #009435;
}
</style>
