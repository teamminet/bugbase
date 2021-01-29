<template>
  <div class="container">
    <br />
    <div class="vh">
      <div class="row">
        <div class="three columns">
          <div class="image">
            <img
              v-if="profile.profileImage"
              :src="profile.profileImage"
              alt=""
            />
            <img v-else src="@/assets/img/user.svg" alt="" />
          </div>
        </div>
        <div class="nine columns">
          <br />
          <br />
          <div v-if="profile.name">
            <h2 class="semi">{{ profile.name }}</h2>
            <h4>{{ profile.username }}</h4>
          </div>
          <div v-else>
            <h2 class="semi">{{ profile.username }}</h2>
          </div>
          <a :href="profile.website" target="_blank">
            <h6 v-if="profile.website">{{ profile.website.slice(8) }}</h6>
          </a>
        </div>
        <div class="u-cf"></div>
      </div>
      <div class="row">
        <div class="flex-center">
          <div class="three columns">
            <br />
            <br />
            <div class="reputation">
              <h3 class="semi">{{ profile.reputation }}</h3>
              <h6 class="rep">Reputation</h6>
            </div>
            <button @click.prevent="increaseRep" :disabled="increased === true">
              <span v-if="!increased">💖</span>
              <span v-else>🖤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Dashboard',
  data() {
    return {
      profile: {},
      increased: false,
    }
  },
  methods: {
    increaseRep() {
      UserService.increaseRep(this.$route.params.username).then(
        (response) => {
          this.profile = response.data
          this.increased = true
        },
        (error) => {
          this.profile =
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
    // console.log(this.$route.params.username)
    UserService.getHacker(this.$route.params.username).then(
      (response) => {
        this.profile = response.data
      },
      (error) => {
        this.profile =
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
.image {
  img {
    border-radius: 100%;
  }
}

.vh {
  height: 85vh;
  display: flex;
  justify-content: center;
  // align-items: center;
  flex-direction: column;
}

.rep {
  font-size: 1.2em;
}

.reputation {
  text-align: center;
  background-color: rgba($color: #69e, $alpha: 0.2);
  padding: 2em;
  border-radius: 1em;
  margin-bottom: 1em;
}
</style>
