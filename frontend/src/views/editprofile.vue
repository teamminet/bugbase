<template>
  <div class="vh">
    <div class="container">
      <h2 class="med">Edit Profile</h2>

      <!-- <div class="u-cf"></div>
      <p v-if="respon">{{ respon }}</p> -->

      <form>
        <div class="row">
          <div class="six columns">
            <br/>
            <br/>
             <label for="">Update Profile Pic</label>
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
            <input
              @change="handleImage"
              type="file"
              accept="image/*"
              ref="inputFile"
            />
            <label for="">Name</label>
            <input type="text" v-model="user.name" class="change-input"/>

            <label for="">Website</label>
            <input type="text" v-model="user.website" class="change-input"/>
            <br />
            <br />
            <button @click.prevent="updateFullProfile">Update profile</button>
          </div>
        </div>
       <p v-if="respon">{{ respon }}</p>
        <!-- <h1>
          {{ content.username }}
        </h1>
        <h3>{{ content.email }}</h3>
        <h3>
          <span class="med">Reputation:</span>
          {{ content.reputation }}
        </h3>
        <h2 class="med">Your Organisations</h2>
        <h5 v-if="loaded && content.isInACompany.isIn">
          <router-link to="/company/dashboard">
            {{ content.isInACompany.cname }}
          </router-link>
        </h5> -->
      </form>
      <div class="row">
        <div class="three columns">
          <router-link to="/profile">
            <button>back</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "Dashboard",
  data() {
    return {
      content: {},
      loaded: false,
      changed: false,
      image: "",
      imgRes: {},
      respon: "",
      user: {
        name: "",
        website: "",
      },
    };
  },
  methods: {
    handleImage(e) {
      const selectedImage = e.target.files[0];
      this.changed = false;
      if (selectedImage.size > 1024 * 1024 * 2) {
        alert("File too big (> 2MB)");
        this.$refs.inputFile.value = null;
        this.image = "";
        this.changed = false;
        return;
      }

      this.createBase64Image(selectedImage);
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(fileObject);
    },
    updateProfilePic() {
      UserService.updateProfilePic(this.image).then(
        (response) => {
          this.imgRes = response;
          this.changed = true;
          this.fetchProfile();
        },
        (error) => {
          this.imgRes =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    updateFullProfile() {
      UserService.updateProfile(this.user.name, this.user.website).then(
        () => {
          // (response) => {
          // this.respon = response.data
          this.$router.push("/profile");
        },
        (error) => {
          this.imgRes =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    fetchProfile() {
      UserService.getProfile().then(
        (response) => {
          this.content = response.data;
          // if (!this.content.name == null) {
          this.user.name = this.content.name;
          // }
          // if (!this.content.website == null) {
          this.user.website = this.content.website;
          // }
          this.loaded = true;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
  mounted() {
    this.fetchProfile();
  },
};
</script>

<style lang="scss" scoped>
.profilepic {
  width: 30%;
  border-radius: 100%;
}
form .change-input{
  border: 1px transparent;
  border-radius: 25px;
  background-color: rgba(171, 210, 255, 0.31);
}
</style>
