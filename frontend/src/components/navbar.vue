<template>
  <nav>
    <div class="container">
      <div class="nav">
        <router-link to="/">BugBase</router-link>
        <ul class="zero">
          <li v-if="currentUser">
            <router-link to="/hacktivity">
              Hacktivity
            </router-link>
          </li>
        </ul>
        <ul class="zero">
          <li v-if="currentUser">
            <router-link to="/dashboard">
              Dashboard
            </router-link>
          </li>
        </ul>

        <ul class="zero">
          <li v-if="currentUser && reqComplete && profile.isInACompany.name == ''">
            <router-link to="/company/make">
              Create
            </router-link>
          </li>
        </ul>

        <ul v-if="!currentUser" class="zero">
          <li>
            <router-link to="/register">
              Sign Up
            </router-link>
          </li>
          <li>
            <router-link to="/login">
              Login
            </router-link>
          </li>
        </ul>

        <ul v-if="currentUser" class="zero">
          <li>
            <router-link to="/profile">
              {{ currentUser.username }}
            </router-link>
          </li>
          <li>
            <a href @click.prevent="logOut">
              Logout
            </a>
          </li>

          <li v-if="reqComplete && !profile.isInACompany.name == ''">
            <router-link to="/company/dashboard">
              {{ profile.isInACompany.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import UserService from '../services/user.service'

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  data() {
    return {
      profile: {},
      reqComplete: false,
    }
  },
  mounted() {
    UserService.getProfile().then(
      (response) => {
        this.profile = response.data
        this.reqComplete = true
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
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
nav {
  background-color: rgb(25, 25, 25);
}
.nav {
  display: flex;
  /* align-items: center;
  justify-content: space-around;
  text-align: center; */
  /* font-size: 22px; */
}

/* nav a {
  color: #00d6da;
}
nav a:hover {
  color: #007fef;
} */
.nav ul {
  display: flex;
}
</style>
