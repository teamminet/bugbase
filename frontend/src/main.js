import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'

import VueSimpleMarkdown from 'vue-simple-markdown'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-simple-markdown/dist/vue-simple-markdown.css'

Vue.use(VueSimpleMarkdown)

import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'

VueMarkdownEditor.use(vuepressTheme)
import enUS from '@kangc/v-md-editor/lib/lang/en-US'

VueMarkdownEditor.lang.use('en-US', enUS)

Vue.use(VueMarkdownEditor)

import './assets/css/skeleton.css'
import './assets/css/global.css'

Vue.config.productionTip = false

Vue.use(VeeValidate)

Vue.use(Vuex)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
