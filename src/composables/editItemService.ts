
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const editMenusStore = defineStore('menu_item', {
  state: () => ({
    menus: useStorage<any>('menus', {}), // Store menus in local storage
    // user: useStorage('user', null),
  }),
  getters: {
    getMenus: (state) => !!state.menus, // Determine if user is logged in
  },
  actions: {
    setMenus(menus: any) {
      this.menus = JSON.stringify(menus)
    },
  },
})
