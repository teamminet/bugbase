at
<template>
  <div class="container">
    <h1>Edit Competition</h1>
    <h5 v-if="respond">{{ respond }}</h5>
    <h5 v-if="competition">{{ competition }}</h5>
    <br />
    <br />
    <br />
    <p v-if="newData">{{ newData }}</p>
    <br />
    <br />
    <br />
    <div v-for="(qs, index) in competition.compdata" :key="qs">
      {{ qs }}
      <label for="">number</label>
      <input type="text" v-model="newData[index].number" />

      <label for="">question</label>
      <input type="text" v-model="newData[index].question" />

      <label for="">answer</label>
      <input type="text" v-model="newData[index].answer" />

      <label for="">points</label>
      <input type="text" v-model="newData[index].points" />
    </div>

    <button @click.prevent="submitEdits">Save edits</button>
    <!-- <div class="row">
      <div class="six columns">
        <label for="">qnumber</label>
        <input type="text" v-model="qlength" />

        <label for="">question</label>
        <input type="text" v-model="qdata.question" />

        <label for="">points</label>
        <input type="text" v-model="qdata.points" />

        <label for="">answer</label>
        <input type="text" v-model="qdata.answer" />

        <label for="">link</label>
        <input type="text" v-model="qdata.link" />

        <button @click.prevent="addQuestion">add</button>

        <br />
        <br />
        <br />
        <br />
        <button @click.prevent="submitComp">submit</button>
      </div>
    </div> -->
  </div>
</template>

<script>
import UserService from '../../services/user.service'

export default {
  name: 'Company',
  data() {
    return {
      qlength: 1,
      respond: false,
      questions: [],
      competition: false,
      newData: [
        {
          number: '',
          question: '',
          answer: '',
          points: '',
        },
      ],
      qdata: {
        question: '',
        points: '',
        answer: '',
        link: '',
      },
    }
  },
  methods: {
    submitEdits() {
      UserService.submitEdit(this.$route.params.id, this.newData).then(
        (response) => {
          this.respond = response.data
          this.$router.push(`/competition/${this.respond._id}`)
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
    addQuestion() {
      this.questions.push({
        number: this.qlength,
        question: this.qdata.question,
        points: this.qdata.points,
        answer: this.qdata.answer,
        link: this.qdata.link,
      })
      this.qdata.question = ''
      this.qdata.points = ''
      this.qdata.answer = ''
      this.qdata.link = ''
      this.qlength = this.questions.length + 1
    },
    getCompData() {
      UserService.getAllCompetitions(this.$route.params.id).then(
        (response) => {
          this.competition = this.search(this.$route.params.id, response.data)
          let i = 0
          for (i = 0; i < this.competition.compdata.length; i++) {
            this.newData[i] = this.competition.compdata[i]
          }
        },
        (error) => {
          this.competition =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    search(nameKey, myArray) {
      for (var i = 0; i < myArray.length; i++) {
        if (myArray[i]._id === nameKey) {
          return myArray[i]
        }
      }
    },
  },
  mounted() {
    // this.fetchCompany()
    this.getCompData()
  },
}
</script>

<style lang="scss" scoped></style>
