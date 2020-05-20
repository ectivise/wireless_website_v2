<template>
  <div class="bg-modal">
    <div class="modal-content">
      <div class="close" @click.prevent="$emit('close:popupwindow')">+</div>
      <div id="raspberrypi-form">
        <h2>Create New raspberrypi</h2>

        <form v-on:submit.prevent="handlesubmit">
          <!-- Device input-->
          <label>Device ID</label>
          <input
            v-model="raspberrypi.raspi_id"
            type="text"
            :class="{ 'has-error': submitting && invalidraspi_id }"
            @focus="clearstatus"
            @keypress="clearstatus"
            ref="first"
          />
          <!-- password input -->
          <label>Password</label>
          <input
            v-model="raspberrypi.password2"
            type="text"
            :class="{ 'has-error': submitting && invalidpassword2 }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <!-- ip input -->
          <label>IP Address</label>
          <input
            v-model="raspberrypi.ip"
            type="text"
            :class="{ 'has-error': submitting && invalidip }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <!-- Building input -->
          <label>Building</label>
          <input
            v-model="raspberrypi.location.building"
            type="text"
            :class="{ 'has-error': submitting && invalidbuilding }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <!-- level input -->
          <label>Level</label>
          <input
            v-model="raspberrypi.location.level"
            type="text"
            :class="{ 'has-error': submitting && invalidlevel }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <!-- status input -->
          <label>Status</label>
          <input
            v-model="raspberrypi.status"
            type="text"
            :class="{ 'has-error': submitting && invalidstatus }"
            @focus="clearstatus"
            @keypress="clearstatus"
          />
          <!-- aplist -->
          <!-- <label>Acess Point list</label>
          <input
            v-model="raspberrypi.raspi"
            type="text"
            :class="{ 'has-error': submitting && invalidlist }"
            @focus="clearstatus"
            @keypress="clearstatus"
          /> -->

          <p v-if="error && submitting" class="error-message">
            ❗Please fill out all required fields
          </p>
          <p v-if="success" class="success-message">
            ✅ Access Point successfully added
          </p>
          <button>Add Raspberry Pi</button>
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
      raspberrypi: {
        raspi_id: "",
        ip: "",
        password2: "",
        status: 1,
        location: {
          site: "le grove",
          building: "",
          level: "",
        },
        runtime: 0,
        aplist: [],
        user: "admin",
        password: "admin@123",
      },
    };
  },
  methods: {
    handlesubmit() {
      this.submitting = true;
      this.clearstatus();
      if (
        this.invalidraspi_id ||
        this.invalidpassword2 ||
        this.invalidip ||
        this.invalidbuilding ||
        this.invalidlevel ||
        this.invalidstatus
        // this.invalidruntime ||
        // this.invalidlist
      ) {
        this.error = true;
        return;
      } else {
        this.$emit("add:raspberrypi", this.raspberrypi);
        // refer to the first input
        this.$refs.first.focus();
        // reset
        this.raspberrypi = {
      "raspi_id": "",
      "ip": "",
      "password2": "",
      "status": 1,
      "location": {
        "site": "le grove",
        "building": "",
        "level": ""
      },
      "runtime": 0,
      "aplist": [],
      "user": "admin",
      "password": "admin@123"
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
    invalidraspi_id() {
      return this.raspberrypi.raspi_id === "";
    },

    invalidpassword2() {
      return this.raspberrypi.password2 === "";
    },

    invalidip() {
      return this.raspberrypi.ip === "";
    },
    invalidbuilding() {
      return this.raspberrypi.location.building === "";
    },

    invalidlevel() {
      return this.raspberrypi.location.level === "";
    },

    invalidstatus() {
      return this.raspberrypi.status === "";
    },

    // invalidruntime() {
    //   return this.raspberrypi.runtime === "";
    // },

    // invalidraspi() {
    //   return this.raspberrypi.raspi === "";
    // },
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

#raspberrypi-form {
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
