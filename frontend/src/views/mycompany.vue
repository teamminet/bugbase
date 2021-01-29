<template>
  <section class="vh">
    <div class="container">
      <h1 class="med">{{ company.cname }}</h1>
      <p>{{ currentUser.username }}</p>
      <p>{{ company }}</p>
      <h3 class="med">Members</h3>
      <ul v-if="!members == []">
        <p>{{ members }}</p>
        <li v-for="member in members" :key="member">
          <span v-if="!member.name === null">{{ member.name }}</span>
          <span v-else>{{ member.username }}</span>
          :
          <a href @click.prevent="removeUser(member.username)">
            remove from company
          </a>
        </li>
        <!-- <li v-for="member in company.members" :key="member">{{ member }}: <a href @click.prevent="removeUser(member)">remove this user</a></li> -->
      </ul>

      <label>Add Members</label>
      <h5 v-if="responsemsg">{{ responsemsg }}</h5>
      <input v-model="userToAdd" type="text" placeholder="Member username" />
      <button @click="addAUser">add members</button>

      <router-link to="/company/submissions">
        <button>Check bug reports</button>
      </router-link>
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
  },
  mounted() {
    this.fetchCompany()
  },
}
</script>
