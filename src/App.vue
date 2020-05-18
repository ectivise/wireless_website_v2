<template>
  <div id="app" class="small-container">
    <h1>Access Points:</h1>
    <accesspoint_form @add:accesspoint="addaccesspoint" />
    <accesspoint_table
      v-if="filtering"
      v-bind:access_points="filtered_access_points"
      @delete:accesspoint="deleteaccesspoint"
      @edit:accesspoint="editaccesspoint"
      @filter:accesspoint="filteraccesspoint"
    />
    <accesspoint_table
      v-else
      v-bind:access_points="access_points"
      @delete:accesspoint="deleteaccesspoint"
      @edit:accesspoint="editaccesspoint"
      @filter:accesspoint="filteraccesspoint"
    />
  </div>
</template>

<script>
import accesspoint_table from "./components/accesspoint_table.vue";
import accesspoint_form from "./components/accesspoint_form.vue";

export default {
  name: "App",
  components: {
    accesspoint_table,
    accesspoint_form,
  },
  data() {
    return {
      filtering: false,
      filtered_access_points: [],
      access_points: [],
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
        console.log(data.data)
      } catch (error) {
        console.error(error);
      }
    },
    addaccesspoint(access_point) {
      const lastId =
        this.access_points.length > 0
          ? this.access_points[this.access_points.length - 1].id
          : 0;
      const id = lastId + 1;
      const newaccess_point = { ...access_point, id };
      this.access_points = [...this.access_points, newaccess_point];
    },
    deleteaccesspoint(id) {
      this.access_points = this.access_points.filter(
        (access_point) => access_point._id.$oid !== id
      );
    },
    filteraccesspoint(level) {
      if (level == "nofilter") {
        this.filtering = false;
      } else {
        this.filtering = true;
        this.filtered_access_points = this.access_points.filter(
          (access_point) => access_point.location == level
        );
      }
    },
    editaccesspoint(id, updatedaccesspoint) {
      this.access_points = this.access_points.map((access_point) =>
        access_point._id.$oid === id ? updatedaccesspoint : access_point
      );
    },
  },
};
</script>

<style>
button {
  background: #009435;
  border: 1px solid #009435;
}

.small-container {
  max-width: 2000px;
}
</style>
