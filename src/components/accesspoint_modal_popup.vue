<template>
  <div class="bg-modal">
    <div class="modal-content">
      <div class="close" @click.prevent="$emit('close:popupwindow')">+</div>
      <div id="accesspoint-form">
        <h2>Create New Access Point</h2>
        
        <form v-on:submit.prevent="handlesubmit">
          <!-- ssid input-->
          <label>AP</label>
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

          <p v-if="error && submitting" class="error-message">
            ❗Please fill out all required fields
          </p>
          <p v-if="success" class="success-message">
            ✅ Access Point successfully added
          </p>
          <button>Add Access Point</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "popup_window",
  data() {
    return {
      submitting: false,
      error: false,
      success: false,
      access_point: {
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
        this.invalidraspi
      ) {
        this.error = true;
        return;
      } else {
        this.$emit("add:accesspoint", this.access_point);
        // refer to the first input
        this.$refs.first.focus();
        // reset
        this.access_point = {
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
  },
};
</script>

<style scoped>
.bg-modal {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.modal-content {
  width: 60%;
  background-color: white;
  border-radius: 4px;
  position: relative;
  margin: 400px 0px 0px 0px;
  border: solid 1px;
}

#accesspoint-form {
  padding: 20px;
}

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

.close {
  position: absolute;
  top: 0;
  right: 20px;
  font-size: 42px;
  transform: rotate(45deg);
  cursor: pointer;
}
</style>
