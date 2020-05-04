import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'example0',
      component: resolve => require(['@/example/index'], resolve)
    },
    {
      path: '/group',
      name: 'example1',
      component: resolve => require(['@/example/index-group'], resolve)
    },
    {
      path: '/group2',
      name: 'example2',
      component: resolve => require(['@/example/index-group-area'], resolve)
    },
    {
      path: '/group3',
      name: 'example3',
      component: resolve => require(['@/example/index-group-parent'], resolve)
    },
    {
      path: '/api',
      name: 'api',
      component: resolve => require(['@/example/doc-example/table'], resolve)
    },
    {
      path: '/examples',
      name: 'examples',
      component: resolve => require(['@/example/components-example'], resolve)
    }
  ]
})
