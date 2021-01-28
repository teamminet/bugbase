<template>
  <section class="vh">
    <div class="container">
      <h1 class="med">{{ company.cname }}</h1>
			<br>
      <!-- <p>{{ company }}</p> -->
      <h3 class="med">Bug Reports</h3>
      <ul>
        <li v-for="report in company.receivedBugs" :key="report">
          <router-link :to="`/company/submissions/${report}`">
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
    }
  },
  mounted() {
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
}
</script>
