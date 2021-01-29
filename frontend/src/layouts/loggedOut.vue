<template>
  <div>
    <!-- <Navbar /> -->
    <main class="App__main">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script>
// import Navbar from '../components/navbar.vue'

export default {
  name: 'loggedOut',
  components: {
    // Navbar,
  },
}
</script>

<style scoped>
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
