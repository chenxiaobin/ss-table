import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Table',
      component: resolve => require(['@/mock/doc-example/table'], resolve)
    },
    {
      path: '/api',
      name: 'api',
      component: resolve => require(['@/mock/api-example/example'], resolve)
    },
    {
      path: '/areagroup',
      name: 'areagroup',
      component: resolve =>
        require(['@/mock/area-group-example/example'], resolve)
    },
    {
      path: '/simple',
      name: 'simple',
      component: resolve =>
        require(['@/mock/simple-example/simple'], resolve)
    },
    {
      path: '/parentgroup',
      name: 'parentgroup',
      component: resolve =>
        require(['@/mock/parent-group-example/example'], resolve)
    }
  ]
})
