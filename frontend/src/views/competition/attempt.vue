at
<template>
  <div class="container">
    <h1>Attempt Competition</h1>
    <h5 v-if="respond">{{ respond }}</h5>
    <h5 v-if="ansrespond">{{ ansrespond }}</h5>
    <br />
    <br />
    <!-- {{ answers }} -->
    <div v-for="(qs, index) in respond.compdata" :key="qs.number">
      <p>{{ qs }}: {{ qs.question }}</p>
      <div v-if="!respond.submissions">
        <input
          type="text"
          placeholder="Enter to submit"
          v-on:keyup.enter="
            submitAnswer(qs.qid, answers[index], $route.params.id) &&
              clearAns(index)
          "
          v-model="answers[index]"
        />
      </div>
      <p v-else>answered already</p>
    </div>
  </div>
</template>

<script>
import UserService from '../../services/user.service'

export default {
  name: 'Company',
  data() {
    return {
      respond: false,
      ansrespond: false,
      answers: [],
    }
  },
  methods: {
    submitAnswer(qid, answer, compid) {
      UserService.submitAnswer(qid, answer, compid).then(
        (response) => {
          this.ansrespond = response.data
        },
        (error) => {
          this.ansrespond =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    getSpecificComp() {
      UserService.getSpecificCompetition(this.$route.params.id).then(
        (response) => {
          this.respond = response.data
        },
        (error) => {
          this.respond =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    clearAns(index) {
      this.answers[index] = ''
    },
  },
  mounted() {
    // this.fetchCompany()
    this.getSpecificComp()
  },
}
</script>

<style lang="scss" scoped></style>
