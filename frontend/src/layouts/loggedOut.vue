<template>
  <div>
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue';

export default {
  name: 'loggedOut',
  components: {
    Navbar,
  },
};
</script>

<style scoped></style>
