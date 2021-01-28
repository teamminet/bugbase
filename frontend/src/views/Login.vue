<template>
  <div class="container">
    <div class="flex-center">
      <div class="six columns">
        <form name="form" @submit.prevent="handleLogin">
          <label for="username">Username</label>
          <input
            v-model="user.username"
            v-validate="'required'"
            type="text"
            name="username"
          />
          <div v-if="errors.has('username')" role="alert">
            Username is required!
          </div>
          <label for="password">Password</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="password"
            class="form-control"
            name="password"
          />
          <div v-if="errors.has('password')" role="alert">
            Password is required!
          </div>
          <button class="button-primary" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Login</span>
          </button>
          <div v-if="message" role="alert">
            {{ message }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import User from '../models/user'

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: '',
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile')
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      this.$validator.validateAll().then((isValid) => {
        if (!isValid) {
          this.loading = false
          return
        }

        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/profile')
            },
            (error) => {
              this.loading = false
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
            },
          )
        }
      })
    },
  },
}
</script>
