<template>
  <div class="accesspoint-overview">
    <div id="app" class="small-container">
      <span>
        <button @click.prevent="$emit('logout')" id="logout">Log out</button>
      </span>
      <img src="@/assets/legrovelogo.png" alt="Le Grove Logo" />
      <create_ap_button
        @open:popupwindow="openpopupwindow"
        v-if="user_type == 'admin'"
      />
      <popup_window
        v-if="popupwindow"
        @add:accesspoint="addaccesspoint"
        @close:popupwindow="closepopupwindow"
      />
      <accesspoint_filter
        v-bind:access_points_copy="access_points_copy"
        v-bind:access_points="access_points"
        @filter:status="filterstatus"
      />
      <accesspoint_table
        v-bind:access_points_copy="access_points_copy"
        v-bind:access_points="access_points"
        @delete:accesspoint="deleteaccesspoint"
        @edit:accesspoint="editaccesspoint"
        @manage:accesspoint="manageaccesspoint"
      />
    </div>
  </div>
</template>

<script>
import create_ap_button from "@/components/create_ap_button";
import accesspoint_table from "@/components/accesspoint_table.vue";
import popup_window from "@/components/accesspoint_modal_popup.vue";
import accesspoint_filter from "@/components/accesspoint_filter.vue";

export default {
  name: "accesspoint_overview",
  components: {
    create_ap_button,
    accesspoint_table,
    popup_window,
    accesspoint_filter,
  },
  data() {
    return {
      popupwindow: false,
      user_type: this.$store.state.user_type,
      filtered_access_points: [],
      access_points: [],
      // take a copy of the access_points_array so that the options will not change
      access_points_copy: [],
    };
  },
  computed: {
    getuser_type() {
      var user_type = this.$store.user_type;
      return user_type;
    },
  },
  created() {
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
          this.$store.state.backend_api+"speedtest/getaplist",
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
        console.error(error.message);
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
      this.access_points_copy = [...this.access_points_copy, newaccess_point];
      this.popupwindow = false;
    },
    deleteaccesspoint(id) {
      this.access_points = this.access_points.filter(
        (access_point) => access_point.device_id !== id
      );
      // filtered side also delete
      this.filtered_access_points = this.filtered_access_points.filter(
        (access_point) => access_point.device_id !== id
      );
    },
    // filteraccesspoint(raspi_id, building, level) {
    //   switch (level) {
    //     case "B1":
    //       level = -1;
    //       break;
    //     case "L1":
    //       level = 1;
    //       break;
    //     case "L2":
    //       level = 2;
    //       break;
    //     case "L3":
    //       level = 3;
    //       break;
    //     case "L4":
    //       level = 4;
    //       break;
    //     case "L5":
    //       level = 5;
    //       break;
    //     case "L6":
    //       level = 6;
    //       break;
    //     case "L7":
    //       level = 7;
    //       break;
    //     case "L8":
    //       level = 8;
    //       break;
    //     case "L9":
    //       level = 9;
    //       break;
    //     case "L10":
    //       level = 10;
    //       break;
    //   }

    //   if (raspi_id == "nofilter") {
    //     if (building == "nofilter" && level == "nofilter") {
    //       this.filtering = false;
    //     } else if (building !== "nofilter" && level !== "nofilter") {
    //       this.filtering = true;
    //       this.filtered_access_points = this.access_points.filter(
    //         (access_point) =>
    //           access_point.location.building == building &&
    //           access_point.location.level == level
    //       );
    //     } else if (building !== "nofilter" && level == "nofilter") {
    //       this.filtering = true;
    //       this.filtered_access_points = this.access_points.filter(
    //         (access_point) => access_point.location.building == building
    //       );
    //     } else if (building == "nofilter" && level !== "nofilter") {
    //       this.filtering = true;
    //       this.filtered_access_points = this.access_points.filter(
    //         (access_point) => access_point.location.level == level
    //       );
    //     }
    //   } else {
    //     if (building == "nofilter" && level == "nofilter") {
    //       this.filtering = true;
    //       this.filtered_access_points = this.access_points.filter(
    //         (access_point) => access_point.raspi == raspi_id
    //       );
    //     } else if (building !== "nofilter" && level !== "nofilter") {
    //       this.filtering = true;
    //       this.filtered_access_points = this.access_points.filter(
    //         (access_point) =>
    //           access_point.location.building == building &&
    //           access_point.location.level == level &&
    //           access_point.raspi == raspi_id
    //       );
    //     } else if (building !== "nofilter" && level == "nofilter") {
    //       this.filtering = true;
    //       this.filtered_access_points = this.access_points.filter(
    //         (access_point) =>
    //           access_point.location.building == building &&
    //           access_point.raspi == raspi_id
    //       );
    //     } else if (building == "nofilter" && level !== "nofilter") {
    //       this.filtering = true;
    //       this.filtered_access_points = this.access_points.filter(
    //         (access_point) =>
    //           access_point.location.level == level &&
    //           access_point.raspi == raspi_id
    //       );
    //     }
    //   }
    // },
    editaccesspoint(id, updatedaccesspoint) {
      this.access_points = this.access_points.map((access_point) =>
        access_point.device_id === id ? updatedaccesspoint : access_point
      );
      this.access_points_copy = this.access_points;
    },
    manageaccesspoint(id) {
      this.filtering = true;
      this.filtered_access_points = this.access_points.filter(
        (access_point) => access_point.raspi == id
      );
      console.log(id);
    },
    filterstatus(status) {
      if (this.filtering == true) {
        this.filtered_access_points = this.filtered_access_points.filter(
          (access_point) => access_point.status == status
        );
      } else if (this.filtering == false) {
        this.filtering = true;
        this.filtered_access_points = this.access_points.filter(
          (access_point) => access_point.status == status
        );
      }
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
img {
  position: absolute;
  width: 180px;
  top: 10px;
  left: 10px;
  background-color: whitesmoke;
  padding: 10px;
}

.small-container {
  margin: 0px;
  max-width: unset;
}
.small-container h2 {
  text-align: center;
}

@media screen and (min-width: 761px) {
  span button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  #logout {
    font-size: 1vw;
  }
}

@media screen and (max-width: 760px) {
  img {
    display: none;
  }

  #logout {
    top: 10px;
    position: relative;
    display: block;
    font-size: unset;
    width: 90vw;
  }
}
</style>
