<template>
  <nav>
    <div class="nav">
      <router-link to="/">
        <img class="logo" src="@/assets/img/logo.png" alt="" />
      </router-link>

      <router-link v-if="currentUser" to="/profile">
        <img src="@/assets/img/user.svg" alt="" />
        @{{ currentUser.username }}
      </router-link>

      <router-link v-if="currentUser" to="/hacktivity">
        <img src="@/assets/img/user.svg" alt="" />
        Hacktivity
      </router-link>

      <router-link v-if="currentUser" to="/leaderboard">
        <img src="@/assets/img/user.svg" alt="" />
        Leaderboard
      </router-link>

      <!-- <router-link v-if="currentUser" to="/dashboard">
        <img src="@/assets/img/user.svg" alt="" />
        Dashboard
      </router-link> -->

      <router-link
        v-if="currentUser && reqComplete && !profile.isInACompany.isIn"
        to="/company/make"
      >
        <img src="@/assets/img/user.svg" alt="" />
        Create
      </router-link>

      <router-link v-if="!currentUser" to="/register">
        <img src="@/assets/img/user.svg" alt="" />
        Sign Up
      </router-link>

      <router-link v-if="!currentUser" to="/login">
        <img src="@/assets/img/user.svg" alt="" />
        Login
      </router-link>

      <router-link
        v-if="currentUser && reqComplete && profile.isInACompany.isIn"
        to="/company/dashboard"
      >
        <img src="@/assets/img/user.svg" alt="" />
        {{ profile.isInACompany.cname }}
      </router-link>

      <a v-if="currentUser" href @click.prevent="logOut">
        <img src="@/assets/img/logout.png" alt="" />
        <!-- Logout -->
      </a>
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
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
    getProfileData() {
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
  },
  mounted() {
    this.getProfileData()
  },
}
</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  text-align: center;
  p {
    margin: 0;
  }
  img {
    width: 50%;
    display: none;
  }
  a {
    img {
      margin-bottom: 0.1em;
    }
    color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  a:hover {
    color: #007fef;
  }
}

@media (min-width: 750px) {
  .nav {
    justify-content: space-around;
    flex-direction: column;
    img {
      display: block;
    }
  }
}
</style>
