<template>
  <section class="vh">
    <br />
    <div class="container">
      <div class="row">
        <div class="two columns">
          <div class="image">
            <img
              v-if="company.companyProfileImage"
              :src="company.companyProfileImage"
              alt=""
            />
            <img v-else src="@/assets/img/user.svg" alt="" />
          </div>
        </div>
        <div class="u-cf"></div>
      </div>
      <h1 class="med">{{ company.cname }}</h1>

      <h4 class="title">Bug Reports</h4>
      <div v-for="(report, index) in reports" :key="report">
        <router-link :to="`/company/submissions/${report._id}`">
          <div class="bugs">
            <div class="image">
              <img
                v-if="users[index].profileImage"
                :src="users[index].profileImage"
                alt=""
              />
              <img v-else src="@/assets/img/user.svg" alt="" />
            </div>
            <div>
              <h6>Report by {{ users[index].username }}</h6>
              <h6 class="did">ID: {{ report._id }}</h6>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import UserService from '../../services/user.service'

export default {
  name: 'Hacktivity',
  data() {
    return {
      company: {},
      reports: false,
      users: false,
      uids: [],
    }
  },
  methods: {
    getCompany() {
      UserService.getMyCompany().then(
        (response) => {
          this.company = response.data
        },
        (error) => {
          this.company =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    getReports() {
      UserService.getCompanyReports().then(
        (response) => {
          this.reports = response.data
          this.loaded = true
          var i
          for (i = 0; i < this.reports.length; i++) {
            this.uids.push(this.reports[i].uid)
          }
          this.getUsers(this.uids)
        },
        (error) => {
          this.reports =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    getUsers(uids) {
      UserService.getUsersfromArray(uids).then(
        (response) => {
          this.users = response.data
        },
        (error) => {
          this.users =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
  },
  mounted() {
    this.getCompany()
    this.getReports()
  },
}
</script>

<style lang="scss" scoped>
.bugs {
  h6 {
    font-size: 1.2em;
  }
}

.image {
  img {
    border-radius: 100%;
  }
}

.title {
  margin-bottom: 0.5em;
}
a:hover {
  color: #222;
}

.bugs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #183c791f;
  margin-bottom: 1em;
  padding: 1.5em;
  border-radius: 1em;
  transition: 0.3s;
  .image {
    img {
      width: 4em;
      margin-right: 1em;
    }
  }
}

.bugs:hover {
  background-color: #8fafe77e;
}

.did {
	font-size: 1em !important;
	color: #222 !important;
}
</style>
