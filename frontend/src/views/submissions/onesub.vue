<template>
  <section class="vh">
    <div class="container">
      <br />
      <h1 class="med">{{ company.cname }}</h1>

      <h6>ID: {{ $route.params.id }}</h6>
      <br />
      <br />
      <!-- <p v-if="reports">{{ reports }}</p> -->
      <div class="row">
        <div class="six columns">
          <div class="chat">
            <h3 class="med chattitle">Chat</h3>

            <div class="databro">
              <div v-for="message in reports.chatdata.slice(1)" :key="message">
                <div
                  class="companychat u-pull-right right"
                  v-if="message.person === 1"
                >
                  {{ message.bugdata }}
                </div>
                <div v-if="message.person === 0" class="userchat u-pull-left">
                  <span class="med">
                    User
                  </span>
                  {{ message.bugdata }}
                </div>
                <div class="u-cf"></div>
              </div>
            </div>

            <input
              type="text"
              v-model="text"
              v-on:keyup.enter="sendCompanyMsg"
              placeholder="Message"
              class="messagebox"
            />
          </div>
        </div>
        <div class="six columns">
          <h3 class="med chattitle">Report</h3>
          <div v-if="bugData">
            <vue-simple-markdown
              class="md"
              :source="bugData"
            ></vue-simple-markdown>
          </div>
        </div>
      </div>
      <br />
    </div>
  </section>
</template>

<script>
import UserService from '../../services/user.service'

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
    sendCompanyMsg() {
      if (this.text !== '') {
        UserService.sendCompanyMsg(this.$route.params.id, this.text).then(
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
  margin: 2em 0;
}

.chattitle {
  margin-bottom: 0.5em;
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
