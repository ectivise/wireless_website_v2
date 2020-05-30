<template>
  <div id="accesspoint_table">
    <table>
      <thead>
        <tr>
          <th id="deviceid-col" v-if="usertype == 'admin'">Device ID</th>
          <th id="ap-col">AP</th>
          <th id="password-col" v-if="usertype == 'admin'">Password</th>
          <th id="ip-col" v-if="usertype == 'admin'">IP</th>
          <th id="building-col">Building</th>
          <th id="storey-col">Storey</th>
          <th id="status-col">Status</th>
          <th id="runtime-col">Runtime</th>
          <th id="raspi-col" v-if="usertype == 'admin'">Raspi ID</th>
          <th id="ping-col">Ping (ms)</th>
          <th id="upload-col">Upload (mb/s)</th>
          <th id="download-col">Download (mb/s)</th>
          <th id="jitter-col">Jitter (ms)</th>
          <th id="action-col" v-if="usertype == 'admin'">Actions</th>
        </tr>
      </thead>

      <!-- table body -->
      <tbody>
        <p v-if="newaccesspoint.length < 1" class="empty-table">
          No Access Points
        </p>
        <!-- database UUID -->
        <tr
          v-else
          v-for="(access_point, index) in newaccesspoint"
          :key="index"
          :class="usertype == 'admin' ? 'admin' : 'operator'"
        >
          <!-- ap col-->
          <td v-if="usertype == 'admin'">{{ access_point.device_id }}</td>
          <!-- ssid col-->
          <td>{{ access_point.ssid }}</td>
          <!-- password col -->
          <td v-if="editing == access_point.device_id && usertype == 'admin'">
            <input type="text" v-model="access_point.password" />
          </td>
          <td v-else-if="usertype == 'admin'">{{ access_point.password }}</td>
          <!-- ip col -->
          <td v-if="usertype == 'admin'">{{ access_point.ip }}</td>
          <!-- building col -->
          <td>{{ access_point.location.building }}</td>
          <!-- level col -->
          <td>{{ convertstorey[index] }}</td>
          <!-- status col -->
          <td>
            <div class="square">
              <div v-if="access_point.status == 0" id="square-green"></div>
              <div v-if="access_point.status == 1" id="square-yellow"></div>
              <div v-if="access_point.status == 2" id="square-red"></div>
            </div>
          </td>
          <!-- runtime col -->
          <td>{{ convertruntime[index] }}</td>
          <!-- iotdevice col -->
          <td v-if="editing == access_point.device_id && usertype == 'admin'">
            <input type="text" v-model="access_point.raspi" />
          </td>
          <td v-else-if="usertype == 'admin'">{{ access_point.raspi }}</td>
          <!-- Ping col -->
          <td>{{ access_point.last_speedtest.ping }}</td>
          <!-- upload col -->
          <td>{{ access_point.last_speedtest.upload }}</td>
          <!-- download col -->
          <td>{{ access_point.last_speedtest.download }}</td>
          <!-- jitter col -->
          <td>{{ access_point.last_speedtest.jitter }}</td>
          <!-- editing and delete buttons -->
          <td
            v-if="editing == access_point.device_id && usertype == 'admin'"
            class="last-td"
          >
            <button @click="editaccesspoint(access_point)">Save</button>
            <button class="muted-button" @click="canceledit(access_point)">
              Cancel
            </button>
          </td>
          <td v-else-if="usertype == 'admin'" class="last-td">
            <button id="edit" @click="editmode(access_point)">Edit</button>
            <button
              id="delete"
              @click="$emit('delete:accesspoint', access_point.device_id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "accesspoint_table",
  props: {
    access_points: Array,
    // take a copy of the access_points_array so that the options will not change
    access_points_copy: Array,
  },
  data() {
    return {
      filter_error: false,
      editing: null,
      raspi_id: this.$route.params.raspi_id,
      usertype: this.$store.state.user_type,
    };
  },
  mounted() {
    this.manageaccesspoint();
  },
  computed: {
    newaccesspoint(){
      let raspi_id = this.$store.state.filterraspi_id;
      let building = this.$store.state.filterbuilding;
      let level = this.$store.state.filterlevel;
      let status = this.$store.state.filterstatus;
      let filtered_access_points = [...this.access_points];

      switch (level) {
        case "B1":
          level = -1;
          break;
        case "L1":
          level = 1;
          break;
        case "L2":
          level = 2;
          break;
        case "L3":
          level = 3;
          break;
        case "L4":
          level = 4;
          break;
        case "L5":
          level = 5;
          break;
        case "L6":
          level = 6;
          break;
        case "L7":
          level = 7;
          break;
        case "L8":
          level = 8;
          break;
        case "L9":
          level = 9;
          break;
        case "L10":
          level = 10;
          break;
      }

      if(raspi_id !== 'nofilter'){
        filtered_access_points = filtered_access_points.filter(
            (access_point) =>
              access_point.raspi == raspi_id
          );
      }

      if(building !== 'nofilter'){
        filtered_access_points = filtered_access_points.filter(
            (access_point) =>
              access_point.location.building == building
          );
      }
      if(level !== 'nofilter'){
        filtered_access_points = filtered_access_points.filter(
            (access_point) =>
              access_point.location.level == level
          );
      }
      if(status !== ''){
        filtered_access_points = filtered_access_points.filter(
            (access_point) =>
              access_point.status == status
          );
      }
      
      return filtered_access_points;
    },
    convertruntime() {
      const converted_runtime = [];
      var array_timestmp = [];
      for (let i = 0; i < this.access_points.length; i++) {
        array_timestmp.push(this.access_points[i].runtime);
      }
      for (let i = 0; i < array_timestmp.length; i++) {
        var days = Math.floor(array_timestmp[i] / (3600 * 24));
        array_timestmp[i] = array_timestmp[i] - days * (3600 * 24);
        var hours = Math.floor(array_timestmp[i] / 3600);
        array_timestmp[i] = array_timestmp[i] - hours * 3600;
        // var minutes = Math.floor(array_timestmp[i] / 60);
        // var seconds = array_timestmp[i] - (minutes * 60);

        var time = days + " days " + hours + " hrs";
        // console.log(time);
        converted_runtime[i] = time;
      }
      return converted_runtime;
    },
    convertstorey() {
      var array_storey = [];
      var converted_storey = [];
      for (let i = 0; i < this.access_points.length; i++) {
        array_storey.push(this.access_points[i].location.level);
      }
      for (let i = 0; i < array_storey.length; i++) {
        switch (array_storey[i]) {
          case "1":
            converted_storey[i] = "L1";
            break;
          case "2":
            converted_storey[i] = "L2";
            break;
          case "3":
            converted_storey[i] = "L3";
            break;
          case "4":
            converted_storey[i] = "L4";
            break;
          case "5":
            converted_storey[i] = "L5";
            break;
          case "6":
            converted_storey[i] = "L6";
            break;
          case "7":
            converted_storey[i] = "L7";
            break;
          case "8":
            converted_storey[i] = "L8";
            break;
          case "9":
            converted_storey[i] = "L9";
            break;
          case "10":
            converted_storey[i] = "L10";
            break;
          case "-1":
            converted_storey[i] = "B1";
            break;
        }
      }
      return converted_storey;
    },
  },
  methods: {
    editmode(access_point) {
      this.cachedaccesspoint = Object.assign({}, access_point);
      this.editing = access_point.device_id;
    },
    canceledit(access_point) {
      Object.assign(access_point, this.cachedaccesspoint);
      this.editing = null;
    },
    editaccesspoint(access_point) {
      if (
        access_point.device_id === "" ||
        access_point.ssid === "" ||
        access_point.password === "" ||
        access_point.ip === "" ||
        access_point.location.building === "" ||
        access_point.location.level === "" ||
        access_point.status === "" ||
        access_point.runtime === "" ||
        access_point.raspi === ""
      ) {
        return;
      } else {
        this.$emit("edit:accesspoint", access_point.device_id, access_point);
        this.editing = null;
        this.filter_error = false;
      }
    },
    filtererror() {
      this.filter_error = true;
      alert("❗Please save before filter");
    },
    manageaccesspoint() {
      if (this.$route.path.includes("/accesspoint/manage/")) {
        this.filterbuilding = "nofilter";
        this.filterlevel = "nofilter";
        this.filterraspi_id = this.$route.params.raspi_id;
        this.$emit("manage:accesspoint", this.$route.params.raspi_id);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  margin: 0.5vw;
  background: #009435;
  border: 1px solid #009435;
}

table td button:focus {
  outline: none;
}

tbody td button {
  margin: 0px 2px;
}


.last-td {
  border: unset;
}

#edit {
  display: inline-block;
}

#delete {
  display: inline-block;
}

table thead th {
  background: #f5f5f5;
}

table {
  margin: 20px 0px;
  table-layout: fixed;
  border-collapse: collapse;
  word-wrap: break-word;
}

table td{
  line-height: 95%;
}

td,
th {
  border: 2px solid #E8EEEA;
  margin: 0px;
  padding: 3px;
}

tr:nth-child(even) {
  background-color: #E8EEEA;
}

table .square {
  text-align: center;
}

#square-green {
  background-color: #44cf6c;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  display: inline-block;
}
#square-yellow {
  background-color: #ffe156;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  display: inline-block;
}

#square-red {
  background-color: #ec0b43;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  display: inline-block;
}

/* screen width */

table th,
td {
  font-size: 1vw;
}

table td button {
  font-size: 1vw;
}
#deviceid-col {
  width: 3.5em;
}
#ap-col {
  width: 5em;
}
#password-col {
  width: 4.6em;
}
#ip-col {
  width: 4em;
}
#building-col {
  width: 4.5em;
}
#storey-col {
  width: 3.5em;
}
#status-col {
  width: 50px;
}
#runtime-col {
  width: 80px;
}
#raspi-col {
  width: 3.3em;
}
#ping-col {
  width: 3em;
}
#upload-col {
  width: 4em;
}
#download-col {
  width: 5em;
}
#jitter-col {
  width: 3em;
}
#action-col {
  width: 6vw;
}

@media screen and (max-width: 760px) {

  /* table */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* Behave  like a "row" */
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    /* Now like a table header */
    position: absolute;
    /* Top/left values mimic padding */
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }

  .admin td:nth-of-type(1):before {
    content: "Device ID";
  }
  .admin td:nth-of-type(2):before {
    content: "AP";
  }
  .admin td:nth-of-type(3):before {
    content: "Password";
  }
  .admin td:nth-of-type(4):before {
    content: "IP";
  }
  .admin td:nth-of-type(5):before {
    content: "Building";
  }
  .admin td:nth-of-type(6):before {
    content: "Storey";
  }
  .admin td:nth-of-type(7):before {
    content: "Status";
  }
  .admin td:nth-of-type(8):before {
    content: "Runtime";
  }
  .admin td:nth-of-type(9):before {
    content: "Raspi ID";
  }
  .admin td:nth-of-type(10):before {
    content: "Ping(ms)";
  }
  .admin td:nth-of-type(11):before {
    content: "Upload(mb/s)";
  }
  .admin td:nth-of-type(12):before {
    content: "Download(mb/s)";
  }
  .admin td:nth-of-type(13):before {
    content: "Jitter(ms)";
  }
  .admin td:nth-of-type(14):before {
    content: "Actions";
  }

  .operator td:nth-of-type(1):before {
    content: "AP";
  }
  .operator td:nth-of-type(2):before {
    content: "Building";
  }
  .operator td:nth-of-type(3):before {
    content: "Storey";
  }
  .operator td:nth-of-type(4):before {
    content: "Status";
  }
  .operator td:nth-of-type(5):before {
    content: "Runtime";
  }
  .operator td:nth-of-type(6):before {
    content: "Ping(ms)";
  }
  .operator td:nth-of-type(7):before {
    content: "Upload(ms)";
  }
  .operator td:nth-of-type(8):before {
    content: "Download(ms)";
  }
  .operator td:nth-of-type(9):before {
    content: "Jitter(ms)";
  }

  table th,
  td {
    font-size: unset;
  }

  table td button {
    font-size: unset;
    margin: 2px;
  }
}

</style>
