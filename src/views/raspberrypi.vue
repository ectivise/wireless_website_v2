<template>
  <div class="raspberrypi-overview">
    <div id="app" class="small-container">
      <h2>Raspberry Pi Overview</h2>
      <create_raspi_button @open:popupwindow="openpopupwindow" />
      <popup_window
        v-if="popupwindow"
        @add:raspberrypi="addraspberrypi"
        @close:popupwindow="closepopupwindow"
      />
      <!-- <accesspoint_form @add:accesspoint="addaccesspoint" /> -->
      <raspberrypi_table
        v-if="filtering"
        v-bind:raspberrypis_copy="raspberrypis_copy"
        v-bind:raspberrypis="filtered_raspberrypis"
        @delete:raspberrypi="deleteraspberrypi"
        @edit:raspberrypi="editraspberrypi"
        @filter:raspberrypi="filterraspberrypi"
      />
      <raspberrypi_table
        v-else
        v-bind:raspberrypis_copy="raspberrypis_copy"
        v-bind:raspberrypis="raspberrypis"
        @delete:raspberrypi="deleteraspberrypi"
        @edit:raspberrypi="editraspberrypi"
        @filter:raspberrypi="filterraspberrypi"
      />
    </div>
  </div>
</template>

<script>
import raspberrypi_table from "../components/raspberrypi_table.vue";
import create_raspi_button from "../components/create_raspi_button.vue"
import popup_window from "../components/raspberrypi_modal_popup.vue"

export default {
  name: "raspberrypi_overview",
  components: {
    raspberrypi_table,
    create_raspi_button,
    popup_window,
  },
  data() {
    return {
      popupwindow: false,
      filtering: false,
      filtered_raspberrypis: [],
      raspberrypis: [
        {
          raspi_id: "lg-m01",
          ip: "10.12.80.221",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
        {
          raspi_id: "lg-m02",
          ip: "10.12.80.222",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
        {
          raspi_id: "lg-m03",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
        {
          raspi_id: "lg-m04",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
      ],
      raspberrypis_copy: [
        {
          raspi_id: "lg-m01",
          ip: "10.12.80.221",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
        {
          raspi_id: "lg-m02",
          ip: "10.12.80.222",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
        {
          raspi_id: "lg-m03",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
        {
          raspi_id: "lg-m04",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 1,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [],
          user: "admin",
          password: "admin@123",
        },
      ],
    };
  },
  methods: {
    addraspberrypi(raspberrypi) {
      const lastId =
        this.raspberrypis.length > 0
          ? this.raspberrypis[this.raspberrypis.length - 1].raspi_id
          : 0;
      const id = lastId + 1;
      const newraspberrypi = { ...raspberrypi, id };
      this.raspberrypis = [...this.raspberrypis, newraspberrypi];
      this.popupwindow = false;
    },
    deleteraspberrypi(id) {
      this.raspberrypis = this.raspberrypis.filter(
        (raspberrypi) => raspberrypi.raspi_id !== id
      );
      this.filtered_raspberrypis = this.filtered_raspberrypis.filter(
        (raspberrypi) => raspberrypi.raspi_id !== id
      );
    },
    filterraspberrypi(building, level) {
      if (building == "nofilter" && level == "nofilter") {
        this.filtering = false;
      } else if (building !== "nofilter" && level !== "nofilter") {
        this.filtering = true;
        this.filtered_raspberrypis = this.raspberrypis.filter(
          (raspberrypi) =>
            raspberrypi.location.building == building &&
            raspberrypi.location.level == level
        );
      } else if (building !== "nofilter" && level == "nofilter") {
        this.filtering = true;
        this.filtered_raspberrypis = this.raspberrypis.filter(
          (raspberrypi) => raspberrypi.location.building == building
        );
      } else if (building == "nofilter" && level !== "nofilter") {
        this.filtering = true;
        this.filtered_raspberrypis = this.raspberrypis.filter(
          (raspberrypi) => raspberrypi.location.level == level
        );
      }
    },
    editraspberrypi(id, updatedraspberrypi) {
      this.raspberrypis = this.raspberrypis.map((raspberrypi) =>
        raspberrypi.raspi_id === id ? updatedraspberrypi : raspberrypi
      );
      this.raspberrypis_copy = this.raspberrypis;
    },
    openpopupwindow() {
      this.popupwindow = true;
    },
    closepopupwindow() {
      this.popupwindow = false;
    },
  },
};
</script>

<style scoped>
.small-container {
  margin: 0px
}
</style>
