<template>
  <div>
    <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6 h-screen">
      <!-- <ComponentCard title="All Booking"> -->
        <div class="flex justify-end ">
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
              <button @click="modalOpen=true" class="block px-4 py-2  hover:text-purple-600 dark:hover:text-white">Add User </button>
            </li>
          </ul>
        </div>
        </div>
    <ag-grid-vue class="ag-theme-quartz" :rowData="users" :columnDefs="columnDefs" :rowHeight="50"
    :rowSelection="'single'"  :domLayout="'autoHeight'" :autoSizeStrategy="autoSizeStrategy"
    :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady"
    @selectionChanged="getSelectedRows"></ag-grid-vue>

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
      class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
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
      New User
    </h4>

  </div>
  <form @submit.prevent="saveUser" class="flex flex-col">
    <div class="custom-scrollbar h-[300px] overflow-y-auto p-2">
      <div class="space-y-8">
        <!-- Section principale -->
        <div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Input
              :lb="'First Name'"
              :id="'name'"
              :forLabel="'name'"
              v-model="form.firstName"
            />

            <Input
              :lb="'Last Name'"
              :id="'last'"
              :forLabel="'last'"
               v-model="form.lastName"
            />
            <Input
              :lb="'Phone'"
              :id="'phone'"
              :forLabel="'phone'"
              :inputType="'phone'"
               v-model="form.phoneNumber"
            />

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
                    type="email"
                    v-model="form.email"
                    placeholder="info@gmail.com"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            <Select
              :lb="'Role'"
              :options="roles"
              v-model="form.role"
            />

          </div>
        </div>
      </div>





    </div>
    <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
    <!-- Bouton Cancel -->
    <button
      @click="modalOpen = false"
      type="button"
      class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
      :disabled="isLoading"
    >
      Cancel
    </button>

    <!-- Bouton Add Room avec Spinner intégré -->
    <button
      type="submit"
      :disabled="isLoading"
      class="relative flex w-full justify-center items-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 transition disabled:opacity-50 sm:w-auto"
    >
      <span v-if="!isLoading">Save</span>
      <span v-else class="flex items-center gap-2">
        <Spinner class="w-4 h-4" />
        Processing...
      </span>
    </button>
    </div>
  </form>
      </div>
    </template>
  </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent} from 'ag-grid-community';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue';
import { createUser,getUser} from "@/services/api";
import type {userDataType} from "@/types/option"

const isLoading = ref(false);

const toast = useToast()



const modalOpen = ref(false)
const currentPageTitle = ref("Users Lists");
const users = ref<userDataType[]>([])

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};


const roles = ref([
  {value: '2', label: "Admin"},
  {value: '3', label: "Reception staff"},
])


interface Form {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  role: number | null
}


const form = ref<Form>({
  firstName: '',
  lastName: '',
  role: null,
  phoneNumber: '',
  email: '',
})


const saveUser = async () => {
  isLoading.value = true;
  try {

    const userPayload = {

      first_name: form.value.firstName,
      last_name: form.value.lastName,
      email: form.value.email,
      phone_number: form.value.phoneNumber,
      role_id: form.value.role,


    }
    console.log('✅ userPayload', userPayload)

    const response = await createUser(userPayload)

    form.value = {
      firstName: '',
      lastName: '',
      role: null,
      phoneNumber: '',
      email: '',
    }
    console.log('✅ Réservation créée avec succès !', response.data)
  } catch (error: any) {
    console.error('❌ Error while saving:', error.response?.data || error.message)
  }finally {
    isLoading.value = false;
  }
}

const fetchUser = async () => {
  try {
    const response = await getUser()
    console.log(response.data.data)
    users.value = response.data.data.filter((user: any) =>
     [2, 3].includes(user.roleId)
    );


    console.log(".....",users.value)
  } catch (error) {
    console.error('fetch failed:', error)
  }
}
fetchUser()



const columnDefs = ref<ColDef[]>([
{ headerName: 'ID', field: 'id' ,
checkboxSelection: true,
headerCheckboxSelection: true,
},
{
  headerName: 'First Name',
  field: 'firstName',
},
{
  headerName: 'Last Name',
  field: 'lastName',
},
{ headerName: 'Email', field: 'email' },
{ headerName: 'Phone', field: 'phoneNumber' },

// {
//   headerName: 'Role',
//   field: 'roleId',
//   valueFormatter: params => {
//     return ['2', '3'].includes(params.value) ? params.value : 'Unknown';
//   }
// },

{
  headerName: 'Role',
  field: 'roleId',
  cellRenderer: (params:any) => {
    const roleLabels: Record<string, string> = {
      '1': 'Super Admin',
      '2': 'Admin',
      '3': 'Reception staff'
    };

    const roleClasses: Record<string, string> = {
      '1': 'bg-green-50 text-green-700 px-2 rounded-full',
      '2': 'bg-red-50 text-red-700 px-2 rounded-full',
      '3': 'bg-blue-50 text-blue-700 px-2 rounded-full'
    };

    const role = params.value;
    const label = roleLabels[role] || 'Unknown';
    const cssClass = roleClasses[role] || 'bg-gray-200 text-gray-800 px-2 rounded-full';

    return `<span class="${cssClass} text-sm font-medium">${label}</span>`;
  }
},


{
  headerName: 'Actions',
  width: 180,
  cellRenderer: () => `
                <div class="mt-2 space-x-4">
                    <button class=" action-btn" data-action="download">
                        <svg class="h-6 w-6 text-gray-500"  viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
                    </button>
                    <button class=" action-btn" data-action="delete">
                        <svg class="h-6 w-6 text-gray-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
</svg>

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


</script>

<style scoped>

</style>
