<template>
  <div class="container">
    <div class="three columns">
      <img
        v-if="company.companyProfileImage"
        :src="company.companyProfileImage"
        alt=""
        class="profileimg"
      />
      <img v-else src="@/assets/img/user.svg" alt="" class="profileimg" />
    </div>
    <div class="u-cf"></div>
    <br />
    <h1 class="med">{{ company.cname }}</h1>
    <br />
    <div class="row">
      <div class="eight columns">
        <div class="bounty" v-if="company.bountyVals">
          <div class="row">
            <div class="three columns">
              <div class="circle green"></div>
              ₹{{ company.bountyVals.low }}
              <div class="semi">Low</div>
            </div>

            <div class="three columns">
              <div class="circle yellow"></div>
              ₹{{ company.bountyVals.medium }}
              <div class="semi">Medium</div>
            </div>

            <div class="three columns">
              <div class="circle orange"></div>
              ₹{{ company.bountyVals.high }}
              <div class="semi">High</div>
            </div>

            <div class="three columns">
              <div class="circle red"></div>
              ₹{{ company.bountyVals.critical }}
              <div class="semi">Critical</div>
            </div>
          </div>
          <h6 class="note">
            Our rewards are based on severity per CVSS (the Common Vulnerability
            Scoring Standard). Please note these are general guidelines, and
            that reward decisions are up to the discretion of
            {{ company.cname }}.
          </h6>
        </div>
        <br />
        <vue-simple-markdown
          v-if="company.description"
          :source="company.description"
          class="md"
        ></vue-simple-markdown>
      </div>

      <div class="four columns">
        <router-link :to="`/hacktivity/${company.cusername}/report`">
          <button>Submit a Report</button>
        </router-link>
        <br />
        <br />
        <div v-if="members">
          <h5 class="semi">Members</h5>
          <div v-for="member in members" :key="member">
            <router-link :to="`/hacker/${member.username}`">
              <div class="flex">
                <div class="image">
                  <img
                    v-if="member.profileImage"
                    :src="member.profileImage"
                    alt=""
                  />
                  <img src="@/assets/img/user.svg" v-else alt="" />
                </div>
                <div class="memname">
                  <h5 v-if="member.name">{{ member.name }}</h5>
                  <h5 v-else>{{ member.username }}</h5>
                </div>
              </div>
            </router-link>
            <!-- {{ member }} -->
          </div>
          <br />
        </div>
        <div class="web" v-if="company.inScopeWebsite">
          <h6 class="semi">In Scope Websites</h6>
          <ul>
            <li v-for="web in company.inScopeWebsites" :key="web">
              {{ web }}
            </li>
          </ul>
        </div>
        <div class="web" v-if="!company.outOfScopeWebsites === []">
          <h6 class="semi">Out of Scope Websites</h6>
          <ul>
            <li v-for="web in company.outOfScopeWebsites" :key="web">
              {{ web }}
            </li>
          </ul>
        </div>
        <br />
        <div class="competitions">
          <h5 class="semi">Competitions</h5>
          <div v-for="(comp, index) in competitions" :key="comp.compid">
            <h6>
              <router-link :to="`/competition/${comp.compid}`">
                Competition {{ index + 1 }}
              </router-link>
            </h6>
          </div>
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
      company: '',
      members: false,
      competitions: false,
    }
  },
  mounted() {
    this.fetchCompany()
    // console.log(this.$route.params.company)
    this.getCompanyMembers(this.$route.params.company)
  },
  methods: {
    getCompanyMembers(cusername) {
      UserService.getCompanyMembers(cusername).then(
        (response) => {
          console.log(response)
          this.members = response.data
        },
        (error) => {
          this.members =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    fetchCompany() {
      UserService.getSpecificComp(this.$route.params.company).then(
        (response) => {
          this.company = response.data
          this.getCompetitions(this.company.cid)
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
    getCompetitions(cid) {
      UserService.getSpecificCompetitionforCompany(cid).then(
        (response) => {
          this.competitions = response.data
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
}
</script>

<style lang="scss" scoped>
.md {
  margin-bottom: 2em;
  h1 {
    margin-bottom: 0 !important;
  }
}

.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.image {
  width: 15%;
  margin-right: 2em;
  img {
    border-radius: 1em;
  }
}

.profileimg {
  border-radius: 1em;
}

.bounty {
  background-color: rgba($color: #69e, $alpha: 0.1);
  padding: 2em;
  border-radius: 2em;
}

.circle {
  width: 27.5px;
  height: 6px;
  border-radius: 1em;
  border: solid 0.5px #222;
  margin-bottom: 0.2em;
}
.circle.red {
  background-color: rgb(247, 64, 64);
}
.circle.green {
  background-color: rgb(60, 221, 159);
}
.circle.orange {
  background-color: rgb(250, 184, 61);
}
.circle.yellow {
  background-color: rgb(247, 244, 91);
}

.note {
  margin: 0;
  margin-top: 0.75em;
}

.competitions {
  background-color: #0f3d8d0e;
  padding: 2em;
  border-radius: 1em;
  h5 {
    text-align: center;
    margin-bottom: 0.5em;
  }
  h6 {
    font-size: 1.2em;
    margin-bottom: 0.2em;
  }
}

.memname {
  h5 {
		margin-top: -0.3em;
		margin-left: -0.8em;
  }
}
</style>
