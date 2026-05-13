import { createRouter, createWebHistory } from 'vue-router'
import Startseite from '../views/Startseite.vue'
import ArztDashboard from '../views/ArztDashboard.vue'
import PatientDashboard from '../views/PatientDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Start', component: Startseite },
    { path: '/arzt', name: 'Arzt', component: ArztDashboard },
    { path: '/patient', name: 'Patient', component: PatientDashboard }
  ]
})

export default router
