<template>
  <General>
    <div class="container">
      <h3>{{ content }}</h3>
    </div>
  </General>
</template>

<script>
import UserService from '../services/user.service';
import General from '../layouts/general';

export default {
  name: 'User',
  components: { General },
  data() {
    return {
      content: '',
    };
  },
  mounted() {
    UserService.getUserBoard().then(
      (response) => {
        this.content = response.data;
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
};
</script>
