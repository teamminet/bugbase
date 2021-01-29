<template>
  <section class="vh">
    <div class="container">
      <div class="top">
        <h2 class="med">Hacktivity</h2>
        <h5>Write some text here arhan</h5>
      </div>
      <br />
      <div class="row">
        <div class="eight columns search">
          <input
            type="text"
            class="search"
            placeholder="Search"
            v-model="search"
          />
        </div>
        <div class="four columns">
          <select name="filter" @change="onChange($event)" v-model="key">
            <option value="a2z">A to Z</option>
            <option value="z2a">Z to A</option>
            <option value="htlb">Highest Bounty</option>
            <option value="lthb">Lowest Bounty</option>
          </select>
        </div>
      </div>

      <!-- {{ companies }} -->

      <div v-if="search === ''">
        <!-- <h3>
            <router-link :to="`/hacktivity/${company.cusername}`">
              {{ company.cname }}: {{ company.cusername }}
            </router-link>
              {{company.description}}
              <br>
              {{company.bountyVals}}
          </h3> -->
        <div class="column table">
          <div class="row headers">
            <div class="three columns center">Icon</div>
            <div class="three columns center">Company Name</div>
            <!-- <div class="three columns">Company Username</div> -->
            <div class="three columns center">Minimum Bounty</div>
            <div class="three columns center">Maximum Bounty</div>
          </div>
          <span></span>
          <div
            class="tab-bottom"
            v-for="company in companies"
            :key="company.cname"
          >
            <div class="row values">
              <div class="three columns">
                <router-link :to="`/hacktivity/${company.cusername}`">
                  <p class="center zero">
                    <img
                      class="propic"
                      v-if="company.companyProfileImage"
                      :src="company.companyProfileImage"
                      alt=""
                    />
                    <img
                      v-else
                      class="propic"
                      src="@/assets/img/user.svg"
                      alt=""
                    />
                  </p>
                </router-link>
              </div>
              <div class="three columns compname">
                <router-link :to="`/hacktivity/${company.cusername}`">
                  {{ company.cname }}
                </router-link>
              </div>
              <div class="three columns center" v-if="company.bountyVals">
                ₹{{ company.bountyVals.low }}
              </div>
              <div class="three columns center" v-if="company.bountyVals">
                ₹{{ company.bountyVals.high }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="column table">
          <div class="row headers">
            <div class="three columns center">Icon</div>
            <div class="three columns center">Company Name</div>
            <div class="three columns center">Minimum Bounty</div>
            <div class="three columns center">Maximum Bounty</div>
          </div>
          <span></span>
          <div v-for="company in companies" :key="company.cname">
            <div
              v-if="
                company.cname.toLowerCase().includes(search.toLowerCase()) ||
                company.cusername.toLowerCase().includes(search.toLowerCase())
              "
            >
              <div class="row values">
                <div class="three columns">
                  <router-link :to="`/hacktivity/${company.cusername}`">
                    <p class="center zero">
                      <img
                        class="propic"
                        v-if="company.companyProfileImage"
                        :src="company.companyProfileImage"
                        alt=""
                      />
                      <img
                        v-else
                        class="propic"
                        src="@/assets/img/user.svg"
                        alt=""
                      />
                    </p>
                  </router-link>
                </div>
                <div class="three columns compname">
                  <router-link :to="`/hacktivity/${company.cusername}`">
                    {{ company.cname }}
                  </router-link>
                </div>
                <div class="three columns center" v-if="company.bountyVals">
                  ₹{{ company.bountyVals.low }}
                </div>
                <div class="three columns center" v-if="company.bountyVals">
                  ₹{{ company.bountyVals.high }}
                </div>
              </div>
            </div>
          </div>
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
      companies: [],
      key: 'a2z',
      search: '',
    }
  },
  mounted() {
    this.getHack('a2z')
  },
  methods: {
    getHack(sort) {
      UserService.getHacktivity(sort).then(
        (response) => {
          this.companies = response.data
        },
        (error) => {
          this.companies =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        },
      )
    },
    onChange(event) {
      // console.log(event.target.value)
      this.getHack(event.target.value)
    },
  },
}
</script>
<style scoped>
.top {
  padding: 20px 10px 20px 0px;
}
input.search,
select {
  background-color: rgba(171, 210, 255, 0.31);
  /* padding: 20px 10px 20px 50px; */
  border: 1px transparent;
  border-radius: 20px;
  color: #222;
}
input.search {
  padding-left: 3em;
}

.table {
  background-color: rgba(171, 210, 255, 0.31);
  border: 1px transparent;
  border-radius: 20px;
}
.headers,
.values {
  padding: 20px 50px 20px 50px;
}
span {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 2px solid black;
}

.propic {
  width: 25%;
  border-radius: 100%;
}
.three.columns.center,
.compname {
  margin-top: 1em;
}
</style>
