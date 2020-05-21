<template>
  <div id="accesspoint_table">
    <div class="filter_form">
      <form>
        <h3>Filter:</h3>
        <label>Raspberry Pi ID:</label>
        <select v-model="filterraspi_id">
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
        
        >Submit</button>
        <button v-else @click.prevent="filtererror()" >Submit</button>
      </form>
    </div>

    <table>
      <thead>
        <tr>
          <th>Device ID:</th>
          <th>AP:</th>
          <th>Password:</th>
          <th>IP:</th>
          <th>Building</th>
          <th>Storey:</th>
          <th>Status:</th>
          <th>Runtime:</th>
          <th>Raspi ID:</th>
          <th>Ping(ms):</th>
          <th>Upload(mb/s):</th>
          <th>Download(mb/s):</th>
          <th>Jitter(ms):</th>
          <!-- last table head is filter col -->
        </tr>
      </thead>

      <!-- table body -->
      <tbody>
        <p v-if="access_points.length < 1" class="empty-table">
          No Access Points
        </p>
        <!-- database UUID -->
        <tr v-else v-for="(access_point, index) in access_points" :key="index">
          <!-- ap col-->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.device_id" />
          </td>
          <td v-else>{{ access_point.device_id }}</td>
          <!-- ssid col-->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.ssid" />
          </td>
          <td v-else>{{ access_point.ssid }}</td>
          <!-- password col -->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.password" />
          </td>
          <td v-else>{{ access_point.password }}</td>
          <!-- ip col -->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.ip" />
          </td>
          <td v-else>{{ access_point.ip }}</td>
          <!-- building col -->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.location.building" />
          </td>
          <td v-else>{{ access_point.location.building }}</td>
          <!-- level col -->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.location.level" />
          </td>
          <td v-else>{{ access_point.location.level }}</td>
          <!-- status col -->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.status" />
          </td>
          <td v-else>
            <div class="square">
              <div v-if="access_point.status == 1" id="square-green"></div>
              <div v-if="access_point.status == 0" id="square-red"></div>
            </div>
          </td>
          <!-- runtime col -->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.runtime" />
          </td>
          <td v-else>{{ convertruntime[index] }}</td>
          <!-- iotdevice col -->
          <td v-if="editing == access_point.device_id">
            <input type="text" v-model="access_point.raspi" />
          </td>
          <td v-else>{{ access_point.raspi }}</td>
          <!-- Ping col -->
          <td>{{ access_point.last_speedtest.ping }}</td>
          <!-- upload col -->
          <td>{{ access_point.last_speedtest.upload }}</td>
          <!-- download col -->
          <td>{{ access_point.last_speedtest.download }}</td>
          <!-- jitter col -->
          <td>{{ access_point.last_speedtest.jitter }}</td>
          <!-- editing and delete buttons -->
          <td v-if="editing == access_point.device_id">
            <button @click="editaccesspoint(access_point)">Save</button>
            <button class="muted-button" @click="canceledit(access_point)">
              Cancel
            </button>
          </td>
          <td v-else>
            <button @click="editmode(access_point)">Edit</button>
            <button
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
      raspi_id: this.$route.params.raspi_id
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
      for (let i = 0; i < this.access_points_copy.length; i++) {
        array_timestmp.push(this.access_points_copy[i].runtime);
      }
      for (let i = 0; i < array_timestmp.length; i++) {
        var days = Math.floor(array_timestmp[i] / (3600 * 24));
        array_timestmp[i] = array_timestmp[i] - days * (3600 * 24);
        var hours = Math.floor(array_timestmp[i] / 3600);
        array_timestmp[i] = array_timestmp[i] - hours * 3600;
        // var minutes = Math.floor(array_timestmp[i] / 60);
        // var seconds = array_timestmp[i] - (minutes * 60);

        var time = days + "days " + hours + "hrs";
        // console.log(time);
        converted_runtime[i] = time;
      }
      return converted_runtime;
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
      alert('❗Please save before filter');
    },
    reset_option() {
      this.filterbuildings = "nofilter";
      this.filterlevel = "nofilter";
      this.filterraspi_id = "nofilter";
    },
    manageaccesspoint() {
      if(this.$route.path.includes("/accesspoint/manage/")){
        this.filterbuildings = "nofilter";
        this.filterlevel = "nofilter";
        this.filterraspi_id = this.$route.params.raspi_id;
        this.$emit('manage:accesspoint',this.filterraspi_id);
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
select {
  float: left;
  max-width: 100px;
}
button, .filter_form button{
  margin: 0 0.5rem 0 0;  
  background: #009435;
  border: 1px solid #009435;
}

.filter_form label, select {
  float: left;
}
.filter_form label {
  font-size: 20px;
}
.filter_form {
  position: relative;
  margin: 10px;
}
table {
  border-collapse: collapse;
}
td,th {
  border: 1px solid black;
  margin: 0px;
  padding: 3px;
  line-height: 100%;
}

tr:nth-child(even) {
  background-color: #d7fdf0;
}


table .square {
  text-align: center;
}

#square-green{
  background-color:#44cf6c;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  display: inline-block;
}
#square-red{
  background-color:#e26d5c;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  display: inline-block;
}
</style>
