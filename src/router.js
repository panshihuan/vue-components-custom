import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./examples/index.vue')
    },
    {
      path: '/popup',
      name: 'popup',
      component: () => import('./examples/popup.vue')
    },
    {
      path: '/lazy',
      name: 'lazy',
      component: () => import('./examples/lazy.vue')
    },
    {
      path: '/swipe',
      name: 'swipe',
      component: () => import('./examples/swipe.vue')
    },
    {
      path: '/ripple',
      name: 'ripple',
      component: () => import('./examples/ripple.vue')
    },
    {
      path: '/toast',
      name: 'toast',
      component: () => import('./examples/toast.vue')
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => import('./examples/tree.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('./examples/calendar.vue')
    },
    {
      path: '/tabbar',
      name: 'tabbar',
      component: () => import('./examples/tabbar.vue')
    },
    {
      path: '/pullrefresh',
      name: 'pullrefresh',
      component: () => import('./examples/pullrefresh.vue')
    },
    {
      path: '/select',
      name: 'select',
      component: () => import('./examples/select.vue')
    },
    {
      path: '/inputNumber',
      name: 'inputNumber',
      component: () => import('./examples/stepper.vue')
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('./examples/loading.vue')
    },
    {
      path: '/imgPreview',
      name: 'imgPreview',
      component: () => import('./examples/imgPreview.vue')
    },
    {
      path: '/imagePreview',
      name: 'imagePreview',
      component: () => import('./examples/imagePreview.vue')
    },
    {
      path: '/indexlist',
      name: 'indexlist',
      component: () => import('./examples/indexList')
    },
    {
      path: '/dialog',
      name: 'dialog',
      component: () => import('./examples/dialog')
    },
    {
      path: '/cascade',
      name: 'cascade',
      component: () => import('./examples/cascade')
    },
    {
      path: '/slidenav',
      name: 'slidenav',
      component: () => import('./examples/slideNav')
    },
    {
      path: '/validator',
      name: 'validator',
      component: () => import('./examples/validator')
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('./examples/form')
    },
    {
      path: '/picker',
      name: 'picker',
      component: () => import('./examples/picker')
    },
    {
      path: '/datetimePicker',
      name: 'datetimePicker',
      component: () => import('./examples/datetimePicker')
    },
    {
      path: '/sort',
      name: 'sort',
      component: () => import('./examples/sort')
    },
    {
      path: '/countdown',
      name: 'countdown',
      component: () => import('./examples/countdown')
    }
  ]
})
