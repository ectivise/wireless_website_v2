<template>
  <div id="accesspoint_table">
    <div class="filter_form">
      <form>
        <!-- <h3>Filter</h3> -->
        <label v-if="usertype == 'admin'">Raspberry Pi ID:</label>
        <select v-if="usertype == 'admin'" v-model="filterraspi_id">
          <option value="nofilter" selected>No Filter</option>
          <option v-for="(option, index) in filter_raspi_id" :key="index">{{
            option
          }}</option>
        </select>
        <label>Building:</label>
        <select v-model="filterbuildings">
          <option value="nofilter" selected>No Filter</option>
          <option v-for="(option, index) in filter_buildings" :key="index">{{
            option
          }}</option>
        </select>
        <label>Storey:</label>
        <select v-model="filterlevel">
          <option value="nofilter" selected>No Filter</option>
          <option v-for="(option, index) in filter_level" :key="index">{{
            option
          }}</option>
        </select>
        <button
          ref="submit"
          type="submit"
          v-if="editing == null"
          @click.prevent="
            $emit(
              'filter:accesspoint',
              filterraspi_id,
              filterbuildings,
              filterlevel
            )
          "
        >
          Submit
        </button>
        <button v-else @click.prevent="filtererror()">Submit</button>
      </form>
    </div>
    <span
      class="status_button"
      id="normal"
      @click.prevent="$emit('filter:status', 0)"
      >Normal: {{ status_summary[0] }}
    </span>
    <span
      class="status_button"
      id="warning"
      @click.prevent="$emit('filter:status', 1)"
      >Warning: {{ status_summary[1] }}
    </span>
    <span
      class="status_button"
      id="critical"
      @click.prevent="$emit('filter:status', 2)"
      >Critical: {{ status_summary[2] }}
    </span>
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
        <p v-if="access_points.length < 1" class="empty-table">
          No Access Points
        </p>
        <!-- database UUID -->
        <tr
          v-else
          v-for="(access_point, index) in access_points"
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
      filterbuildings: "",
      filterlevel: "",
      filterraspi_id: "",
      filter_error: false,
      editing: null,
      raspi_id: this.$route.params.raspi_id,
      usertype: this.$store.state.user_type,
      options_array: [],
    };
  },
  mounted() {
    this.reset_option();
    this.manageaccesspoint();
  },
  computed: {
    filter_raspi_id() {
      var unfiltered_array = [];
      for (let i = 0; i < this.access_points_copy.length; i++) {
        unfiltered_array.push(this.access_points_copy[i].raspi);
      }
      const raspi_options = [...new Set(unfiltered_array)];
      return Array.from(raspi_options);
    },
    filter_buildings() {
      var unfiltered_array = [];
      for (let i = 0; i < this.access_points_copy.length; i++) {
        unfiltered_array.push(this.access_points_copy[i].location.building);
      }
      const building_options = [...new Set(unfiltered_array)];
      return Array.from(building_options);
    },
    filter_level() {
      var unfiltered_array = [];
      for (let i = 0; i < this.access_points_copy.length; i++) {
        unfiltered_array.push(this.access_points_copy[i].location.level);
      }
      const level_options = [...new Set(unfiltered_array)];
      return Array.from(level_options);
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

        var time = days + " days " + hours + "hrs";
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
    status_summary() {
      var status = [];
      var normal = 0,
        warning = 0,
        critical = 0;

      for (let i = 0; i < this.access_points_copy.length; i++) {
        if (this.access_points_copy[i].status == 0) {
          normal++;
        } else if (this.access_points_copy[i].status == 1) {
          warning++;
        } else {
          critical++;
        }
      }

      status = [normal, warning, critical];

      return status;
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
    reset_option() {
      this.filterbuildings = "nofilter";
      this.filterlevel = "nofilter";
      this.filterraspi_id = "nofilter";
    },
    manageaccesspoint() {
      if (this.$route.path.includes("/accesspoint/manage/")) {
        this.filterbuildings = "nofilter";
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
@media screen and (min-width: 761px) {
  .filter_form label,
  select {
    display: inline-block;
  }
}
.filter_form label,
select {
  /* float: left; */
  align-items: center;
}

.filter_form select {
  width: 8vw;
  height: 2.5em;
  font-size: 1vw;
  padding: 0.2em 0.3em;
  margin: 0.5em 0.7em;
}

button,
.filter_form button {
  margin: 0.5vw;
  background: #009435;
  border: 1px solid #009435;
}

.filter_form button {
  font-size: 1vw;
}

tbody td button {
  margin: 0px 2px;
}

.filter_form label {
  font-size: 1.5vw;
  padding: 0.5em;
  margin: 0.1em 0em;
}

.filter_form {
  position: relative;
  margin: 10px;
}

.last-td {
  border: unset;
}

.status_button {
  padding: 0.5em 0.8em;
  margin: 5px;
  border-radius: 20px;
  font-size: 1.1vw;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  white-space: pre;
  word-spacing: normal;
}

#normal {
  background-color: #3dbd61;
}
#warning {
  background-color: #d4b445;
}
#critical {
  background-color: #ec0b43;
}

#normal:hover {
  background-color: #319d4e;
}
#warning:hover {
  background-color: #b19037;
}
#critical:hover {
  background-color: #cd0936;
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
td,
th {
  border: 2px solid #eee;
  margin: 0px;
  padding: 3px;
}

tr:nth-child(even) {
  background-color: #d7fdf0;
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
  width: 37px;
}
#status-col {
  width: 50px;
}
#runtime-col {
  width: 70px;
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
  width: 110px;
}

@media screen and (max-width: 760px) {
  /* filter form */
  .filter_form {
    display: block;
  }

  .filter_form label {
    font-size: unset;
  }

  .filter_form select {
    font-size: unset;
    width: 50vw;
  }

  .filter_form button {
    font-size: unset;
    margin: 13px;
  }
  /* status button */
  .status_button {
    display: inline-block;
    padding: 0.5em 0.7em;
    margin: 0.5vw;
    border-radius: 20px;
    font-size: unset;
    font-weight: bold;
    color: #ffffff;
    cursor: pointer;
    white-space: pre;
    word-spacing: normal;
  }

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
  }
}
</style>
