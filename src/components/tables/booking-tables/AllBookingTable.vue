<template>
  <div>
    <ag-grid-vue class="ag-theme-quartz" :rowData="users" :columnDefs="columnDefs" :rowHeight="50"
    :rowSelection="'single'"  :domLayout="'autoHeight'" :autoSizeStrategy="autoSizeStrategy"
    :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady"
    @selectionChanged="getSelectedRows"></ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';





const columnDefs = ref<ColDef[]>([
{ headerName: 'ID', field: 'id' ,
checkboxSelection: true,
headerCheckboxSelection: true,
width: 120
},
{
  headerName: 'Name',
  field: 'name',
  width: 120,
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
{ headerName: 'Email', field: 'email',width: 150 },
{ headerName: 'Package', field: 'package',width: 120 },
{
  headerName: 'Status',
  field: 'status',
  width: 120,
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'Active') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;
    } else if (params.value === 'Pending') {
      return `<span class="bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400 rounded-full px-2">Pending</span>`;
    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Cancel</span>`;
    }
  }
},
{ headerName: 'Room Type', field: 'roomType',width: 120 },
{ headerName: 'Arrive Date', field: 'arrive',width: 120 },
{
  headerName: 'Payment',
  field: 'statusPaid',
  width: 100,
  cellRenderer: (params:ICellRendererParams) => {
    return params.value === 'Due'
    ? `<span class="bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400 rounded-full px-2">Due</span>`
    : `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Paid</span>`;
  }
},
{
  headerName: 'Actions',
  width: 180,
  cellRenderer: () => `
                <div>
                    <button class="bg-purple-500 text-white px-2 rounded mt-1 mx-1 action-btn" data-action="download">
                        Edit
                    </button>
                    <button class="bg-orange-500 text-white px-2 rounded mt-1 mx-1 action-btn" data-action="delete">
                        Send Email
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
