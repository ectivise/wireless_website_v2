<template>
  <div class="raspberrypi-overview">
    <div id="app" class="small-container">
      
      <span>
        <button @click.prevent="$emit('logout')" id="logout">Log out</button>
      </span>
      <h2>Le Grove Serviced Residences</h2>
      <img src="@/assets/legrovelogo.png" alt="Le Grove Logo">
      <create_raspi_button @open:popupwindow="openpopupwindow"/>
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
        @filter:status="filterstatus"
      />
      <raspberrypi_table
        v-else
        v-bind:raspberrypis_copy="raspberrypis_copy"
        v-bind:raspberrypis="raspberrypis"
        @delete:raspberrypi="deleteraspberrypi"
        @edit:raspberrypi="editraspberrypi"
        @filter:raspberrypi="filterraspberrypi"
        @filter:status="filterstatus"
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
  computed: {
    status_summary(){
      var status = [];
      var normal = 0,warning = 0, critical = 0;

      for(let i =0; i < this.raspberrypis.length;i++){
        if(this.raspberrypis[i].status == 0){
          normal++;
        }else if(this.raspberrypis[i].status == 1){
          warning++;
        }
        else{
          critical++;
        }
      }

      status = [normal,warning,critical];

      return status;
    },
  },
  data() {
    return {
      popupwindow: false,
      filtering: false,
      filtered_raspberrypis: [],
      user_type:this.$store.state.user_type,
      raspberrypis: [
        {
          raspi_id: "iot-lg-m01",
          ip: "10.12.80.221",
          password2: "abcd-1324",
          status: 0,
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
          raspi_id: "iot-lg-m02",
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
          raspi_id: "iot-lg-m03",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 2,
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
          raspi_id: "iot-lg-m04",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 0,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [17,30,40,48,55,91,94,104,111,168,206,274,283],
          user: "admin",
          password: "admin@123",
        },
      ],
      raspberrypis_copy: [
        {
          raspi_id: "iot-lg-m01",
          ip: "10.12.80.221",
          password2: "abcd-1324",
          status: 0,
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
          raspi_id: "iot-lg-m02",
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
          raspi_id: "iot-lg-m03",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 2,
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
          raspi_id: "iot-lg-m04",
          ip: "10.12.80.223",
          password2: "abcd-1324",
          status: 0,
          location: {
            site: "le grove",
            building: "tower a",
            level: "1",
          },
          runtime: 8437490,
          aplist: [17,30,40,48,55,91,94,104,111,168,206,274,283],
          user: "admin",
          password: "admin@123",
        },
      ],
    };
  },
  methods: {
    // async get_aplist() {
    //   try {
    //     var urlencoded = new URLSearchParams();
    //     urlencoded.append(
    //       "token",
    //       "ectivisecloudDBAuthCode:b84846daf467cede0ee462d04bcd0ade"
    //     );

    //     const response = await fetch(
    //       "http://dev1.ectivisecloud.com:8081/api/speedtest/getaplist",
    //       {
    //         method: "POST",
    //         body: urlencoded,
    //         headers: { "Content-type": "application/x-www-form-urlencoded" },
    //       }
    //     );

    //     const data = await response.json();
    //     this.access_points = data.data;

    //     this.access_points.sort(function(a, b) {
    //       return a["device_id"] - b["device_id"];
    //     });
    //     this.access_points_copy = data.data;
    //     // console.log(data.data)
    //   } catch (error) {
    //     console.error(error.message);
    //   }
    // },
    addraspberrypi(raspberrypi) {
      const lastId =
        this.raspberrypis.length > 0
          ? this.raspberrypis[this.raspberrypis.length - 1].raspi_id
          : 0;
      const id = lastId + 1;
      const newraspberrypi = { ...raspberrypi, id };
      this.raspberrypis = [...this.raspberrypis, newraspberrypi];
      this.raspberrypis_copy = [...this.raspberrypis_copy, newraspberrypi];
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
    filterstatus(status) {
      this.filtering = true;
      this.filtered_raspberrypis = this.raspberrypis.filter(
        (raspberrypi) => raspberrypi.status == status
      );
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
img{
  position: absolute;
  width: 180px;
  top: 5px;
  left: 5px;
  background-color: whitesmoke;
  padding:10px;
}

.small-container {
  margin: 0px;
  max-width: unset;
}

.small-container h2{
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
  img{
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
