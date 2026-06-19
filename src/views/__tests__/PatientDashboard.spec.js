import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import PatientDashboard from '../PatientDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
})

describe('PatientDashboard', () => {
  beforeEach(() => {
    localStorage.setItem('loggedIn', 'true')
    localStorage.setItem('role', 'patient')
    localStorage.setItem('patientMeds', JSON.stringify([
      { id: 1, name: 'Ramipril', dosage: '5mg', time: '08:00', taken: false, patientId: 1 },
      { id: 2, name: 'Metoprolol', dosage: '25mg', time: '20:00', taken: false, patientId: 1 }
    ]))
  })

  it('zeigt den Fortschrittsring an', () => {
    const wrapper = mount(PatientDashboard, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('%')
  })

  it('zeigt das Termin-Formular an', () => {
    const wrapper = mount(PatientDashboard, {
      global: { plugins: [router] }
    })
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
    expect(wrapper.find('input[type="time"]').exists()).toBe(true)
  })
})
