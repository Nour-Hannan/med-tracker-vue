import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ArztDashboard from '../ArztDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
})

describe('ArztDashboard', () => {
  beforeEach(() => {
    localStorage.setItem('loggedIn', 'true')
    localStorage.setItem('role', 'doctor')
  })

  it('zeigt die Patientenliste an', () => {
    const wrapper = mount(ArztDashboard, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('Meine Patienten')
  })

  it('zeigt den Fortschrittsbalken für Patienten an', () => {
    const wrapper = mount(ArztDashboard, {
      global: { plugins: [router] }
    })
    expect(wrapper.find('.progress-bar').exists()).toBe(true)
  })

  it('hat einen Diagnose-Button', () => {
    const wrapper = mount(ArztDashboard, {
      global: { plugins: [router] }
    })
    expect(wrapper.text()).toContain('Diagnose')
  })
})
