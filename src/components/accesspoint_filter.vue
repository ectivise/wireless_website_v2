<template>
  <div class="filter_form">
    <form>
      <!-- <h3>Filter</h3> -->
      <label v-if="usertype == 'admin'">Raspberry Pi ID:</label>
      <select
        v-if="usertype == 'admin'"
        v-model="filterraspi_id"
      >
        <option value="nofilter" selected>All</option>
        <option v-for="(option, index) in filter_raspi_id" :key="index">{{
          option
        }}</option>
      </select>
      <label>Building:</label>
      <select
        v-model="filterbuilding"
      >
        <option value="nofilter" selected>All</option>
        <option v-for="(option, index) in filter_buildings" :key="index">{{
          option
        }}</option>
      </select>
      <label>Storey:</label>
      <select
        v-model="filterlevel"
      >
        <option value="nofilter" selected>All</option>
        <option v-for="(option, index) in filter_level" :key="index">{{
          option
        }}</option>
      </select>
      <span
        class="status_button"
        :class="status_summary[0] == 0 ? 'disabled' : ''"
        id="normal"
        @click.prevent="$store.commit('filterstatus',0)"
        >Normal: {{ status_summary[0] }}
      </span>
      <span
        class="status_button"
        :class="status_summary[1] == 0 ? 'disabled' : ''"
        id="warning"
        @click.prevent="$store.commit('filterstatus',1)"
        >Warning: {{ status_summary[1] }}
      </span>
      <span
        class="status_button"
        :class="status_summary[1] == 0 ? 'disabled' : ''"
        id="critical"
        @click.prevent="$store.commit('filterstatus',2)"
        >Critical: {{ status_summary[2] }}
      </span>
    </form>
  </div>
</template>

<script>
export default {
  name: "accesspoint_filter",
  props: {
    access_points: Array,
    // take a copy of the access_points_array so that the options will not change
    access_points_copy: Array,
  },
  data() {
    return {
      filterraspi_id: "",
      filterbuilding: "",
      filterlevel: "",
      filter_error: false,
      editing: null,
      raspi_id: this.$route.params.raspi_id,
      usertype: this.$store.state.user_type,
      options_array: [],
    };
  },
  watch: {
    filterraspi_id(newvalue) {
      this.filterbuilding = "nofilter";
      this.filterlevel = "nofilter";
      this.$store.commit('filterraspi_id', newvalue);
      this.$store.commit('filterstatus','')
    },
    filterbuilding(newvalue) {
      this.filterlevel = "nofilter";
      this.$store.commit('filterbuilding', newvalue);
      this.$store.commit('filterstatus','')
    },
    filterlevel(newvalue){
      this.$store.commit('filterlevel', newvalue);
      this.$store.commit('filterstatus','')
    },
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

      for (let i = 0; i < this.access_points.length; i++) {
        unfiltered_array.push(this.convertstorey[i]);
      }
      const level_options = [...new Set(unfiltered_array)];
      return Array.from(level_options);
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
      var access_points = this.$store.state.filter_accesspoint_storey
      var status = [];
      var normal = 0,
        warning = 0,
        critical = 0;

      for (let i = 0; i < access_points.length; i++) {
        if (access_points[i].status == 0) {
          normal++;
        } else if (access_points[i].status == 1) {
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
    filtererror() {
      this.filter_error = true;
      alert("❗Please save before filter");
    },
    reset_option() {
      this.filterbuilding = "nofilter";
      this.filterlevel = "nofilter";
      this.filterraspi_id = "nofilter";
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

<style scoped>
@media screen and (min-width: 761px) {
  .filter_form label,
  select {
    display: inline-block;
  }
}

.filter_form button:focus {
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

.filter_form button {
  margin: 0.5vw;
  background: #009435;
  border: 1px solid #009435;
}

.filter_form button {
  font-size: 1vw;
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

.disabled{
  pointer-events: none;
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

@media screen and (max-width: 760px) {
  /* filter form */
  .filter_form {
    display: block;
    width: 100%;
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
}
</style>
