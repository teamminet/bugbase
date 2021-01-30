<template>
  <section class="vh">
    <div class="container">
      <h1>
        Bug report for
        <span class="med">{{ company.cname }}</span>
      </h1>

      <h6>ID: {{ $route.params.id }}</h6>

      <!-- <p v-if="reports">{{ reports }}</p> -->

      <div class="row">
        <div class="six columns">
          <div class="chat">
            <h3 class="semi chattitle">Chat</h3>

            <div class="databro">
              <div v-for="message in reports.chatdata" :key="message">
                <div
                  class="companychat u-pull-left"
                  v-if="message.person === 1"
                >
                  <span class="med">
                    {{ company.cname }}
                  </span>
                  {{ message.bugdata }}
                </div>
                <div
                  v-if="message.person === 0"
                  class="userchat u-pull-right right"
                >
                  {{ message.bugdata }}
                </div>
                <div class="u-cf"></div>
              </div>
            </div>

            <input
              type="text"
              v-model="text"
              v-on:keyup.enter="sendUserMsg"
              placeholder="Message"
							class="messagebox"
            />
          </div>
        </div>
        <br />

        <div class="six columns">
          <div v-if="bugData">
            <vue-simple-markdown
              class="md"
              :source="bugData"
            ></vue-simple-markdown>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Hacktivity',
  data() {
    return {
      company: {},
      reports: false,
      bugData: false,
      text: '',
    }
  },
  methods: {
    getCompany() {
      UserService.getMyCompany().then(
        (response) => {
          this.company = response.data
          this.getReportData(this.$route.params.id)
        },
        (error) => {
          this.company =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    getReportData(bid) {
      UserService.getCompanyReportData(bid).then(
        (response) => {
          this.reports = response.data
          this.loaded = true
          this.bugData = this.reports.chatdata[0].bugdata
        },
        (error) => {
          this.reports =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    sendUserMsg() {
      if (this.text !== '') {
        UserService.sendUserMsg(this.$route.params.id, this.text).then(
          (response) => {
            this.reports = response.data
            this.text = ''
          },
          (error) => {
            this.reports =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString()
          },
        )
      }
    },
  },
  mounted() {
    this.getCompany()
  },
}
</script>

<style scoped>
.md {
  /* color: white; */
  margin: 2em 0;
}

.row {
  margin-top: 2em;
}

.userchat {
  background-color: #709ff050;
  padding: 0.2em 0.5em;
	border-radius: 0.5em;
	margin-bottom: 0.5em;
}

.companychat {
  background-color: #50505025;
  padding: 0.2em 0.5em;
	border-radius: 0.5em;
	margin-bottom: 0.5em;
}

.messagebox {
	margin-top: 0.5em;
}

.chattitle {
	margin-bottom: 0.5em;
}
</style>
