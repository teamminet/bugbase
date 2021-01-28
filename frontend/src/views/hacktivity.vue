<template>
  <section class="vh">
    <div class="container">
      <h1 class="med">Hacktivity</h1>
      <div v-for="company in companies" :key="company.cname">
        <h3>
          <router-link :to="`/hacktivity/${company.cusername}`">
            {{ company.cname }}: {{ company.cusername }}
          </router-link>
        </h3>
      </div>
    </div>
  </section>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Hacktivity',
  data() {
    return {
      companies: [],
    }
  },
  mounted() {
    UserService.getHacktivity().then(
      (response) => {
        this.companies = response.data
      },
      (error) => {
        this.companies =
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
