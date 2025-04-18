<template>
  <div>
    <ag-grid-vue class="ag-theme-quartz" :rowData="reservations" :columnDefs="columnDefs" :rowHeight="50"
    :rowSelection="'single'"  :domLayout="'autoHeight'" :autoSizeStrategy="autoSizeStrategy"
    :pagination="true" @cellClicked="onCellClick" @gridReady="onGridReady"
    @selectionChanged="getSelectedRows"></ag-grid-vue>

  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';
import { getReservation,getUser,getServiceProduct} from "@/services/api";
import { useServiceStore } from '@/stores/serviceStore';
import type {ReservationType,userDataType,ServiceProductType} from '@/types/option'

const serviceStore = useServiceStore();


const users = ref<userDataType[]>([])


const fetchUsers = async () => {
  const response = await getUser();
  users.value = response.data.data;
  console.log('userrr',users.value)
}


const serviceProducts = ref<ServiceProductType[]>([])
const fetchServiceProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getServiceProduct(serviceId);
   serviceProducts.value = response.data;
     console.log("hhh", serviceProducts.value)

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};


const reservations = ref<ReservationType[]>([])

const fetchReservation = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getReservation(serviceId);
    console.log(response.data);

    reservations.value = response.data.map((res: any) => {
      const user = users.value.find((u: any) => u.id === res.userId);
      // const product = serviceProducts.value.find((p: any) => p.id === res.reservationProduct);


      return {
        ...res,
        ...user,
        userFullName: user ? `${user.firstName} ${user.lastName}` : 'Inconnu',
        // productName: product ? product.productName : 'Inconnu'
      };
    });

    console.log(".....", reservations.value);
  } catch (error) {
    console.error('fetch failed:', error);
  }
};





onMounted(async () => {
  await fetchUsers();
  await fetchReservation();
  await fetchServiceProduct()
});


const columnDefs = ref<ColDef[]>([
{ headerName: 'ID', field: 'id' ,
checkboxSelection: true,
headerCheckboxSelection: true,
},
{
  headerName: 'Name',
  field: 'userFullName',
},
 { headerName: 'Email', field: 'email' },
{ headerName: 'Check In', field: 'arrivedDate' },
{ headerName: 'Check Out', field: 'departDate' },
{
  headerName: 'Status',
  field: 'status',
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'Active') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Active</span>`;
    } else if (params.value === 'pending') {
      return `<span class="bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400 rounded-full px-2">Pending</span>`;
    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Cancel</span>`;
    }
  }
},
{ headerName: 'Reservation Type', field: 'reservationType',

},
{ headerName: 'Room', field: 'reservationProduct'},
{
  headerName: 'Payment', field: 'payment',
  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'paid') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Paid</span>`;
    }
    else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">pending</span>`;
    }
  }
  // cellRenderer: (params: ICellRendererParams) => {
  // return `
  //   <div class="mt-1">
  //     <button class="rounded-xl px-2 bg-emerald-400 action-btn" data-action="open-payment" data-id="${params.data.id}">
  //       Paid
  //     </button>
  //   </div>
  // `;
//}

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



const onGridReady = (event: GridReadyEvent) => {
  console.log('Grid ready:', event);
};

// const onCellClick = (event: CellClickedEvent) => {
//   console.log('Cell clicked:', event.data);
// };

const isPaymentModalOpen = ref(false);
const selectedReservation = ref<any>(null);


const onCellClick = (event: any) => {
  const action = event.event?.target?.dataset?.action;
  const reservationId = event.event?.target?.dataset?.id;

  if (action === 'open-payment') {
    const reservation = reservations.value.find(r => r.id === Number(reservationId));
    selectedReservation.value = reservation;
    isPaymentModalOpen.value = true;
  }
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
