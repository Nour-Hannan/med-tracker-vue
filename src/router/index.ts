import { createRouter, createWebHistory } from 'vue-router'
import Startseite from '../views/Startseite.vue'
import ArztDashboard from '../views/ArztDashboard.vue'
import PatientLogin from '../views/PatientLogin.vue'
import PatientDashboard from '../views/PatientDashboard.vue'

const routes = [
  { path: '/', component: Startseite },
  { path: '/arzt', component: ArztDashboard },
  { path: '/patient/login', component: PatientLogin },
  { path: '/patient/dashboard', component: PatientDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
