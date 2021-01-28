<template>
  <section class="vh">
    <div class="container">
      <h1 class="med">Dashboard</h1>
      <h3 v-if="content.reputation">Reputation: {{ content.reputation }}</h3>
      <div v-if="!content.programsJoined === []">
        <h3>Programs joined: {{ content.programsJoined }}</h3>
        <p>map through this once you add actual data ^</p>
      </div>
    </div>
  </section>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Dashboard',
  data() {
    return {
      content: '',
    }
  },
  mounted() {
    UserService.getProfile().then(
      (response) => {
        this.content = response.data
      },
      (error) => {
        this.content =
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
