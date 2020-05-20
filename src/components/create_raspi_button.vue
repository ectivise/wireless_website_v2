<template>
  <div>
    <button @click.prevent="$emit('open:popupwindow')">Create New Raspberry Pi</button>
  </div>
</template>

<script>
export default {
  name: "create_raspi_button",
};
</script>

<style></style>
