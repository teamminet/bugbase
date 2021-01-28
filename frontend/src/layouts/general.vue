<template>
  <div>
    <Navbar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue';

export default {
  name: 'general',
  components: {
    Navbar,
  },
};
</script>

<style scoped></style>
