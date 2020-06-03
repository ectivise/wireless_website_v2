<template>
  <div id="user_table">
    <label>Search Mobile</label>
    <el-input v-model="search" size="mini" placeholder="Type to search" />
    <label>Filter Role Type</label>
    <el-select v-model="filter_roletype" placeholder="Select">
      <el-option
        v-for="option in roletype_options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      >
      </el-option>
    </el-select>
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
        <p v-if="displayeduser.length < 1" class="empty-table">
          No Users
        </p>
        <!-- database UUID -->
        <tr v-else v-for="(user, index) in displayeduser" :key="index">
          <!-- mobile col-->
          <td>{{ user.mobile }}</td>
          <!-- password col-->
          <td>{{ user.password }}</td>
          <!-- roletype col -->
          <td v-if="editing == user.mobile">
            <div>
              <el-radio-group v-model="user.roleType">
                <el-radio-button label="0">Normal</el-radio-button>
                <el-radio-button label="1">Admin</el-radio-button>
                <el-radio-button label="2">Super User</el-radio-button>
              </el-radio-group>
            </div>
          </td>
          <td v-else>{{ convertroletype[index] }}</td>
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
    <el-pagination
      :page-size="page_size"
      :pager-count="11"
      :current-page="page"
      layout="prev, pager, next"
      :total="this.filterroletype.length"
      @prev-click="page--"
      @next-click="page++"
    >
    </el-pagination>
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
      page: 1,
      page_size: 2,
      search:"",
      editing: null,
      filter_roletype:"nofilter",
      roletype_options: [
        {
          value: "nofilter",
          label: "No Filter",
        },
        {
          value: "0",
          label: "Normal",
        },
        {
          value: "1",
          label: "Admin",
        },
        {
          value: "2",
          label: "Super User",
        },
      ],
      emptyuser: {
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
  computed: {
    filterroletype(){
      let filtered_users = this.users.slice(0);

      if(this.filter_roletype !== 'nofilter'){
        filtered_users.filter((user)=> user.roleType == this.filter_roletype)
      }

      if(this.search !== "" ){
        filtered_users.filter(user => user.mobile.include(this.search));
      }
      
      return filtered_users;
    },
    displayeduser() {
      return this.paginate(this.filterroletype);
    },
    convertroletype() {
      let convertedroletype = [];
      let emptyarray = [];
      for (let i = 0; i < this.displayeduser.length; i++) {
        emptyarray.push(this.displayeduser[i].roleType);
      }

      for (let i = 0; i < this.displayeduser.length; i++) {
        switch (Number(emptyarray[i])) {
          case 0:
            convertedroletype.push("Normal");
            break;
          case 1:
            convertedroletype.push("Admin");
            break;
          case 2:
            convertedroletype.push("Super User");
            break;
        }
      }
      return convertedroletype;
    },
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
        this.$emit("edit:user", user.mobile, user);
        this.editing = null;
        this.filter_error = false;

    },
    paginate(users) {
      let page = this.page;
      let page_size = this.page_size;
      let from = page * page_size - page_size;
      let to = page * page_size;

      return users.slice(from, to);
    },
  },
};
</script>

<style scoped>
#user_table {
  max-width: 80vw;
  margin: auto;
}

.el-pagination {
  margin: auto;
}

tr:nth-child(even) {
  background-color: #e8eeea;
}
</style>
