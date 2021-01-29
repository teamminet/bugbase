<template>
  <div class="container">
		<br>
    <h1 class="med">Leaderboard</h1>
    <table class="leaderboardtable">
      <tr class="header">
        <th class="center">Rank</th>
        <th class="center">Username</th>
        <th class="center">Reputation</th>
      </tr>

      <tr v-for="(prsn, index) in leaderboard" :key="prsn.id">
        <td class="center ranking">{{ index + 1 }}</td>
        <td id="name">
          <router-link :to="`/hacker/${prsn.username}`">
            {{ prsn.username }}
          </router-link>
        </td>
        <td class="center">{{ prsn.reputation }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Company',
  data() {
    return {
      res: false,
      leaderboard: {},
    }
  },
  mounted() {
    UserService.getLeaderboard().then(
      (response) => {
        this.leaderboard = response.data
      },
      (error) => {
        this.leaderboard =
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
.leaderboardtable {
  margin: 2em 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  overflow: scroll;
  margin-bottom: 4em;
}
.center {
  text-align: center;
}
td:hover {
  background-color: #f5f5f521;
}
td,
th {
  padding: 12px;
}
.iconldrb {
  width: 20%;
}
@media (max-width: 750px) {
  td,
  th {
    font-size: 1em;
  }
  .tableimg {
    width: 3em;
  }
}
</style>
