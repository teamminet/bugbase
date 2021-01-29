<template>
  <div class="container">
    <h1 class="med">{{ $route.params.username }}</h1>
    <p v-if="profile">{{ profile }}</p>
    <div class="row">
      <h5>Reputation: {{ profile.reputation }}</h5>
      <div class="row">
        <div class="four columns">
          <button @click.prevent="increaseRep" :disabled="increased === true">
            <span v-if="!increased">increase rep</span>
            <span v-else>done</span>
          </button>
        </div>
        <div class="u-cf"></div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Dashboard',
  data() {
    return {
      profile: {},
      increased: false,
    }
  },
  methods: {
    increaseRep() {
      UserService.increaseRep(this.$route.params.username).then(
        (response) => {
					this.profile = response.data
					this.increased = true
        },
        (error) => {
          this.profile =
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
    // console.log(this.$route.params.username)
    UserService.getHacker(this.$route.params.username).then(
      (response) => {
        this.profile = response.data
      },
      (error) => {
        this.profile =
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
