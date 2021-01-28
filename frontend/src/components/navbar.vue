<template>
  <nav>
    <router-link to="/">BugBase</router-link>
    <ul class="zero">
      <li v-if="currentUser">
        <router-link to="/hacktivity">
          Hacktivity
        </router-link>
      </li>
    </ul>

    <ul v-if="!currentUser" class="zero">
      <li>
        <router-link to="/register">
          Sign Up
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/login">
          Login
        </router-link>
      </li>
    </ul>

    <ul v-if="currentUser" class="zero">
      <li class="nav-item">
        <router-link to="/profile">
          {{ currentUser.username }}
        </router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link" href @click.prevent="logOut">
          LogOut
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
nav {
  display: flex;
  background-color: rgb(20, 20, 20);
}

nav a {
  color: #fff;
}

nav ul {
  display: flex;
}
</style>
