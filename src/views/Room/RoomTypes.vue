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
            <button @click="modalOpen=true" class="block px-4 py-2  hover:text-purple-600 dark:hover:text-white">Add Room Type </button>
          </li>
          <li>
            <button class="block px-4 py-2 hover:text-purple-600 dark:hover:text-white">Import Room Type</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="space-y-5 sm:space-y-6 h-screen">
      <ag-grid-vue class="ag-theme-quartz" :rowData="roomTypeData" :columnDefs="columnDefs" rowHeight="50"
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
      Add Room Type
    </h4>

  </div>
  <form class="flex flex-col">
    <div class="custom-scrollbar h-[300px] overflow-y-auto p-2">
      <div>
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mb-6">
          <div>
            <Input :lb="'Room Name'"  :placeholder="'Room Name'" :id="'room'" :forLabel="'room'" v-model="form.name" />
          </div>
          <div>
            <Select :lb="'Status'" :options="status" v-model="form.status"/>
          </div>
        </div>
          <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Description
              </label>
              <textarea
              v-model="form.description"
                placeholder="Large text area content"
                rows="6"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              ></textarea>
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
    :disabled="isLoading"
    type="button"
    class="flex w-full justify-center rounded-lg bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600 sm:w-auto"
    >
    <span v-if="!isLoading"> Add Room Type</span>
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
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import Modal from '@/components/profile/Modal.vue'
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import { createRoomType,getTypeProduct} from "@/services/api";

import { ref,onMounted } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'; // adapte le chemin
import type { RoomTypeData } from '@/types/option'





const isLoading = ref(false);

const toast = useToast()



const modalOpen = ref(false)
const currentPageTitle = ref("Booking Lists");

const status = ref([
{value: 'Active', label: "Active"},
{value: 'Inactive', label: "Inactive"},

])
const columnDefs = ref<ColDef[]>([
{ headerName: '#', field: 'id' ,
checkboxSelection: true,
headerCheckboxSelection: true,
width: 120
},
{
  headerName: 'Name',
  field: 'name',
},
{ headerName: 'Description', field: 'description' },
// { headerName: 'Short Code', field: 'code', width: 120 },
// { headerName: 'No Of Room', field: 'No',width: 150 },
// { headerName: 'Type', field: 'type',
// cellRenderer: (params :ICellRendererParams) => {
//   const rating = Number(params.value) || 0;
//   const maxStars = 5;

//   const stars = Array.from({ length: maxStars }, (_, i) => {
//     return i < rating
//     ? '<svg class="h-4 w-4 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.784-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z"/></svg>'
//     : '<svg class="h-4 w-4 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.784-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z"/></svg>';
//   }).join('');
//   return `<div class="flex gap-1 items-center mt-3">${stars}</div>`;
// }
// },
{
  headerName: 'Status',
  field: 'status',
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'Active') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;

    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Inactive</span>`;
    }
  }
},
{
  headerName: 'Actions',
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

const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
}

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
const roomTypeData = ref<RoomTypeData[]>([])


// interface RoomTypeForm {
//   name: string
//   status: string
//   description: string
// }


const form = ref<RoomTypeData >({
  name: '',
  status: '',
  description: '',
})

// const SaveRoomType = async () => {
//   isLoading.value = true;
//   try {
//     const Payload = {
//       name: form.value.name,
//       description: form.value.description,
//       status: form.value.status,
//     };

//     const roomResponse = await createRoomType(Payload);
//     console.log('roomtype', roomResponse);

//     //renitialisation des champs
//     form.value = {
//       name: '',
//       status: '',
//       description: '',

//     }
//     toast.success('Chambre enregistrée avec succès !')
//     console.log('Payload', Payload)

//   } catch (error) {
//     console.error('Erreur lors de la sauvegarde', error);
//   }finally {
//     isLoading.value = false;
//   }
// };

const fetchRoomType = async () => {
  try {
    const response = await getTypeProduct()

    roomTypeData.value = response.data.data

    console.log(";;;;",roomTypeData.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}

fetchRoomType()




const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
