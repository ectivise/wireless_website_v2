<template>
  <div id="accesspoint_table">
    <table>
      <thead>
        <tr>
          <th>SSID:</th>
          <th>Location:</th>
          <th>Ping:</th>
          <th>Download:</th>
          <th>Upload:</th>
          <th>Runtime:</th>
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
                @click.prevent="$emit('filter:accesspoint', filter)"
              />
            </form>
          </th>
        </tr>
      </thead>
      <tbody>
        <p v-if="access_points.length < 1" class="empty-table">
          No Access Points
        </p>
        <tr v-else v-for="access_point in access_points" :key="access_point.id">
          <td v-if="editing === access_point.id">
            <input type="text" v-model="access_point.ssid" />
          </td>
          <td v-else>{{ access_point.ssid }}</td>

          <td v-if="editing === access_point.id">
            <input type="text" v-model="access_point.location" />
          </td>
          <td v-else>{{ access_point.location }}</td>

          <td v-if="editing === access_point.id">
            <input type="text" v-model="access_point.ping" />
          </td>
          <td v-else>{{ access_point.ping }}</td>

          <td v-if="editing === access_point.id">
            <input type="text" v-model="access_point.download" />
          </td>
          <td v-else>{{ access_point.download }}</td>

          <td v-if="editing === access_point.id">
            <input type="text" v-model="access_point.upload" />
          </td>
          <td v-else>{{ access_point.upload }}</td>

          <td v-if="editing === access_point.id">
            <input type="text" v-model="access_point.runtime" />
          </td>
          <td v-else>{{ access_point.runtime }}</td>

          <td v-if="editing === access_point.id">
            <button @click="editaccesspoint(access_point)">Save</button>
            <button class="muted-button" @click="canceledit(access_point)">
              Cancel
            </button>
          </td>
          <td v-else>
            <button @click="editmode(access_point)">Edit</button>
            <button @click="$emit('delete:accesspoint', access_point.id)">
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
      editing: null,
      filter: "",
    };
  },
  methods: {
    editmode(access_point) {
      this.cachedaccesspoint = Object.assign({}, access_point);
      this.editing = access_point.id;
    },
    canceledit(access_point) {
      Object.assign(access_point, this.cachedaccesspoint);
      this.editing = null;
    },
    editaccesspoint(access_point) {
      if (
        access_point.ssid === "" ||
        access_point.location === "" ||
        access_point.ping === "" ||
        access_point.download === "" ||
        access_point.upload === "" ||
        access_point.runtime === ""
      ) {
        return;
      } else {
        this.$emit("edit:accesspoint", access_point.id, access_point);
        this.editing = null;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#filter-col {
  width: 250px;
}
select {
  float: left;
  max-width: 100px;
}
button {
  margin: 0 0.5rem 0 0;
}
</style>
