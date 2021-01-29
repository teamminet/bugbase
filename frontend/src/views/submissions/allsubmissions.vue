<template>
  <section class="vh">
    <div class="container">
      <h1 class="med">{{ company.cname }}</h1>
      <br />
      <h3 class="med">Bug Reports</h3>
      <ul>
        <li v-for="report in reports" :key="report">
          <router-link :to="`/company/submissions/${report._id}`">
            {{ report }}
          </router-link>
        </li>
      </ul>
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
  },
  mounted() {
    this.getCompany()
    this.getReports()
  },
}
</script>
