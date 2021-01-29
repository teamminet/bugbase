<template>
  <div class="container">
    <div class="vh">
      <!-- <div class="row"> -->
      <!-- <div class="flex-center"> -->
      <div v-if="!submitted" class="ten columns">
        <form @submit="createCompany">
          <div v-if="step === 0">
            <!-- <h3 class="semi titlething">Create an organisation</h3> -->
            <!-- <label for="">Name</label> -->
            <input
              type="text"
              placeholder="Name of the company"
              v-model="name"
              required
            />
            <div class="three columns u-pull-right">
              <button @click.prevent="changeStep('front')">
                Next
              </button>
            </div>
            <div class="u-cf"></div>
          </div>

          <div v-if="step === 1">
            <input
              type="email"
              placeholder="Company email"
              v-model="email"
              name=""
              id=""
              required
            />
            <div class="row">
              <div class="three columns u-pull-left">
                <button @click.prevent="changeStep('back')">
                  Back
                </button>
              </div>
              <div class="three columns u-pull-right">
                <button @click.prevent="changeStep('front')">
                  Next
                </button>
              </div>
            </div>
            <div class="u-cf"></div>
          </div>

          <div v-if="step === 2">
            <!-- <label for="">Username</label> -->
            <input
              type="text"
              placeholder="Username"
              v-model="username"
              required
            />
            <div class="row">
              <div class="three columns u-pull-left">
                <button @click.prevent="changeStep('back')">
                  Back
                </button>
              </div>
              <div class="three columns u-pull-right">
                <button>Create</button>
              </div>
            </div>
            <div class="u-cf"></div>
          </div>

          <div class="flex-center">
            <div class="six columns"></div>
          </div>
        </form>
        <!-- </div> -->
      </div>
      <div v-if="submitted">{{ res.message }}</div>
      <!-- </div> -->
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
      step: 0,
    }
  },
  methods: {
    async createCompany(e) {
      e.preventDefault()
      UserService.createCompany(this.name, this.email, this.username).then(
        (response) => {
          this.res = response.data
          this.submitted = true
          window.location.href = '/company/dashboard/edit'
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
    changeStep(yoz) {
      if (yoz == 'front') {
        this.step = this.step + 1
      } else if (yoz == 'back') {
        this.step = this.step - 1
      }
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

<style lang="scss" scoped>
.vh {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.titlething {
  margin-bottom: 0.5em;
}

input {
  border: none;
  background-color: transparent;
  font-size: 3em;
  height: 3em;
}

input:active,
input:focus {
  border: none;
}
</style>
