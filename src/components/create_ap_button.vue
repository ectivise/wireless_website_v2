<template>
  <div>
    <button @click.prevent="$emit('open:popupwindow')">Create New Access Point</button>
  </div>
</template>

<script>
export default {
  name: "create_ap_button",
};
</script>

<style></style>
