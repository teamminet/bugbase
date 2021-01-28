<template>
  <section class="vh">
    <div class="container">
      <div class="flex-center">
        <div class="four columns">
          <img
            v-if="!changed"
            :src="content.profileImage"
            alt=""
            class="profilepic"
          />
          <img v-if="changed" :src="image" alt="" class="profilepic" />
          <button @click="updateProfilePic" v-if="!image == '' && !changed">
            Update profile pic
          </button>

          <!-- <p>{{ content }}</p> -->

          <input
            @change="handleImage"
            type="file"
            accept="image/*"
            ref="inputFile"
          />

          <!-- <img v-if="image" :src="image" class="image" /> -->

          <!-- <p v-if="image">{{ image }}</p> -->
        </div>
      </div>
      <h1>
        Hi,
        <span class="med">{{ content.username }}</span>
      </h1>
      <h3>{{ content.email }}</h3>
      <!-- <h3>{{ content }}</h3> -->

      <h2 class="med">Your Organisations</h2>
      <h5 v-if="loaded && !content.isInACompany.name == ''">
        <router-link to="/company/dashboard">
          {{ content.isInACompany.name }}
        </router-link>
      </h5>
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
  },
  mounted() {
    this.fetchProfile()
  },
}
</script>

<style lang="scss" scoped>
.profilepic {
  border-radius: 100%;
}
</style>
