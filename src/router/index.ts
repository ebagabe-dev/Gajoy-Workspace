import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAdminStore } from 'src/stores/admin'

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const adminStore = useAdminStore()

    // Verificar o localStorage ao inicializar
    if (localStorage.getItem('isAuthenticated') === 'true') {
      adminStore.setAuthenticated(true)
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!adminStore.isAuthenticated) {
        next({ name: 'login' })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return Router
})
