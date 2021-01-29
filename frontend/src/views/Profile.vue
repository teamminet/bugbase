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

      <br />
      <br />

      <p v-if="content">{{ content }}</p>

      <br />
      <br />

      <div v-if="content.isInACompany.isIn === true" class="company">
        <h4 class="semi">{{ content.isInACompany.cname }}</h4>
      </div>

      {{ content.reputation }}

      <h5>Reports</h5>
      <div v-for="report in reports" :key="report">
        <router-link :to="`/bug/${report._id}`">
          <p>{{ report.chatdata[0] }}</p>
        </router-link>
      </div>
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
	background-color: rgba($color: #69e, $alpha: 0.5);
	padding: 2em;
	font-size: 2em;
}
</style>
