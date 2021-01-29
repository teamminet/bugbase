<template>
  <div class="container">
    <div class="vh">
      <div class="flex-center">
        <div class="six columns">
          <router-link to="/">
            <img src="@/assets/img/bugbase.svg" alt="" class="bugbase" />
          </router-link>
          <h5 class="semi">Sign up</h5>
          <form name="form" @submit.prevent="handleRegister">
            <div v-if="!successful">
              <label for="username">Username</label>
              <input
                v-model="user.username"
                v-validate="'required|min:3|max:20'"
                type="text"
                class="form-control"
                name="username"
              />
              <div
                v-if="submitted && errors.has('username')"
                class="alert-danger"
              >
                {{ errors.first('username') }}
              </div>
              <label for="email">Email</label>
              <input
                v-model="user.email"
                v-validate="'required|email|max:50'"
                type="email"
                class="form-control"
                name="email"
              />
              <div v-if="submitted && errors.has('email')" class="alert-danger">
                {{ errors.first('email') }}
              </div>
              <label for="password">Password</label>
              <input
                v-model="user.password"
                v-validate="'required|min:6|max:40'"
                type="password"
                class="form-control"
                name="password"
              />
              <div
                v-if="submitted && errors.has('password')"
                class="alert-danger"
              >
                {{ errors.first('password') }}
              </div>
              <button>Sign Up</button>
            </div>
          </form>

          <h5 class="yoz">
            <router-link to="/login">Already have an account?</router-link>
          </h5>

          <div
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from '../models/user'

export default {
  name: 'Register',
  data() {
    return {
      user: new User('', '', ''),
      submitted: false,
      successful: false,
      message: '',
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile')
    }
  },
  methods: {
    handleRegister() {
      this.message = ''
      this.submitted = true
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            (data) => {
              this.message = data.message
              this.successful = true
            },
            (error) => {
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
              this.successful = false
            },
          )
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.vh {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
.bugbase {
  width: 80%;
}

.yoz {
  margin-top: -0.75em;
  font-size: 1.2em;
}
</style>
