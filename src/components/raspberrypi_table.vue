<template>
  <div id="raspberrypi_table">
    <div class="filter_form">
      <form>
        <!-- <h3>Filter</h3> -->
        <label>Building:</label>
        <select v-model="filterbuildings">
          <option value="nofilter">No Filter</option>
          <option v-for="(option, index) in filter_buildings" :key="index">{{option}}</option>
        </select>
        <label>Storey:</label>
        <select v-model="filterlevel">
          <option value="nofilter">No Filter</option>
          <option v-for="(option, index) in filter_level" :key="index">{{option}}</option>
        </select>
        <button
          v-if="editing == null"
          @click.prevent="
            $emit('filter:raspberrypi', filterbuildings, filterlevel)
          "
        >Submit</button>
        <button v-else @click.prevent="filtererror()">Submit</button>
      </form>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:100px">Raspi ID</th>
          <th style="width:100px">Password</th>
          <th style="width:110px">IP</th>
          <th style="width:80px">Building</th>
          <th style="width:70px">Storey</th>
          <th style="width:70px"> Status</th>
          <th style="width:200px">Actions</th>
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
          <td v-else>{{ raspberrypi.location.level }}</td>
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
            <button  class="muted-button" @click="canceledit(raspberrypi)">Cancel</button>
          </td>
          <td v-else class="last-td">
            <button id="edit" @click="editmode(raspberrypi)">Edit</button>
            <button id="delete" @click="$emit('delete:raspberrypi', raspberrypi.raspi_id)">Delete</button>
            <button id="manage" @click.prevent="gotoaccesspoint(raspberrypi.raspi_id)">Manage AP list</button>
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
      empty_aplist:false,
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
      for (let i = 0; i < this.raspberrypis_copy.length; i++) {
        array_timestmp.push(this.raspberrypis_copy[i].runtime);
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
      alert("❗Please save before filter")
    },
    gotoaccesspoint(id) {
      // first chk if the raspi got any ap list
      let target = this.raspberrypis.filter((raspberrypi) => raspberrypi.raspi_id == id);
      if(target[0].aplist.length < 1){
        this.empty_aplist = true;
        alert("❗ The selected Raspberry Pi have empty AP list")
      } else{
        let url = "/accesspoint/manage/" + id;
        this.$router.push(url);
      }
    },
    reset_option() {
      this.filterbuildings = 'nofilter';
      this.filterlevel = 'nofilter';
    }
  },
};
</script>

<style scoped>
.raspberrypi_table {
  width: 900px;
}

select {
  float: left;
  max-width: 100px;
}
button, .filter_form button{
  margin: 0 0.5rem 0 0;  
  background: #009435;
  border: 1px solid #009435;
}

.last-td{
  border:unset;
}

.filter_form label, select, h3 {
  float: left;
  align-items: center;
}

.filter_form h3 {
  margin: auto;
  padding: 10px;
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

table thead th{
  background: #f5f5f5;
}

td,th {
  border: 2px solid #eee;
  margin: 0px;
  padding: 3px;
}

#edit{
  float: left;
}

#delete{
  float: left;
  
}

#manage{
 float: left;
 position: absolute;
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

#square-yellow {
  background-color:#FFE156;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  display: inline-block;
}

#square-red{
  background-color:#EC0B43;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  display: inline-block;
}

</style>
