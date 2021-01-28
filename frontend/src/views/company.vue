<template>
  <div class="container">
    <h1 class="med">{{ company.cname }}</h1>
    <p>{{ company }}</p>

    <div class="row">
      <div class="six columns">
        <router-link :to="`/hacktivity/${company.cusername}/report`">
          <button>Submit a Report</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Company',
  data() {
    return {
      res: {},
      company: {},
    }
  },
  mounted() {
    UserService.getSpecificComp(this.$route.params.company).then(
      (response) => {
        this.company = response.data
      },
      (error) => {
        this.res =
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

<style lang="scss" scoped></style>
