<template>
  <div class="container">
    <h1 class="med">Create Report for {{ company.cname }}</h1>

    <p>{{ company }}</p>

    <div v-if="!submitted">
      <div class="flex">
        <button v-on:click="togglepreview()">toggle preview</button>
      </div>

      <textarea
        name=""
        v-if="preview === false"
        placeholder="Write markdown here"
        v-model="source"
        id=""
        cols="30"
        rows="10"
      ></textarea>

      <div v-if="preview === true">
        <vue-simple-markdown class="md" :source="source"></vue-simple-markdown>
      </div>

      <button v-on:click="submitForm()">submit</button>
    </div>
    <div v-if="submitted">
      {{ res }}
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
.md {
  color: #fff;
}

.flex {
  display: flex;
}
</style>
