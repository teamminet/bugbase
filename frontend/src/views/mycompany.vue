<template>
  <section class="vh">
    <div class="container">
      <h1 class="med">{{ company.cname }}</h1>
      <p>{{ company }}</p>
      <h3 class="med">Members</h3>
      <ul>
        <li v-for="member in company.members" :key="member">{{ member }}</li>
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
      userToAdd: '',
      responsemsg: false,
    }
  },
  methods: {
    fetchCompany() {
      UserService.getMyCompany().then(
        (response) => {
          this.company = response.data
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
  },
  mounted() {
    this.fetchCompany()
  },
}
</script>
