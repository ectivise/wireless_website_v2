<template>
  <div id="accesspoint-form">
    <form v-on:submit.prevent="handlesubmit">
      <label>SSID</label>
      <input
        v-model="access_point.ssid"
        type="text"
        :class="{ 'has-error': submitting && invalidssid }"
        @focus="clearstatus"
        @keypress="clearstatus"
        ref="first"
      />
      <label>Location</label>
      <input
        v-model="access_point.location"
        type="text"
        :class="{ 'has-error': submitting && invalidlocation }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <label>Ping</label>
      <input
        v-model="access_point.ping"
        type="text"
        :class="{ 'has-error': submitting && invalidping }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <label>Download</label>
      <input
        v-model="access_point.download"
        type="text"
        :class="{ 'has-error': submitting && invaliddownload }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <label>Upload</label>
      <input
        v-model="access_point.upload"
        type="text"
        :class="{ 'has-error': submitting && invalidupload }"
        @focus="clearstatus"
        @keypress="clearstatus"
      />
      <label>Runtime</label>
      <input
        v-model="access_point.runtime"
        type="text"
        :class="{ 'has-error': submitting && invalidruntime }"
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
        ssid: "",
        location: "",
        ping: "",
        download: "",
        upload: "",
        runtime: "",
      },
    };
  },
  methods: {
    handlesubmit() {
      this.submitting = true;
      this.clearstatus();
      if (
        this.invalidssid ||
        this.invalidlocation ||
        this.invalidping ||
        this.invaliddownload ||
        this.invalidupload ||
        this.invalidruntime
      ) {
        this.error = true;
        return
      } else {
        this.$emit("add:accesspoint", this.access_point);
        // refer to the first input
        this.$refs.first.focus()
        // reset
        this.access_point = {
          ssid: "",
          location: "",
          ping: "",
          download: "",
          upload: "",
          runtime: "",
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

    invalidlocation() {
      return this.access_point.location === "";
    },

    invalidping() {
      return this.access_point.ping === "";
    },

    invaliddownload() {
      return this.access_point.download === "";
    },

    invalidupload() {
      return this.access_point.upload === "";
    },

    invalidruntime() {
      return this.access_point.runtime === "";
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
