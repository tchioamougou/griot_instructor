<template>
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-5 py-3 text-left w-3/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Id</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Customer</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Package</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Booking</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Room Type</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Arrive</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Payment</p>
              </th>
              <th class="px-5 py-3 text-left w-2/11 sm:px-6">
                <button class=" text-gray-500 border border-gray-300 dark:text-gray-400 hover:bg-gray-200 rounded-lg px-1 py-1 "><svg class="h-4 w-4 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="12" y1="5" x2="12" y2="19" />  <line x1="5" y1="12" x2="19" y2="12" /></svg></button>
              </th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(user, index) in users"
              :key="index"
              class="border-t border-gray-100 dark:border-gray-800"
            >

             <td class="px-5 py-4 sm:px-6">
                <div class="flex items-center gap-3">
                    <input type="checkbox">
                    <p class="text-purple-600 text-theme-sm dark:text-gray-400">{{ user.id }}</p>
                </div>
              </td>
              <td class="px-5 py-4 sm:px-6">
            
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 overflow-hidden rounded-full">
                    <img :src="user.avatar" :alt="user.name" />
                  </div>
                  <div>
                    <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {{ user.name }}
                    </span>
                    <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ user.email }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.package }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                    {
                      'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                        user.status === 'Active',
                      'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                        user.status === 'Pending',
                      'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                        user.status === 'Cancel',
                    },
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.roomType }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.arrive }}</p>
              </td>
              <td class="px-5 py-4 sm:px-6">
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                    {
                      'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                        user.statusPaid  === 'Paid',
                      'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                        user.statusPaid === 'Due',
                    },
                  ]"
                >
                  {{ user.statusPaid }}
                </span>
              </td>
              <td class="px-5 py-4 sm:px-6">
                    <DropdownMenu :menu-items="menuItems" ></DropdownMenu>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import DropdownMenu from '@/components/common/DropdownMenu.vue'
    const menuItems = [
    { label: 'Send Email', onClick: () => console.log('View More clicked') },
    { label: 'Edit', onClick: () => console.log('Delete clicked') },
    ]
    
  
  const users = ref([
    {
      id:"AB-355",
      name: 'Lindsey Curtis',
      email: 'lindsey@gmail.com',
      avatar: '/images/user/user-17.jpg',
      package: 'Continental',
      status: 'Active',
      roomType: 'Single',
      arrive: '20 Feb 2025',
      statusPaid : "Paid"
    },
    {
        id:"AB-356",
      name: 'Kaiya George',
      email: 'kaiya@gmail.com',
      avatar: '/images/user/user-18.jpg',
      package: 'Strater',
      status: 'Pending',
      roomType: 'Double',
      arrive: '25 Feb 2025',
      statusPaid : "Paid"
    },
    {
        id:"AB-357",
      name: 'Zain Geidt',
      email: 'zain@gmail.com',
      avatar: '/images/user/user-19.jpg',
      package: 'All Suit',
      status: 'Active',
      roomType: 'Super Delux',
      arrive: '20 Jan 2025',
      statusPaid : "Paid"
    },
    {
      id:"AB-358",
      name: 'Abram Schleifer',
      email: 'abram@gmail.com',
      avatar: '/images/user/user-20.jpg',
      package: 'Vacation',
      status: 'Pending',
      roomType: 'Double',
      arrive: '20 Apr 2025',
      statusPaid : "Paid"
    },
    {
        id:"AB-359",
      name: 'Carla George',
      email: 'carla@gmail.com',
      avatar: '/images/user/user-21.jpg',
      package: 'Honeymoon',
      status: 'Active',
      roomType: 'Single',
      arrive: '02 Feb 2025',
      statusPaid : "Due"
    },
  ])
  </script>
  
  <style scoped>
  /* Add any additional styles here if needed */
  </style>