import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import General from './layouts/general.vue'
import loggedOut from './layouts/loggedOut.vue'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/home',
      component: Home,
    },

    {
      path: '/loggedOut',
      component: loggedOut,
      children: [
        {
          path: '/login',
          component: Login,
        },
        {
          path: '/register',
          component: Register,
        },
      ],
    },
    {
      path: '/general',
      component: General,
      children: [
        {
          path: '/profile',
          name: 'profile',
          // lazy-loaded
          component: () => import('./views/Profile.vue'),
        },
        {
          path: '/hacktivity',
          name: 'hacktivity',
          // lazy-loaded
          component: () => import('./views/hacktivity.vue'),
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          // lazy-loaded
          component: () => import('./views/dashboard.vue'),
        },
        {
          name: 'company',
          path: '/hacktivity/:company',
          // lazy-loaded
          component: () => import('./views/company.vue'),
        },
        {
          name: 'create-report',
          path: '/hacktivity/:company/report',
          // lazy-loaded
          component: () => import('./views/createReport.vue'),
        },
        {
          name: 'create-company',
          path: '/company/make',
          // lazy-loaded
          component: () => import('./views/makecompany.vue'),
        },
        {
          name: 'company-dashboard',
          path: '/company/dashboard',
          // lazy-loaded
          component: () => import('./views/mycompany.vue'),
				},
        {
          name: 'all-submissions',
          path: '/company/submissions',
          // lazy-loaded
          component: () => import('./views/submissions/allsubmissions.vue'),
        },
				{
          name: 'specific-submission',
          path: '/company/submissions/:id',
          // lazy-loaded
          component: () => import('./views/submissions/onesub.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/home', '/']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')

  const home = '/home'
  const root = '/'

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next('/login')
  }

  if (to.path == root && loggedIn) {
    next('/hacktivity')
  }

  if (to.path == home && !loggedIn) {
    next('/')
  } else {
    next()
  }
})
