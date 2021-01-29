<template>
  <div class="container">
    <br />
    <h1>
      Create Report for
      <span class="med">{{ company.cname }}</span>
    </h1>
    <br />
    <br />
    <!-- <p>{{ company.inScopeWebsites }}</p> -->

    <div class="row">
      <div class="ten columns">
        <v-md-editor v-model="source" height="500px"></v-md-editor>
      </div>

      <div class="two columns">
        <div class="image flex-center">
          <img
            v-if="company.companyProfileImage"
            :src="company.companyProfileImage"
            alt=""
          />
          <img v-else src="@/assets/img/user.svg" alt="" />
        </div>
        <h4 class="semi center">{{ company.cname }}</h4>
        <br />
        <div class="web">
          <h6 class="semi">In Scope Websites</h6>
          <ul>
            <li v-for="web in company.inScopeWebsites" :key="web">
              {{ web }}
            </li>
          </ul>
        </div>
        <div class="web">
          <h6 class="semi">Out of Scope Websites</h6>
          <ul>
            <li v-for="web in company.outOfScopeWebsites" :key="web">
              {{ web }}
            </li>
          </ul>
        </div>
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
      source: '# Hello',
      preview: false,
      submitted: false,
    }
  },
  methods: {
    togglepreview() {
      this.preview = !this.preview
    },
    submitForm() {
      UserService.submitReport(this.company.cid, this.source).then(
        (response) => {
          this.res = response.data
          this.submitted = true
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

<style lang="scss" scoped>
.flex {
  display: flex;
}

.md {
  margin: 2em 0;
}

.image {
  img {
    border-radius: 2em;
    width: 75%;
    margin-bottom: 0.5em;
  }
}

.web h6 {
  font-size: 1.2em;
}
</style>
