<template>
  <div>
    <div class="sidebar noselect">
      <div class="dbox">
        <Navbar class="nav" />
      </div>
    </div>
    <div class="content">
      <main class="App__main">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue'

export default {
  name: 'general',
  components: {
    Navbar,
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  margin: 0;
  padding: 0;
  width: 200px;
  // background-color: rgb(25, 25, 25);
  position: fixed;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.dbox {
  min-height: 95%;
  // background-color: rgba($color: #0085ff, $alpha: 0.41);
  background-color: rgba($color: #e7e7e7, $alpha: 0.9);
  margin: 1em;
  border-radius: 2em;
  padding: 0 1em;
  display: flex;
  justify-content: center;
  align-items: space;
  flex-direction: column;
  .nav {
    margin: 1em 0;
  }
}

.sidebar a {
  display: block;
  color: black;
  padding: 16px;
  text-decoration: none;
}

div.content {
  margin-left: 100px;
  // padding: 1px 16px;
  padding: 2em 0;
  /* height: 1000px; */
}

@media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sidebar a {
    float: left;
  }
  div.content {
    margin-left: 0;
  }
}

@media screen and (max-width: 750px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
  .dbox {
    width: 90%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
