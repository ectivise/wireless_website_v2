<template>
  <div id="user_table">
    <table>
      <thead>
        <tr>
          <th id="deviceid-col">Mobile</th>
          <th id="deviceid-col">Password</th>
          <th id="deviceid-col">Role Type</th>
          <th id="deviceid-col">Actions</th>
        </tr>
      </thead>

      <!-- table body -->
      <tbody>
        <p v-if="users.length < 1" class="empty-table">
          No Users
        </p>
        <!-- database UUID -->
        <tr v-else v-for="(user, index) in users" :key="index">
          <!-- mobile col-->
          <td>{{ user.mobile }}</td>
          <!-- password col-->
          <td>{{ user.password }}</td>
          <!-- roletype col -->
          <td v-if="editing == user.mobile">
            <input type="text" v-model="user.roleType" />
          </td>
          <td v-else>{{ user.roleType }}</td>
          <!-- editing and delete buttons -->
          <td v-if="editing == user.mobile" class="last-td">
            <el-button @click="edituser(user)">Save</el-button>
            <el-button class="muted-button" @click="canceledit(user)">
              Cancel
            </el-button>
          </td>
          <td v-else class="last-td">
            <el-button id="edit" @click="editmode(user)">Edit</el-button>
            <el-button id="delete" @click="$emit('delete:user', user.mobile)">
              Delete
            </el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <nav>
      <div class="pagination">
        <div class="pagebuttons">
          <span class="page-item">
            <button
              type="button"
              class="page-link"
              v-if="page != 1"
              @click="page--"
            >
              &#8249;
            </button>
          </span>
          <span class="page-item">
            <button
              type="button"
              class="page-link"
              v-for="pageNumber in pages.slice(page - 1, page + 4)"
              :key="pageNumber"
              @click="page = pageNumber"
            >
              {{ pageNumber }}
            </button>
          </span>
          <span class="page-item">
            <button
              type="button"
              @click="page++"
              v-if="page < pages.length"
              class="page-link"
            >
              &#8250;
            </button>
          </span>
        </div>
      </div>
    </nav> -->
  </div>
</template>

<script>
export default {
  name: "user_table",
  props: {
    users: Array,
  },
  data() {
    return {
      editing: null,
      user: {
        userCode: "",
        blocked: false,
        mobile: "",
        countryCode: 65,
        region: "",
        language: "",
        birthday: 0,
        name: "",
        nickName: "",
        gender: 0, //0 = male, 1 = female
        token: "",
        password: "",
        status: 0, //0 login, 1 logout, 2 disabled, 3, locked, 4 new user 5 signup
        registerDate: 0,
        lastlogin: 0,
        device: {},
        accountType: 0,
        customer: 0,
        roleType: 0,
        enabled: false,
        email: "",
        logintime: 0,
        application: 0,
      },
    };
  },
  methods: {
    editmode(user) {
      this.cacheduser = Object.assign({}, user);
      this.editing = user.mobile;
    },
    canceledit(user) {
      Object.assign(user, this.cacheduser);
      this.editing = null;
    },
    edituser(user) {
      if (user.roleType === "") {
        return;
      } else {
        this.$emit("edit:user", user.mobile, user);
        this.editing = null;
        this.filter_error = false;
      }
    },
  },
};
</script>

<style scoped>
#user_table {
  max-width: 80vw;
  margin: auto;
}
</style>
