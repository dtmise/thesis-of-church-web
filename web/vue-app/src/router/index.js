import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const user = localStorage.getItem('user')
      if (!user) next({ name: 'Home' })
      else next()
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      if (!user?.isAdmin) next({ name: 'Dashboard' })
      else next()
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
