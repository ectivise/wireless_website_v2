<template>
  <div id="accesspoint_table">
    <table>
      <thead>
        <tr>
          <!-- <th>AP:</th> -->
          <th>SSID:</th>
          <th>Password:</th>
          <th>IP address:</th>
          <th>Building</th>
          <th>Story:</th>
          <th>Status:</th>
          <th>Runtime:</th>
          <th>iotdevice:</th>
          <th>Ping(ms):</th>
          <th>Upload(mb/s):</th>
          <th>Download(mb/s):</th>
          <th>Jitter(ms):</th>
          <!-- last table head is filter col -->
          <th id="filter-col">
            <form>
              <label>Filter:</label>
              <select v-model="filter">
                <option value="nofilter">No Filter</option>
                <option>level1</option>
                <option>level2</option>
                <option>level3</option>
                <option>level4</option>
                <option>level5</option>
                <option>level6</option>
                <option>level7</option>
                <option>level8</option>
                <option>level9</option>
              </select>
              <input
                type="submit"
                v-if="editing == null"
                @click.prevent="$emit('filter:accesspoint', filter)"
              />
              <input type="submit" v-else @click.prevent="filtererror()" />
              <p v-if="filter_error">
                ❗Please save before filter
              </p>
            </form>
          </th>
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
          v-for="access_point in access_points"
          :key="access_point._id.$oid"
        >
          <!-- ap col-->
          <!-- <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.device_id" />
          </td>
          <td v-else>{{ access_point.device_id }}</td> -->
          <!-- ssid col-->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.ssid" />
          </td>
          <td v-else>{{ access_point.ssid }}</td>
          <!-- password col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.password" />
          </td>
          <td v-else>{{ access_point.password }}</td>
          <!-- ip col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.ip" />
          </td>
          <td v-else>{{ access_point.ip }}</td>
          <!-- building col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.location.building" />
          </td>
          <td v-else>{{ access_point.location.building }}</td>
          <!-- level col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.location.level" />
          </td>
          <td v-else>{{ access_point.location.level }}</td>
          <!-- status col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.status" />
          </td>
          <td v-else>{{ access_point.status }}</td>
          <!-- runtime col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.runtime" />
          </td>
          <td v-else>{{ access_point.runtime }}</td>
          <!-- iotdevice col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.raspi" />
          </td>
          <td v-else>{{ access_point.raspi }}</td>
          <!-- Ping col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.last_speedtest.ping" />
          </td>
          <td v-else>{{ access_point.last_speedtest.ping }}</td>
          <!-- upload col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.last_speedtest.upload" />
          </td>
          <td v-else>{{ access_point.last_speedtest.upload }}</td>
          <!-- download col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.last_speedtest.download" />
          </td>
          <td v-else>{{ access_point.last_speedtest.download }}</td>
          <!-- jitter col -->
          <td v-if="editing == access_point._id.$oid">
            <input type="text" v-model="access_point.last_speedtest.jitter" />
          </td>
          <td v-else>{{ access_point.last_speedtest.jitter }}</td>
          <!-- editing and delete buttons -->
          <td v-if="editing == access_point._id.$oid">
            <button @click="editaccesspoint(access_point)">Save</button>
            <button class="muted-button" @click="canceledit(access_point)">
              Cancel
            </button>
          </td>
          <td v-else>
            <button @click="editmode(access_point)">Edit</button>
            <button @click="$emit('delete:accesspoint', access_point._id.$oid)">
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
  },
  data() {
    return {
      filter_error: false,
      editing: null,
      filter: "",
    };
  },
  methods: {
    editmode(access_point) {
      this.cachedaccesspoint = Object.assign({}, access_point);
      this.editing = access_point._id.$oid;
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
        this.$emit("edit:accesspoint", access_point._id.$oid, access_point);
        this.editing = null;
        this.filter_error = false;
      }
    },
    filtererror() {
      this.filter_error = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#filter-col {
  width: 250px;
}
table {
  counter-set: row-num 1;
}
table tr {
  counter-increment: row-num;
}
table tr td:first-child::before {
  content: counter(row-num) ". ";
}
select {
  float: left;
  max-width: 100px;
}
button {
  margin: 0 0.5rem 0 0;
}
</style>
