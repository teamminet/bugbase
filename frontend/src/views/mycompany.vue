<template>
  <section class="vh">
    <div class="container">
      <!-- <p>{{ currentUser.username }}</p> -->

      <div class="three columns">
        <img
          v-if="company.companyProfileImage"
          :src="company.companyProfileImage"
          alt=""
          class="profileimg"
        />
        <img v-else src="@/assets/img/user.svg" alt="" />
      </div>
      <div class="u-cf"></div>
      <br />
      <h1 class="med">{{ company.cname }}</h1>
      <br />

      <div class="row">
        <!-- left -->

        <div class="seven columns" v-if="company.description">
          <!-- <h5 class="semi">Description</h5> -->
          <vue-simple-markdown
            class="md"
            :source="company.description"
          ></vue-simple-markdown>
        </div>

        <!-- right -->

        <div class="five columns">
          <div class="row">
            <div v-if="members">
              <h5 class="semi">Members</h5>
              <div v-for="member in members" :key="member">
                <div class="flex">
                  <div class="image">
                    <img
                      v-if="member.profileImage"
                      :src="member.profileImage"
                      alt=""
                    />
                    <img src="@/assets/img/user.svg" v-else alt="" />
                  </div>
                  <div class="member-text">
                    <h5 v-if="member.name">{{ member.name }}</h5>
                    <h5 v-else>{{ member.username }}</h5>
                  </div>
                  <img
                    src="@/assets/img/close.png"
                    alt=""
                    class="close"
                    @click.prevent="removeUser(member.username)"
                  />
                </div>
                <!-- {{ member }} -->
              </div>
            </div>
          </div>
          <br />
          <div class="row">
            <h5 class="semi">Add Members</h5>
            <h5 v-if="responsemsg">{{ responsemsg }}</h5>
            <input
              v-model="userToAdd"
              type="text"
              placeholder="Member username"
            />
            <br />
            <button @click="addAUser">add members</button>
          </div>
          <br />
          <div v-if="competitions">
            <h5 class="semi">Competitions</h5>
            <div class="competitionyo" v-for="comp in competitions" :key="comp">
              <p v-if="comp.isComplete === false">
                <span>
                  <router-link :to="`/competition/edit/${comp._id}`">
                    Competition: {{ comp._id }}
                  </router-link>
                </span>
                <a href @click.prevent="endComp(comp._id)">
                  <img src="@/assets/img/close.png" class="closecomp" alt="" />
                </a>
              </p>
            </div>
          </div>
          <br />
          <h5 class="semi">Quick Links</h5>
          <router-link to="/company/submissions">
            <button>Check bug reports</button>
          </router-link>
          <router-link to="/competition/create">
            <button>Create a competition</button>
          </router-link>

          <router-link to="/company/dashboard/edit">
            <button>edit company</button>
          </router-link>
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
      members: [],
      userToAdd: '',
      responsemsg: false,
      competitions: false,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    fetchCompany() {
      UserService.getMyCompany().then(
        (response) => {
          this.company = response.data
          this.getCompanyMembers()
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
    getCompanyMembers() {
      UserService.getCompanyMembers(this.company.cusername).then(
        (response) => {
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
    addAUser() {
      UserService.addUserToCompany(this.userToAdd).then(
        (response) => {
          this.company = response.data
          this.userToAdd = ''
          this.responsemsg = 'User added succesfully'
          this.getCompanyMembers()
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
    removeUser(username) {
      UserService.removeUserFromCompany(username).then(
        (response) => {
          this.company = response.data
          if (username == this.currentUser.username) {
            window.location.href = '/profile'
          } else {
            this.getCompanyMembers()
          }
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
    getAllCompetitions() {
      UserService.getAllCompetitions().then(
        (response) => {
          this.competitions = response.data
        },
        (error) => {
          this.competitions =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    endComp(compid) {
      UserService.endCompetition(compid).then(
        () => {
          // (response) => {
          this.getAllCompetitions()
        },
        (error) => {
          this.competitions =
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
    this.fetchCompany()
    this.getAllCompetitions()
  },
}
</script>
<style lang="scss" scoped>
.profileimg {
  border-radius: 1em;
}
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.image {
  width: 15%;
  margin-right: 1.5em;
  img {
    border-radius: 1em;
    border-radius: 100%;
  }
}

.profileimg {
  border-radius: 1em;
}
.close {
  margin-left: 1.5em;
  width: 8%;
}

.close:hover {
  cursor: pointer;
}

.closecomp {
  width: 1.5em;
  margin-left: 0.5em;
  margin-bottom: -0.2em;
}
.competitionyo {
  margin-bottom: 0.2em;
}
</style>
