<template>
  <div class="accesspoint-overview">
    <div id="app" class="small-container">
      <h2>Access Points Overview</h2>
      <create_ap_button @open:popupwindow="openpopupwindow" />
      <popup_window
        v-if="popupwindow"
        @add:accesspoint="addaccesspoint"
        @close:popupwindow="closepopupwindow"
      />
      <!-- <accesspoint_form @add:accesspoint="addaccesspoint" /> -->
      <accesspoint_table
        v-if="filtering"
        v-bind:access_points_copy="access_points_copy"
        v-bind:access_points="filtered_access_points"
        @delete:accesspoint="deleteaccesspoint"
        @edit:accesspoint="editaccesspoint"
        @filter:accesspoint="filteraccesspoint"
      />
      <accesspoint_table
        v-else
        v-bind:access_points_copy="access_points_copy"
        v-bind:access_points="access_points"
        @delete:accesspoint="deleteaccesspoint"
        @edit:accesspoint="editaccesspoint"
        @filter:accesspoint="filteraccesspoint"
      />
    </div>
  </div>
</template>

<script>
import create_ap_button from "@/components/create_ap_button";
import accesspoint_table from "@/components/accesspoint_table.vue";
// import accesspoint_form from "./components/accesspoint_form.vue";
import popup_window from "@/components/accesspoint_modal_popup.vue";

export default {
  name: "accesspoint_overview",
  components: {
    create_ap_button,
    accesspoint_table,
    popup_window,
  },
  data() {
    return {
      popupwindow: false,
      filtering: false,
      filtered_access_points: [],
      access_points: [],
      // take a copy of the access_points_array so that the options will not change
      access_points_copy: [],
    };
  },
  mounted() {
    this.get_aplist();
  },
  methods: {
    async get_aplist() {
      try {
        var urlencoded = new URLSearchParams();
        urlencoded.append(
          "token",
          "ectivisecloudDBAuthCode:b84846daf467cede0ee462d04bcd0ade"
        );

        const response = await fetch(
          "http://dev1.ectivisecloud.com:8081/api/speedtest/getaplist",
          {
            method: "POST",
            body: urlencoded,
            headers: { "Content-type": "application/x-www-form-urlencoded" },
          }
        );

        const data = await response.json();
        this.access_points = data.data;

        this.access_points.sort(function(a, b) {
          return a["device_id"] - b["device_id"];
        });
        this.access_points_copy = data.data;
        // console.log(data.data)
      } catch (error) {
        console.error(error);
      }
    },
    addaccesspoint(access_point) {
      const lastId =
        this.access_points.length > 0
          ? this.access_points[this.access_points.length - 1].device_id
          : 0;
      const id = lastId + 1;
      const newaccess_point = { ...access_point, id };
      this.access_points = [...this.access_points, newaccess_point];
      this.popupwindow = false;
    },
    deleteaccesspoint(id) {
      this.access_points = this.access_points.filter(
        (access_point) => access_point.device_id !== id
      );
      // update to copy
      this.filtered_access_points = this.access_points;
    },
    filteraccesspoint(building, level) {
      if (building == "nofilter" && level == "nofilter") {
        this.filtering = false;
      } else if (building !== "nofilter" && level !== "nofilter") {
        this.filtering = true;
        this.filtered_access_points = this.access_points.filter(
          (access_point) =>
            access_point.location.building == building &&
            access_point.location.level == level
        );
      } else if (building !== "nofilter" && level == "nofilter") {
        this.filtering = true;
        this.filtered_access_points = this.access_points.filter(
          (access_point) => access_point.location.building == building
        );
      } else if (building == "nofilter" && level !== "nofilter") {
        this.filtering = true;
        this.filtered_access_points = this.access_points.filter(
          (access_point) => access_point.location.level == level
        );
      }
    },
    editaccesspoint(id, updatedaccesspoint) {
      this.access_points = this.access_points.map((access_point) =>
        access_point.device_id === id ? updatedaccesspoint : access_point
      );
      this.access_points_copy = this.access_points;
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
