<template>
  <div id="app" class="small-container">
    <h1>Access Points:</h1>
    <accesspoint_form @add:accesspoint="addaccesspoint" />
    <accesspoint_table
      v-bind:access_points="access_points"
      @delete:accesspoint="deleteaccesspoint"
      @edit:accesspoint="editaccesspoint"
    />
  </div>
</template>

<script>
import accesspoint_table from "./components/accesspoint_table.vue";
import accesspoint_form from "./components/accesspoint_form.vue";

export default {
  name: "App",
  components: {
    accesspoint_table,
    accesspoint_form,
  },
  data() {
    return {
      access_points: [
        {
          id: 1,
          ssid: "wifi1",
          location: "level1",
          ping: "ping1",
          download: "download1",
          upload: "upload1",
          runtime: "runtime1",
        },
        {
          id: 2,
          ssid: "wifi2",
          location: "level1",
          ping: "ping2",
          download: "download2",
          upload: "upload2",
          runtime: "runtime2",
        },
        {
          id: 3,
          ssid: "wifi3",
          location: "level1",
          ping: "ping3",
          download: "download3",
          upload: "upload3",
          runtime: "runtime3",
        },
        {
          id: 4,
          ssid: "wifi4",
          location: "level2",
          ping: "ping4",
          download: "download4",
          upload: "upload4",
          runtime: "runtime4",
        },
        {
          id: 5,
          ssid: "wifi5",
          location: "level2",
          ping: "ping5",
          download: "download5",
          upload: "upload5",
          runtime: "runtime5",
        },
        {
          id: 6,
          ssid: "wifi6",
          location: "level2",
          ping: "ping6",
          download: "download6",
          upload: "upload6",
          runtime: "runtime6",
        },
        {
          id: 7,
          ssid: "wifi7",
          location: "level2",
          ping: "ping7",
          download: "download7",
          upload: "upload7",
          runtime: "runtime7",
        },
      ],
    };
  },
  methods: {
    addaccesspoint(access_point) {
      const lastId =
        this.access_points.length > 0
          ? this.access_points[this.access_points.length - 1].id
          : 0;
      const id = lastId + 1;
      const newaccess_point = { ...access_point, id };
      this.access_points = [...this.access_points, newaccess_point];
    },
    deleteaccesspoint(id) {
      this.access_points = this.access_points.filter(
        (access_point) => access_point.id !== id
      );
    },
    editEmployee(id, updatedaccesspoint) {
    this.access_points = this.access_points.map(access_point =>
    access_point.id === id ? updatedaccesspoint : access_point
  )
}

  },
};
</script>

<style>
button {
  background: #009435;
  border: 1px solid #009435;
}

.small-container {
  max-width: 680px;
}
</style>
