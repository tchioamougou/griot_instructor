
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useStorage('token', null),
    // user: useStorage('user', null),
    user: useStorage<any | null>('user', null),
  }),
  getters: {
    isLoggedIn: (state) => !!state.user, // Determine if user is logged in
    getUser: (state) => state.user
  },
  actions: {
    login(user: any, token: any) {
      this.user = JSON.stringify(user)
      this.token = token
      console.log('login', this.user)
    },
    logout() {
      this.user = null
      this.token = null
    },
  },
})
