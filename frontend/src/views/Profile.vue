<template>
  <section class="vh">
    <div class="container">
      <img src="@/assets/img/bg.png" class="backg" alt="" />
      <div class="row overlap">
        <div class="two columns">
          <img
            v-if="content.profileImage"
            :src="content.profileImage"
            class="profilepic"
            alt=""
          />
          <img v-else src="@/assets/img/user.svg" class="profilepic" alt="" />
        </div>
        <div class="ten columns">
          <h5 class="user">
            <i>@{{ content.username }}</i>
            <router-link to="/profile/edit">
              <img src="@/assets/img/edit.png" class="edit" alt="" />
            </router-link>
          </h5>
        </div>
      </div>
      <div class="u-cf"></div>

      <div class="row profilestuff" v-if="content.isInACompany">
        <div class="six columns">
          <router-link
            v-if="content.isInACompany.isIn === true"
            to="/company/dashboard"
          >
            <div class="company">
              <h4 class="semi center">{{ content.isInACompany.cname }}</h4>
            </div>
          </router-link>

          <br />

          <div class="reports" v-if="reports && users">
            <h4 class="semi reptitle">Reports</h4>
            <div v-for="(report, index) in reports" :key="report._id">
              <router-link :to="`/bug/${report._id}`">
                <h6>
                  {{ index + 1 }}. Report by
                  <span class="med">{{ users[index].username }}</span>
                </h6>
              </router-link>
            </div>
          </div>
        </div>

        <div class="six columns">
          <div class="rep">
            <h3 class="semi center">{{ content.reputation }}</h3>
            <h6 class="center semi">Reputation</h6>
          </div>
          <div>
            <br />
            <div class="website">
              <h3 class="semi center">{{ Math.floor(Math.random() * 11) }}</h3>
              <h6 class="center semi">Rank</h6>
            </div>
          </div>
          <div v-if="content.website">
            <br />
            <a :href="content.website" target="_blank">
              <div class="website">
                <h4 class="center">{{ content.website.slice(8) }}</h4>
                <h6 class="center semi">Website</h6>
              </div>
            </a>
          </div>
          <!-- <div v-if="content.email">
            <br />
            <a :href="`mailto:${content.email}`" target="_blank">
              <div class="website">
                <h4 class="center">{{ content.email }}</h4>
                <h6 class="center semi">Email</h6>
              </div>
            </a>
          </div> -->
        </div>
      </div>

      <!-- <br /> -->
      <!-- <br /> -->

      <!-- <p v-if="content">{{ users }}</p> -->

      <!-- <br /> -->
      <!-- <br /> -->
    </div>
  </section>
</template>

<script>
import UserService from '../services/user.service'

export default {
  name: 'Dashboard',
  data() {
    return {
      content: {},
      reports: false,
      loaded: false,
      changed: false,
      image: '',
      imgRes: {},
      users: false,
      uids: [],
    }
  },
  methods: {
    handleImage(e) {
      const selectedImage = e.target.files[0]
      this.changed = false
      if (selectedImage.size > 1024 * 1024 * 2) {
        alert('File too big (> 2MB)')
        this.$refs.inputFile.value = null
        this.image = ''
        this.changed = false
        return
      }

      this.createBase64Image(selectedImage)
    },
    createBase64Image(fileObject) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.image = e.target.result
      }
      reader.readAsDataURL(fileObject)
    },
    updateProfilePic() {
      UserService.updateProfilePic(this.image).then(
        (response) => {
          this.imgRes = response
          this.changed = true
          this.fetchProfile()
        },
        (error) => {
          this.imgRes =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    fetchProfile() {
      UserService.getProfile().then(
        (response) => {
          this.content = response.data
          this.loaded = true
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    getReports() {
      UserService.getUserReports().then(
        (response) => {
          this.reports = response.data
          this.loaded = true
          this.getUIDs()
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
    getUIDs() {
      var i
      for (i = 0; i < this.reports.length; i++) {
        this.uids.push(this.reports[i].uid)
      }
      this.getUsers(this.uids)
    },
    getUsers(arr) {
      UserService.getUsersfromArray(arr).then(
        (response) => {
          this.users = response.data
        },
        (error) => {
          this.users =
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
    this.fetchProfile()
    this.getReports()
  },
}
</script>

<style lang="scss" scoped>
.profilepic {
  border-radius: 100%;
  z-index: 2;
  margin-left: 2em;
}

.user {
  margin-top: 3em;
  // margin-left: -0.6em;
  margin-left: 0.25em;
}

.edit {
  width: 1em;
  margin-left: 0.5em;
  margin-bottom: -0.15em;
  transition: 0.5s;
}

.edit:hover {
  margin-bottom: 0;
}

.overlap {
  // margin-bottom: -3em;
  margin-top: -4em;
  position: relative;
}

.company {
  background-color: rgba($color: #69e, $alpha: 0.2);
  padding: 1em;
  font-size: 2em;
  border-radius: 0.5em;
  transition: 0.3s;
}
a {
  transition: 0.3s;
}

a:hover {
  color: #69e;
}
.company:hover {
  background-color: rgba($color: #69e, $alpha: 0.3);
}

.rep {
  background-color: rgba($color: #69e, $alpha: 0.2);
  padding: 1em;
  // font-size: 2em;
  border-radius: 1em;
  transition: 0.3s;
}

.row.profilestuff {
  margin-top: 2em;
}

.reports {
  background-color: rgba($color: #69e, $alpha: 0.2);
  // font-size: 2em;
  border-radius: 1em;
  padding: 2em;
  transition: 0.3s;
  h6 {
    margin-bottom: 0.4em;
    font-size: 1.1em;
  }
}

.website {
  background-color: rgba($color: #69e, $alpha: 0.2);
  // font-size: 2em;
  border-radius: 1em;
  padding: 2em;
  transition: 0.3s;
  h6 {
    margin-top: 0.5em;
    font-size: 1em;
  }
}

.website:hover {
  background-color: rgba($color: #69e, $alpha: 0.3);
}

.reptitle {
  margin-bottom: 0.5em;
}
</style>
