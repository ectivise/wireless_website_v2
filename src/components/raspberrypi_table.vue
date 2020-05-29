<template>
  <div id="raspberrypi_table">
    <div class="filter_form">
      <form>
        <!-- <h3>Filter</h3> -->
        <label>Building:</label>
        <select v-model="filterbuildings">
          <option value="nofilter">No Filter</option>
          <option v-for="(option, index) in filter_buildings" :key="index">{{
            option
          }}</option>
        </select>
        <label>Storey:</label>
        <select v-model="filterlevel">
          <option value="nofilter">No Filter</option>
          <option v-for="(option, index) in filter_level" :key="index">{{
            option
          }}</option>
        </select>
        <button
          v-if="editing == null"
          @click.prevent="
            $emit('filter:raspberrypi', filterbuildings, filterlevel)
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
          <th id="raspi-col">Raspi ID</th>
          <th id="password-col">Password</th>
          <th id="ip-col">IP</th>
          <th id="building-col">Building</th>
          <th id="storey-col">Storey</th>
          <th id="status-col">Status</th>
          <th id="action-col">Actions</th>
          <!-- <th>aplist:</th> -->
        </tr>
      </thead>
      <!-- table body -->
      <tbody>
        <p v-if="raspberrypis.length < 1" class="empty-table">
          No Raspberry Pi
        </p>
        <!-- database UUID -->
        <tr v-else v-for="(raspberrypi, index) in raspberrypis" :key="index">
          <!-- device ID col-->
          <td v-if="editing == raspberrypi.raspi_id">
            <input type="text" v-model="raspberrypi.raspi_id" />
          </td>
          <td v-else>{{ raspberrypi.raspi_id }}</td>
          <!-- password col -->
          <td v-if="editing == raspberrypi.raspi_id">
            <input type="text" v-model="raspberrypi.password2" />
          </td>
          <td v-else>{{ raspberrypi.password2 }}</td>
          <!-- IP col-->
          <td v-if="editing == raspberrypi.raspi_id">
            <input type="text" v-model="raspberrypi.ip" />
          </td>
          <td v-else>{{ raspberrypi.ip }}</td>
          <!-- building col -->
          <td v-if="editing == raspberrypi.raspi_id">
            <input type="text" v-model="raspberrypi.location.building" />
          </td>
          <td v-else>{{ raspberrypi.location.building }}</td>
          <!-- level col -->
          <td v-if="editing == raspberrypi.raspi_id">
            <input type="text" v-model="raspberrypi.location.level" />
          </td>
          <td v-else>{{ convertstorey[index] }}</td>
          <!-- status col -->
          <td v-if="editing == raspberrypi.raspi_id">
            <input type="text" v-model="raspberrypi.status" />
          </td>
          <td v-else>
            <div class="square">
              <div v-if="raspberrypi.status == 0" id="square-green"></div>
              <div v-if="raspberrypi.status == 1" id="square-yellow"></div>
              <div v-if="raspberrypi.status == 2" id="square-red"></div>
            </div>
          </td>

          <!-- ssid(ap_list) col -->

          <!-- editing and delete buttons -->

          <td v-if="editing == raspberrypi.raspi_id" class="last-td">
            <button @click="editraspberrypi(raspberrypi)">Save</button>
            <button class="muted-button" @click="canceledit(raspberrypi)">
              Cancel
            </button>
          </td>
          <td v-else class="last-td">
            <button id="edit" @click="editmode(raspberrypi)">Edit</button>
            <button
              id="delete"
              @click="$emit('delete:raspberrypi', raspberrypi.raspi_id)"
            >
              Delete
            </button>
            <button
              id="manage"
              @click.prevent="gotoaccesspoint(raspberrypi.raspi_id)"
            >
              Manage AP list
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "raspberrypi_table",
  props: {
    raspberrypis: Array,
    raspberrypis_copy: Array,
  },
  data() {
    return {
      filterbuildings: "",
      filterlevel: "",
      filter_error: false,
      editing: null,
      empty_aplist: false,
    };
  },
  mounted() {
    this.reset_option();
  },
  computed: {
    filter_buildings() {
      var unfiltered_array = [];
      for (let i = 0; i < this.raspberrypis_copy.length; i++) {
        unfiltered_array.push(this.raspberrypis_copy[i].location.building);
      }
      const building_options = [...new Set(unfiltered_array)];
      return Array.from(building_options);
    },
    filter_level() {
      var unfiltered_array = [];
      for (let i = 0; i < this.raspberrypis_copy.length; i++) {
        unfiltered_array.push(this.raspberrypis_copy[i].location.level);
      }
      const level_options = [...new Set(unfiltered_array)];
      return Array.from(level_options);
    },
    convertruntime() {
      const converted_runtime = [];
      var array_timestmp = [];
      for (let i = 0; i < this.raspberrypis.length; i++) {
        array_timestmp.push(this.raspberrypis[i].runtime);
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
      for (let i = 0; i < this.raspberrypis.length; i++) {
        array_storey.push(this.raspberrypis[i].location.level);
      }
      for (let i = 0; i < array_storey.length; i++) {
        switch (array_storey[i]) {
          case "1":
            converted_storey[i] = "Level 1";
            break;
          case "2":
            converted_storey[i] = "Level 2";
            break;
          case "3":
            converted_storey[i] = "Level 3";
            break;
          case "4":
            converted_storey[i] = "Level 4";
            break;
          case "5":
            converted_storey[i] = "Level 5";
            break;
          case "6":
            converted_storey[i] = "Level 6";
            break;
          case "7":
            converted_storey[i] = "Level 7";
            break;
          case "8":
            converted_storey[i] = "Level 8";
            break;
          case "9":
            converted_storey[i] = "Level 9";
            break;
          case "10":
            converted_storey[i] = "Level 10";
            break;
          case "-1":
            converted_storey[i] = "Basement 1";
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

      for (let i = 0; i < this.raspberrypis_copy.length; i++) {
        if (this.raspberrypis_copy[i].status == 0) {
          normal++;
        } else if (this.raspberrypis_copy[i].status == 1) {
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
    editmode(raspberrypi) {
      this.cachedraspberrypi = Object.assign({}, raspberrypi);
      this.editing = raspberrypi.raspi_id;
    },
    canceledit(raspberrypi) {
      Object.assign(raspberrypi, this.cachedraspberrypi);
      this.editing = null;
    },
    editraspberrypi(raspberrypi) {
      if (
        raspberrypi.raspi_id === "" ||
        raspberrypi.ip === "" ||
        raspberrypi.password2 === "" ||
        raspberrypi.status === "" ||
        raspberrypi.location.building === "" ||
        raspberrypi.location.level === "" ||
        raspberrypi.runtime === "" ||
        raspberrypi.user === "" ||
        raspberrypi.password === ""
      ) {
        return;
      } else {
        this.$emit("edit:raspberrypi", raspberrypi.raspi_id, raspberrypi);
        this.editing = null;
        this.filter_error = false;
      }
    },
    filtererror() {
      this.filter_error = true;
      alert("❗Please save before filter");
    },
    gotoaccesspoint(id) {
      // first chk if the raspi got any ap list
      let target = this.raspberrypis.filter(
        (raspberrypi) => raspberrypi.raspi_id == id
      );
      if (target[0].aplist.length < 1) {
        this.empty_aplist = true;
        alert("❗ The selected Raspberry Pi have empty AP list");
      } else {
        let url = "/accesspoint/manage/" + id;
        this.$router.push(url);
      }
    },
    reset_option() {
      this.filterbuildings = "nofilter";
      this.filterlevel = "nofilter";
    },
  },
};
</script>

<style scoped>

@media screen and (min-width: 761px) {
  .filter_form label,
  select {
    display: inline-block;
  }
}

.filter_form button:focus, table td button:focus {
  outline: none;
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

select {
  /* float: left; */
  max-width: 150px;
}

button,
.filter_form button {
  margin: 0 0.5rem 0 0;
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

table {
  margin: 20px 0px;
  border-collapse: collapse;
  word-wrap: break-word;
}

table thead th {
  background: #f5f5f5;
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

table th,
td {
  font-size: 1vw;
}

table td button {
  font-size: 1vw;
}

@media screen and (max-width: 760px) {
  /* filter form */
  .filter_form {
    position: static;
    display: block;
  }

  .filter_form label {
    font-size: unset;
  }

  .filter_form select {
    font-size: unset;
    display: block;
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

  td:nth-of-type(1):before {
    content: "Raspi ID";
  }
  td:nth-of-type(2):before {
    content: "Password";
  }
  td:nth-of-type(3):before {
    content: "IP";
  }
  td:nth-of-type(4):before {
    content: "Building";
  }
  td:nth-of-type(5):before {
    content: "Storey";
  }
  td:nth-of-type(6):before {
    content: "Status";
  }
  td:nth-of-type(7):before {
    content: "Actions";
  }

  table th,
  td {
    font-size: unset;
  }

  table td button {
    font-size: unset;
    margin: 2px 2px;
  }
}
</style>
