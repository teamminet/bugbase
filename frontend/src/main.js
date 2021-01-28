import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import VeeValidate from 'vee-validate';
import Vuex from 'vuex';

import './assets/css/skeleton.css';
import './assets/css/global.css';

Vue.config.productionTip = false;

Vue.use(VeeValidate);

Vue.use(Vuex);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
