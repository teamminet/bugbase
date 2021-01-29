<template>
  <div class="container">
    <h1 class="med">Create an organisation</h1>

    <div class="row">
      <!-- <div class="flex-center"> -->
      <div v-if="!submitted" class="six columns">
        <form @submit="createCompany">
          <label for="">Name</label>
          <input
            type="text"
            placeholder="Name of the company"
            v-model="name"
            required
          />

          <label for="">Email</label>
          <input
            type="email"
            placeholder="Company email"
            v-model="email"
            name=""
            id=""
            required
          />

          <label for="">Username</label>
          <input
            type="text"
            placeholder="Username"
            v-model="username"
            required
          />

          <button class="button-primary">Create</button>
        </form>
        <!-- </div> -->
      </div>
      <div v-if="submitted">{{ res.message }}</div>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Hacktivity',
  data() {
    return {
      username: '',
      email: '',
      name: '',
      res: {},
      submitted: false,
    }
  },
  methods: {
    async createCompany(e) {
      e.preventDefault()
      UserService.createCompany(this.name, this.email, this.username).then(
        (response) => {
          this.res = response.data
          this.submitted = true
          window.location.href = '/company/dashboard'
          // this.$router.push('/company/dashboard')
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
  },
  // mounted() {
  //   UserService.getHacktivity().then(
  //     (response) => {
  //       this.companies = response.data;
  //     },
  //     (error) => {
  //       this.companies =
  //         (error.response &&
  //           error.response.data &&
  //           error.response.data.message) ||
  //         error.message ||
  //         error.toString();
  //     }
  //   );
  // },
}
</script>
