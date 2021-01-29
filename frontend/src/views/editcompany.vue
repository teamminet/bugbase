<template>
  <div class="container">
    <p v-if="afterUpdate">{{ afterUpdate }}</p>

    <div v-if="step == 0">
      <div class="vh-company">
        <div class="row">
          <div class="flex-center">
            <div class="six columns">
              <br />
              <div class="row">
                <div class="flex-center">
                  <div class="six columns">
                    <div v-if="!changed">
                      <img
                        v-if="content.companyProfileImage"
                        :src="content.companyProfileImage"
                        alt=""
                        class="profilepic"
                      />
                      <img
                        v-else
                        src="@/assets/img/user.svg"
                        alt=""
                        class="profilepic"
                      />
                    </div>
                    <img
                      v-if="changed"
                      :src="image"
                      alt=""
                      class="profilepic"
                    />
                  </div>
                </div>
              </div>
              <br />
              <button
                @click="updateCompanyProfilePic"
                v-if="!image == '' && !changed"
              >
                Update Picture
              </button>
              <h5 style="font-size: 1.2em; margin-bottom: 0.5em;">
                Update Company Logo
              </h5>
              <input
                @change="handleImage"
                class="inputfile"
                type="file"
                accept="image/*"
                ref="inputFile"
              />
              <br />
              <div class="row">
                <div class="flex-center">
                  <div class="six columns">
                    <button @click.prevent="changeStep('front')">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="step == 1">
      <div class="vh-company">
        <div class="row">
          <div class="flex-center">
            <div class="nine columns">
              <h6 style="font-size: 1.2em;">Company Name</h6>
              <input
                :autofocus="step === 1"
                class="big"
                type="text"
                v-model="company.name"
                name=""
                id=""
              />
              <div class="flex">
                <button class="u-pull-left" @click.prevent="changeStep('back')">
                  Back
                </button>
                <button
                  class="u-pull-right"
                  @click.prevent="changeStep('front')"
                >
                  Next
                </button>
              </div>
              <div class="u-cf"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="step == 2">
      <div class="vh-company">
        <v-md-editor v-model="company.description" height="500px"></v-md-editor>
        <div class="flex" style="margin-top: 1.5em;">
          <button class="u-pull-left" @click.prevent="changeStep('back')">
            Back
          </button>
          <button class="u-pull-right" @click.prevent="changeStep('front')">
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-if="step == 3">
      <div class="vh-company">
        <h5 class="semi" style="margin-bottom: 0.5em;">In Scope Websites</h5>
        <div class="row">
          <div class="six columns">
            <input
              type="text"
              v-on:keyup.enter="addInScope"
              v-model="company.inScope.val"
              name=""
              id=""
              placeholder="Domain name"
            />
            <button @click.prevent="addInScope">add</button>
            <div class="flex">
              <button class="u-pull-left" @click.prevent="changeStep('back')">
                Back
              </button>
              <button class="u-pull-right" @click.prevent="changeStep('front')">
                Next
              </button>
            </div>
            <div class="u-cf"></div>
          </div>
          <div class="six columns">
            <div>
              <ul v-if="company.inScope.array != []">
                <li
                  class="website"
                  v-for="website in company.inScope.array"
                  :key="website"
                >
                  {{ website }}
                  <a
                    href
                    @click.prevent="removeInScopeWeb(website)"
                    class="remove"
                  >
                    - remove
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="step == 4">
      <div class="vh-company">
        <h5 class="semi" style="margin-bottom: 0.5em;">
          Out of Scope Websites
        </h5>
        <div class="row">
          <div class="six columns">
            <input
              type="text"
              v-on:keyup.enter="addOutOfScope"
              v-model="company.outOfScope.val"
              name=""
              id=""
              placeholder="Domain name"
            />
            <button @click.prevent="addOutOfScope">add</button>

            <div class="flex">
              <button class="u-pull-left" @click.prevent="changeStep('back')">
                Back
              </button>
              <button class="u-pull-right" @click.prevent="changeStep('front')">
                Next
              </button>
            </div>
            <div class="u-cf"></div>
          </div>
          <div class="six columns">
            <div>
              <ul v-if="company.outOfScope.array != []">
                <li
                  class="website"
                  v-for="website in company.outOfScope.array"
                  :key="website"
                >
                  {{ website }}
                  <a
                    href
                    @click.prevent="removeOutOfScopeWeb(website)"
                    class="remove"
                  >
                    - remove
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="step == 5">
      <div class="vh-company">
        <h5>Bounty Values</h5>
        <label for="">Low</label>
        <input
          type="text"
          v-model="company.bountyVals.low"
          placeholder="low"
          name=""
          class="big"
          id=""
        />

        <label for="">Medium</label>
        <input
          type="text"
          v-model="company.bountyVals.medium"
          placeholder="medium"
          name=""
          class="big"
          id=""
        />

        <label for="">High</label>
        <input
          type="text"
          v-model="company.bountyVals.high"
          placeholder="high"
          class="big"
          name=""
          id=""
        />

        <label for="">Critical</label>
        <input
          type="text"
          class="big"
          v-model="company.bountyVals.critical"
          placeholder="critical"
          name=""
          id=""
        />

        <div class="flex">
          <button class="u-pull-left" @click.prevent="changeStep('back')">
            Back
          </button>
          <button
            class="submit u-pull-right"
            @click.prevent="updateCompanyProfile"
          >
            Save
          </button>
        </div>
        <div class="u-cf"></div>
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
      content: '',
      step: 0,
      preview: false,
      afterUpdate: '',
      changed: false,
      image: '',
      imgRes: {},
      company: {
        name: '',
        description: '',
        inScope: {
          array: [],
          val: '',
        },
        outOfScope: {
          array: [],
          val: '',
        },
        bountyVals: {
          low: '',
          medium: '',
          high: '',
          critical: '',
        },
      },
    }
  },
  methods: {
    addOutOfScope() {
      this.company.outOfScope.array.push(this.company.outOfScope.val)
      this.company.outOfScope.val = ''
    },
    addInScope() {
      this.company.inScope.array.push(this.company.inScope.val)
      this.company.inScope.val = ''
    },
    updateCompanyProfile() {
      UserService.updateCompanyProfile(
        this.company.name,
        this.company.description,
        this.company.inScope.array,
        this.company.outOfScope.array,
        [
          this.company.bountyVals.low,
          this.company.bountyVals.medium,
          this.company.bountyVals.high,
          this.company.bountyVals.critical,
        ],
      ).then(
        (response) => {
          this.afterUpdate = response.data
          this.$router.push('/company/dashboard')
        },
        (error) => {
          this.afterUpdate =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
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
    updateCompanyProfilePic() {
      UserService.updateCompanyProfilePic(this.image).then(
        (response) => {
          this.imgRes = response
          this.changed = true
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
    removeInScopeWeb(item) {
      var array = this.company.inScope.array
      const index = array.indexOf(item)
      if (index > -1) {
        array.splice(index, 1)
        this.company.inScope.array = array
      }
    },
    removeOutOfScopeWeb(item) {
      var array = this.company.outOfScope.array
      const index = array.indexOf(item)
      if (index > -1) {
        array.splice(index, 1)
        this.company.outOfScope.array = array
      }
    },
    changeStep(dir) {
      if (dir == 'front') {
        this.step = this.step + 1
      } else if (dir == 'back') {
        this.step = this.step - 1
      }
    },
    togglePreview() {
      this.preview = !this.preview
    },
  },
  mounted() {
    UserService.getCompanyDashboard().then(
      (response) => {
        this.content = response.data
        if (this.content.cname) {
          this.company.name = this.content.cname
        }
        if (this.content.description) {
          this.company.description = this.content.description
        }
        if (this.content.inScopeWebsites) {
          this.company.inScope.array = this.content.inScopeWebsites
        }
        if (this.content.outOfScopeWebsites) {
          this.company.outOfScope.array = this.content.outOfScopeWebsites
        }
        if (this.content.bountyVals) {
          this.company.bountyVals.low = this.content.bountyVals.low
          this.company.bountyVals.medium = this.content.bountyVals.medium
          this.company.bountyVals.high = this.content.bountyVals.high
          this.company.bountyVals.critical = this.content.bountyVals.critical
        }
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
}
</script>

<style lang="scss" scoped>
.wesbite {
  .remove {
    display: none;
  }
}

.vh-company {
  min-height: 90vh;
  display: flex;
  justify-content: center;
  // align-items: center;
  flex-direction: column;
}

.inputfile {
  padding: 1em;
  background-color: #007fef;
  border: none;
  color: #fff;
  border-radius: 0.5em;
}

.inputfile:hover {
  background-color: #41a0f3;
  color: #fff;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  button:first-child {
    margin-right: 1em;
  }
  button:not(:first-child) {
    margin-left: 1em;
  }
}

@media (max-width: 750px) {
  .flex {
		flex-direction: column;
		button {
			margin-left: 0;
			margin-right: 0;
		}
  }
}

input.big {
  border: none;
  font-size: 3em;
  font-weight: 300;
  padding: 1em 0;
}
</style>
