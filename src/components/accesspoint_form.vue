<template>
  <div id="accesspoint-form">
    <form v-on:submit.prevent="handlesubmit">
      <!-- ssid input-->
      <label>SSID</label>
      <input
        v-model="access_point.ssid"
        type="text"
        :class="{ 'has-error': submitting && invalidssid }"
        @focus="clearstatus"
        @keypress="clearstatus"
        ref="first"
      />
      <!-- password input -->
      <label>Password</label>
      <input
        v-model="access_point.password"
        type="text"
        :class="{ 'has-error': submitting && invalidpassword }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- ip input -->
      <label>IP Address</label>
      <input
        v-model="access_point.ip"
        type="text"
        :class="{ 'has-error': submitting && invalidip }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- Building input -->
      <label>Building</label>
      <input
        v-model="access_point.location.building"
        type="text"
        :class="{ 'has-error': submitting && invalidbuilding }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- level input -->
      <label>Level</label>
      <input
        v-model="access_point.location.level"
        type="text"
        :class="{ 'has-error': submitting && invalidlevel }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- status input -->
      <label>Status</label>
      <input
        v-model="access_point.status"
        type="text"
        :class="{ 'has-error': submitting && invalidstatus }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- runtime input -->
      <label>Runtime</label>
      <input
        v-model="access_point.runtime"
        type="text"
        :class="{ 'has-error': submitting && invalidruntime }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- iot device -->
      <label>iot device</label>
      <input
        v-model="access_point.raspi"
        type="text"
        :class="{ 'has-error': submitting && invalidraspi }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- ping input -->
      <label>Ping</label>
      <input
        v-model="access_point.last_speedtest.ping"
        type="text"
        :class="{ 'has-error': submitting && invalidping }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- upload input -->
      <label>Upload</label>
      <input
        v-model="access_point.last_speedtest.upload"
        type="text"
        :class="{ 'has-error': submitting && invalidupload }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- download input -->
      <label>Download</label>
      <input
        v-model="access_point.last_speedtest.download"
        type="text"
        :class="{ 'has-error': submitting && invaliddownload }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <!-- jitter input -->
      <label>Jitter</label>
      <input
        v-model="access_point.last_speedtest.jitter"
        type="text"
        :class="{ 'has-error': submitting && invalidjitter }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />

      <p v-if="error && submitting" class="error-message">
        ❗Please fill out all required fields
      </p>
      <p v-if="success" class="success-message">
        ✅ Access Point successfully added
      </p>
      <button>Add Access Point</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "accesspoint_form",
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      access_point: {
        _id: {
          $oid: "",
        },
        location: {
          site: "",
          building: "",
          level: "",
        },
        last_speedtest: {
          ping: 0,
          download: 0,
          upload: 0,
          jitter: 0,
          timestamp: 0,
        },
        runtime: 0,
        ip: "",
        device_id: "",
        ssid: "",
        os: "",
        hardware: "",
        ignore: 0,
        status: 1,
        quality: 0,
        mac: "",
        desc: "",
        password: "",
        raspi: "",
      },
    };
  },
  methods: {
    handlesubmit() {
      this.submitting = true;
      this.clearstatus();
      if (
        this.invalidssid ||
        this.invalidpassword ||
        this.invalidip ||
        this.invalidbuilding ||
        this.invalidlevel ||
        this.invalidstatus ||
        this.invalidruntime ||
        this.invalidraspi ||
        this.invalidping ||
        this.invalidupload ||
        this.invaliddownload ||
        this.invalidjitter
      ) {
        this.error = true;
        return;
      } else {
        this.$emit("add:accesspoint", this.access_point);
        // refer to the first input
        this.$refs.first.focus();
        // reset
        this.access_point = {
        _id: {
          $oid: "",
        },
        location: {
          site: "",
          building: "",
          level: "",
        },
        last_speedtest: {
          ping: 0,
          download: 0,
          upload: 0,
          jitter: 0,
          timestamp: 0,
        },
        runtime: 0,
        ip: "",
        device_id: "",
        ssid: "",
        os: "",
        hardware: "",
        ignore: 0,
        status: 1,
        quality: 0,
        mac: "",
        desc: "",
        password: "",
        raspi: "",
      };
        this.error = false;
        this.success = true;
        this.submitting = false;
      }
    },
    clearstatus() {
      this.success = false;
      this.error = false;
    },
  },
  computed: {
    invalidssid() {
      return this.access_point.ssid === "";
    },

    invalidpassword() {
      return this.access_point.password === "";
    },

    invalidip() {
      return this.access_point.ip === "";
    },
    invalidbuilding() {
      return this.access_point.location.building === "";
    },

    invalidlevel() {
      return this.access_point.location.level === "";
    },

    invalidstatus() {
      return this.access_point.status === "";
    },

    invalidruntime() {
      return this.access_point.runtime === "";
    },

    invalidraspi() {
      return this.access_point.raspi === "";
    },

    invalidping() {
      return this.access_point.last_speedtest.ping === "";
    },

    invalidupload() {
      return this.access_point.last_speedtest.upload === "";
    },

    invaliddownload() {
      return this.access_point.last_speedtest.download === "";
    },

    invalidjitter() {
      return this.access_point.last_speedtest.jitter === "";
    },
  },
};
</script>

<style scoped>
form {
  margin-bottom: 2rem;
}

[class*="-message"] {
  font-weight: 500;
}

.error-message {
  color: #d33c40;
}

.success-message {
  color: #32a95d;
}
</style>
