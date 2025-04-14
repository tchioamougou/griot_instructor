<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="flex justify-end pb-5">
    <!-- Bouton qui ouvre/ferme le dropdown -->
    <button
      class="border border-gray-300 bg-purple-400 rounded-lg relative"
      @click="toggleDropdown"
    >
      <svg class="h-8 w-8 text-white"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z"/>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div v-if="isDropdownOpen" class="z-10 mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
        <li>
          <button @click="modalOpen = true" class="block px-4 py-2 hover:text-purple-600 dark:hover:text-white">Add Customer</button>
        </li>
      </ul>
    </div>
  </div>
      <div class="space-y-5 sm:space-y-6 h-screen">
    <ag-grid-vue class="ag-theme-quartz" :rowData="customers" :columnDefs="columnDefs" rowHeight="50"
            :rowSelection="'single'"  :domLayout="'autoHeight'"
            :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady" :autoSizeStrategy="autoSizeStrategy"
            @selectionChanged="getSelectedRows" :defaultColDef="defaultColDef"></ag-grid-vue>
      </div>
    </AdminLayout>

    <Modal v-if="modalOpen" @close="modalOpen = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- close btn -->
          <button
            @click="modalOpen = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700  dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
          >
            <svg
              class="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill=""
              />
            </svg>
          </button>
          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Customers
            </h4>

          </div>
          <form class="flex flex-col">
            <div class="custom-scrollbar h-[450px] overflow-y-auto p-2">
              <div>
                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Input :lb="'First Name'"  :placeholder="'First Name'" :id="'name'" :forLabel="'name'" />
                  </div>

                  <div>
                    <Input :lb="'Last Name'"  :placeholder="'Last Name'" :id="'last'" :forLabel="'last'" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email
                    </label>
                    <div class="relative">
                      <span
                        class="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.04175 7.06206V14.375C3.04175 14.6511 3.26561 14.875 3.54175 14.875H16.4584C16.7346 14.875 16.9584 14.6511 16.9584 14.375V7.06245L11.1443 11.1168C10.457 11.5961 9.54373 11.5961 8.85638 11.1168L3.04175 7.06206ZM16.9584 5.19262C16.9584 5.19341 16.9584 5.1942 16.9584 5.19498V5.20026C16.9572 5.22216 16.946 5.24239 16.9279 5.25501L10.2864 9.88638C10.1145 10.0062 9.8862 10.0062 9.71437 9.88638L3.07255 5.25485C3.05342 5.24151 3.04202 5.21967 3.04202 5.19636C3.042 5.15695 3.07394 5.125 3.11335 5.125H16.8871C16.9253 5.125 16.9564 5.15494 16.9584 5.19262ZM18.4584 5.21428V14.375C18.4584 15.4796 17.563 16.375 16.4584 16.375H3.54175C2.43718 16.375 1.54175 15.4796 1.54175 14.375V5.19498C1.54175 5.1852 1.54194 5.17546 1.54231 5.16577C1.55858 4.31209 2.25571 3.625 3.11335 3.625H16.8871C17.7549 3.625 18.4584 4.32843 18.4585 5.19622C18.4585 5.20225 18.4585 5.20826 18.4584 5.21428Z"
                            fill="#667085"
                          />
                        </svg>
                      </span>
                      <input
                        v-model="email"
                        type="text"
                        placeholder="info@gmail.com"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                  <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Phone
                </label>
                <div class="relative">
                  <div class="absolute">
                    <select
                      v-model="selectedCountry"
                      @change="updatePhoneNumber"
                      class="appearance-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
                    >
                      <option v-for="(code, country) in countryCodes" :key="country" :value="country">
                        {{ country }}
                      </option>
                    </select>
                    <div
                      class="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400"
                    >
                      <svg
                        class="stroke-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                          stroke=""
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
              </div>
              <input
                v-model="phoneNumber"
                placeholder="+237 693774450"
                type="tel"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-[84px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
                  </div>
                  <div>
                    <Select :lb="'Last Package'" :options="Package"/>
                  </div>
                  <div>
                    <Select :lb="'Group'" :options="Group"/>
                  </div>
                  <div>
                    <Input :lb="'Address'"  :placeholder="'Address'" :id="'code'" :forLabel="'code'" />
                  </div>
                </div>
              </div>

            </div>
            <div class="flex items-center gap-3 px-2 mt-2 lg:justify-end">
              <button
                @click="modalOpen = false"
                type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Cancel
              </button>
              <button
                @click="save"
                type="button"
                class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
              >
                Add Customer
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
  </template>

<script setup lang="ts">
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';



const modalOpen = ref(false)
const currentPageTitle = ref("Customer's Lists");
const defaultColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
};
const Package = ref([
  {value: 'Strater', label: "Strater Package"},
  {value: 'Honeymoon', label: "Honeymoon Package"},
  {value: 'Vacation', label: "Vacation Package"},
  {value: 'Spring', label: "Spring Package"},
])
const Group = ref([
  {value: 'Gold', label: "Gold"},
  {value: 'Silver', label: "Silver"},
  {value: 'Bronze', label: "Bronze"},
  {value: 'Platinum', label: "Platinum"},
])

const columnDefs = ref<ColDef[]>([
  { headerName: 'User', field: 'name' ,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    cellRenderer: (params:ICellRendererParams) => {
      const { avatar, name } = params.data;
      return `
        <div class="flex items-center space-x-2">
          <img src="${avatar}" alt="${name}" class="w-8 h-8 rounded-full" /> <!-- Avatar -->
          <span>${name}</span> <!-- Nom de l'utilisateur -->
        </div>
      `;
    }
  },
  { headerName: 'Email', field: 'email' },
  {
    headerName: 'Last Package',
    field: 'package',
  },
  { headerName: 'Phone', field: 'phone' },
  { headerName: 'Verified',
  cellRenderer: () => `
                <div>
                    <span class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-green-500 inline-flex"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                          Email
                    </span>

                </div>
            `,
   },
  { headerName: 'Last Check Out', field: 'check' },
  { headerName: 'Group', field: 'group' },
  {
            headerName: 'Actions',
            cellRenderer: () => `
                <div>
                    <button class="mt-3 px-8" data-action="download">
                        <svg class="h-6 w-6 text-slate-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="2" />  <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />  <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" /></svg>
                    </button>
                    <button>
                      <svg class="h-6 w-6 text-slate-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <rect x="3" y="5" width="18" height="14" rx="2" />  <polyline points="3 7 12 13 21 7" /></svg>
                    </button>
                </div>
            `,
  },

]);



const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};

const onCellClick = (event: CellClickedEvent) => {
  console.log('Cell clicked:', event.data);
};

const getSelectedRows = (event: SelectionChangedEvent) => {
  const selected = event.api.getSelectedRows();
  console.log('Selected row:', selected);
};

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}
const customers = ref([
    {
      id:"AB-355",
      name: 'Lindsey Curtis',
      email: 'lindsey@gmail.com',
      avatar: '/images/user/user-17.jpg',
      package: 'Continental',
      phone: '+237 698745266',
      check: '10 Feb 2020',
      group : "Gold"
    },
    {
        id:"AB-356",
      name: 'Kaiya George',
      email: 'kaiya@gmail.com',
      avatar: '/images/user/user-18.jpg',
      package: 'Strater',
      phone: '+237 698745266',
      check: '25 Feb 2025',
      group : "Gold"
    },
    {
        id:"AB-357",
      name: 'Zain Geidt',
      email: 'zain@gmail.com',
      avatar: '/images/user/user-19.jpg',
      package: 'All Suit',
      phone: '+237 698745266',
      check: '20 Jan 2025',
      group : "Gold"
    },
    {
      id:"AB-358",
      name: 'Abram Schleifer',
      email: 'abram@gmail.com',
      avatar: '/images/user/user-20.jpg',
      package: 'Vacation',
      phone: '+237 698745266',
      check: '20 Apr 2025',
      group : "Gold"
    },
    {
        id:"AB-359",
      name: 'Carla George',
      email: 'carla@gmail.com',
      avatar: '/images/user/user-21.jpg',
      package: 'Honeymoon',
      phone: '+237 698745266',
      check: '02 Feb 2025',
      group : "Silver"
    },
  ])

  const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const countryCodes = {
  CM: '+237',
  US: '+1',
  GB: '+44',
  AU: '+61',
}
const selectedCountry = ref('CM')
const phoneNumber = ref('')
const updatePhoneNumber = () => {
  phoneNumber.value = countryCodes[selectedCountry.value as keyof typeof countryCodes]
}
  </script>

  <style scoped>
  /* Add any additional styles here if needed */
  </style>
