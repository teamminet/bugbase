<template>
  <div class="container">
    <h1 class="semi">Create Competition</h1>
    <br />
    <h5 v-if="respond">{{ respond }}</h5>
    <div class="row form">
      <div class="six columns">
        <label for="">Question Number</label>
        <input type="text" v-model="qlength" />

        <label for="">Question</label>
        <input type="text" v-model="qdata.question" />

        <label for="">Points</label>
        <input type="text" v-model="qdata.points" />

        <label for="">Correct answer</label>
        <input type="text" v-model="qdata.answer" />

        <label for="">Link</label>
        <input type="text" v-model="qdata.link" />
        <br/>
        <br/>
        <button @click.prevent="addQuestion">Add</button>
        <br />
        <br />
        <br />
        <br />
        <button @click.prevent="submitComp">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../../services/user.service";

export default {
  name: "Company",
  data() {
    return {
      qlength: 1,
      respond: false,
      questions: [],
      qdata: {
        question: "",
        points: "",
        answer: "",
        link: "",
      },
    };
  },
  methods: {
    submitComp() {
      UserService.createCompetition(this.questions).then(
        (response) => {
          this.respond = response.data;
          this.$router.push(`/competition/${this.respond._id}`);
        },
        (error) => {
          this.respond =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    addQuestion() {
      this.questions.push({
        number: this.qlength,
        question: this.qdata.question,
        points: this.qdata.points,
        answer: this.qdata.answer,
        link: this.qdata.link,
      });
      this.qdata.question = "";
      this.qdata.points = "";
      this.qdata.answer = "";
      this.qdata.link = "";
      this.qlength = this.questions.length + 1;
    },
  },
  mounted() {
    // this.fetchCompany()
    // this.getCompanyMembers()
  },
};
</script>

<style lang="scss" scoped>
.form {
  border: 1px transparent;
  border-radius: 30px;
  display: flex;
  justify-content: flex-start;
}
input {
    border: 1px transparent;
    border-radius: 30px;
    background-color: rgba(171, 210, 255, 0.31);
  }
</style>
