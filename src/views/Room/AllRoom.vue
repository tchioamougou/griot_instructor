<template>
  <div>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <!-- <div ref="dropdownRef"> -->
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
              <button @click="modalOpen=true" class="block px-4 py-2  hover:text-purple-600 dark:hover:text-white">Add Room </button>
            </li>
            <li>
              <button class="block px-4 py-2 hover:text-purple-600 dark:hover:text-white">Import Room</button>
            </li>
          </ul>
        </div>
        </div>
      <!-- </div> -->
    <div class="space-y-5 sm:space-y-6 h-screen">
      <ag-grid-vue class="ag-theme-quartz" :rowData="flattenServiceProducts" :columnDefs="columnDefs" rowHeight="50"
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
      Add Room
    </h4>

  </div>
  <form @submit.prevent="saveFormData" class="flex flex-col">
    <div class="custom-scrollbar h-[458px] overflow-y-auto p-2">
      <div class="space-y-8">
        <!-- Section principale -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Room Information</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Input
              :lb="'Name'"
              :placeholder="'Ex: Room A101'"
              :id="'name'"
              :forLabel="'name'"
              v-model="formData.name"
            />
            <Input
              :lb="'Rent'"
              :placeholder="'Ex: 1000 FCFA'"
              :id="'rent'"
              :forLabel="'rent'"
              v-model="formData.rent"
            />
            <Select
              :lb="'Status'"
              :options="status"
              v-model="formData.status"
            />
          </div>
        </div>

        <!-- Options par défaut -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Default Options</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="option in defaultOptions" :key="option.id">
              <Select
                :lb="option.optionName"
                :options="option.values"
                v-model="formData.options[option.id]"
              />
            </div>
          </div>
        </div>

        <!--  Bouton options supplémentaires -->
        <div>
          <button
            @click.prevent="show = !show"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span v-if="!show">➕ Add other options</span>
            <span v-else>➖ Hide options</span>
          </button>
        </div>

  <!--  Options supplémentaires -->
        <div v-if="show">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-4">Additional Options</h2>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div v-for="option in hideOptions" :key="option.id">
              <Select
                :lb="option.optionName"
                :options="option.values"
                v-model="formData.options[option.id]"
              />
            </div>
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
      <span v-if="!isLoading">Add Room</span>
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
import { ref,onMounted,computed, } from 'vue'
import type {Ref} from 'vue'
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import type { ColDef, GridReadyEvent, CellClickedEvent, SelectionChangedEvent,ICellRendererParams} from 'ag-grid-community';
import { getOptions,createRoom,createRoomOptions,getServiceProductWithOptions} from "@/services/api";
import type { OptionType,ServiceProductType,ProductOptionType } from '@/types/option'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'; // adapte le chemin

const isLoading = ref(false);

const toast = useToast()



const modalOpen = ref(false)
const options = ref<OptionType[]>([])

const productOptions = ref<ProductOptionType[]>([])
const show = ref(false)

// interface ServiceProductResponse {
//   data: ServiceProductType[]
// }

// const ServiceProduct: Ref<ServiceProductResponse> = ref({ data: [] })
  const ServiceProduct = ref<ServiceProductType[]>([]);


const fetchOptions = async () => {
  try {
    const response = await getOptions()
    console.log(response.data.data)
    options.value = response.data.data.map((el:any)=>{
      return {
...el,        values: el.values.map((val: any) => ({value: val, label: val}))
      }
    })
    console.log(".....",options.value)
  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error)
  }
}




const defaultOptions = computed(() =>
  options.value.filter((option: OptionType) => option.isDefault === true)
)

const hideOptions = computed(() =>
  options.value.filter((option: OptionType) => option.isDefault === false)
)

const formData = ref({
  name: '',
  status: '',
  description: '',
  rent: '',
  options: {} as Record<number, any>,
})



onMounted(() => {
  fetchOptions()
})

const defaultOptionsMap = computed(() => {
  const map: Record<number, OptionType> = {};
    options.value.forEach((opt: OptionType) => {
    map[opt.id] = opt;
  });
  return map;
});


const saveFormData = async () => {
  isLoading.value = true;
  try {
    const roomPayload = {
      service_id: 4,
      product_name: formData.value.name,
      product_type: formData.value.name,
      description: formData.value.description,
      status: formData.value.status,
      price: formData.value.rent
      // created_by et last_modified
    };

    const roomResponse = await createRoom(roomPayload);
    const roomId = roomResponse.data.id;
    console.log('roomId', roomId);

    const optionsPayload = Object.entries(formData.value.options).map(
      ([id, value]: [string, any]) => {
        const optionMeta = defaultOptionsMap.value[Number(id)];
        return {
          service_product_id: roomId,
          option_id: Number(id),
          option_type: optionMeta?.type || null,
          value: value
        };
      }
    );

    console.log('optionsPayload', optionsPayload);

    const optionsResponse = await createRoomOptions({
      data: optionsPayload
    });
    //renitialisation des champs
    formData.value = {
      name: '',
      status: '',
      description: '',
      rent: '',
      options: {}
    }

    toast.success('Chambre enregistrée avec succès !')
    console.log('roomPayload', roomPayload);
    console.log('optionsResponse', optionsResponse);
    console.log('optionsPayload', optionsPayload);

  } catch (error) {
    console.error('Erreur lors de la sauvegarde', error);
  }finally {
    isLoading.value = false;
  }
};




// const fetchServiceProduct = async () => {
//   try {
//     // Récupération des données des produits et des options
//     const response = await getServiceProduct();
//     const response2 = await getProductOption();

//     const serviceProducts = response.data.data;
//     const productOptions = response2.data.data;

//     console.log("Service Products:", serviceProducts);
//     console.log("Product Options:", productOptions);
//     const serviceProductWithOptions = serviceProducts.map((product:any) => {
//       const associatedOptions = productOptions.filter((option:any) => option.serviceProductId == product.id);
//       console.log("Service Product avec Options1:", associatedOptions)
//       return {
//         ...product,
//         options: associatedOptions
//       };
//     });

//     ServiceProduct.value = serviceProductWithOptions;

//     console.log("Service Product avec Options:", productOptions);

//   } catch (error) {
//     console.error('Erreur lors de la récupération des options:', error);
//   }
// };

const fetchServiceProduct = async () => {
  try {
    const response = await getServiceProductWithOptions();
    const serviceProducts = response.data;

    // ServiceProduct.value = serviceProducts.map((option: any) => ({ ...option }));
    // console.log('ServiceProduct.value',ServiceProduct.value)

    const serviceProductWithOptions = serviceProducts.map((product:any) => {
      const associatedOptions = product.options.filter((option:any) => option.serviceProductId == product.id);
      console.log("Service Product avec Options1:", associatedOptions)
      return {
        ...product,
        options: associatedOptions
      };
    });

    ServiceProduct.value = serviceProductWithOptions;


    console.log("Service Products avec options (depuis backend):", ServiceProduct.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};





onMounted(() => {
  fetchServiceProduct()

})

const flattenServiceProducts = computed(() => {
  return ServiceProduct.value.map((product:any) => {
    const flatProduct:ProductOptionType = {
      ...product,
    }
    console.log("00000",flatProduct)

    product.options?.forEach((option:any) => {
      const key = `option_${option.optionId}`
      flatProduct[key] = option.value;
    });


    return flatProduct;
  });
});




const currentPageTitle = ref("Room List");

const status = ref([
{value: 'Open', label: "Open"},
{value: 'Inactive', label: "Inactive"},
{value: 'Booked', label: "Booked"},
])
const autoSizeStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 140,
}
const columnDefs = ref<ColDef[]>([
{ headerName: 'Room No.', field: 'productName' ,
checkboxSelection: true,
headerCheckboxSelection: true,

},
{ headerName: 'Rent', field: 'price' },
{
  headerName: 'Status',
  field: 'status',

  cellRenderer: (params:ICellRendererParams) => {
    if (params.value === 'Open') {
      return `<span class="bg-success-50 text-success-700 px-2 rounded-full dark:bg-success-500/15 dark:text-success-500">Open</span>`;
    } else if (params.value === 'Booked') {
      return `<span class="bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400 rounded-full px-2">Booked</span>`;
    } else {
      return `<span class="bg-red-50 text-red-700 px-2 rounded-full dark:bg-red-500/15 dark:text-red-500">Inactive</span>`;
    }
  }
},

{
  headerName: 'Accommodation Type',
  field: 'option_1',

},
{ headerName: 'Bed Type', field: 'option_2' },
{ headerName: 'View', field: 'option_3' },
{ headerName: 'Balcony', field: 'option_4' },
{ headerName: 'Terrace', field: 'option_5' },
{ headerName: 'Air Conditioning', field: 'option_6' },
{ headerName: 'Wi-fi', field: 'option_7' },
{ headerName: 'Breakfast Included', field: 'option_8' },
{ headerName: 'Private Bathroom', field: 'option_9'},
{ headerName: 'Kitchen / Kitchenette', field: 'option_10' },
{ headerName: 'Washing Machine', field: 'option_11' },
{ headerName: 'Room Size (sqm)', field: 'option_12' },
{ headerName: 'Number of Rooms', field: 'option_13' },
{ headerName: 'Maximum Occupancy', field: 'option_14' },
{ headerName: 'TV', field: 'option_15' },
{ headerName: 'Mini Bar', field: 'option_16' },
{ headerName: 'Safe Deposit Box', field: 'option_17' },
{ headerName: 'Extra Bed', field: 'option_18' },
{ headerName: 'Wheelchair Accessible', field: 'option_19' },
{ headerName: 'Private Pool', field: 'option_20' },
{ headerName: 'Jacuzzi / Spa', field: 'option_21' },
{ headerName: 'Smoking Allowed', field: 'option_22' },
{ headerName: 'Pets Allowed', field: 'option_23' },
{ headerName: 'Housekeeping', field: 'option_24' },
{ headerName: 'Parking', field: 'option_25' },
{ headerName: 'Room Service', field: 'option_26' },
{ headerName: 'Self Check-in', field: 'option_27' },
{ headerName: 'House Rules', field: 'option_30' },
{ headerName: 'Check-in Time', field: 'option_28' },
{ headerName: 'Check-out Time', field: 'option_29' },

{
  headerName: 'Actions',
  cellRenderer: () => `
                <div>
                    <button class="bg-purple-500 text-white px-2 rounded mt-1 mx-1 action-btn" data-action="download">
                        Edit
                    </button>
                    <button class="bg-orange-500 text-white px-2 rounded mt-1 mx-1 action-btn" data-action="delete">
                        Delete
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
// const roomData = [
// {
//   "room no": "101",
//   "room type": "Single",
//   "ac": "AC",
//   "meal": "Breakfast ",
//   "bed capacity": 1,
//   "rent": "10000 FCFA",
//   "status" : "Booked"
// },
// {
//   "room no": "102",
//   "room type": "Double",
//   "ac": "None",
//   "meal": "Two",
//   "bed capacity": 2,
//   "rent": "15000 FCFA",
//   "status" : "Inactive"
// },
// {
//   "room no": "103",
//   "room type": "Suit",
//   "ac": "AC",
//   "meal": "All",
//   "bed capacity": 3,
//   "rent": "25000 FCFA",
//   "status" : "Open"
// },
// {
//   "room no": "104",
//   "room type": "Single",
//   "ac": "None",
//   "meal": "Breakfast",
//   "bed capacity": 1,
//   "rent": "80000 FCFA",
//   "status" : "Booked"
// },
// {
//   "room no": "105",
//   "room type": "Delux",
//   "ac": "AC",
//   "meal": "Lunch",
//   "bed capacity": 4,
//   "rent": "20000 FCFA",
//   "status" : "Inactive"
// },
// {
//   "room no": "106",
//   "room type": "Double",
//   "ac": "None",
//   "meal": "All",
//   "bed capacity": 2,
//   "rent": "12000 FCFA",
//   "status" : "Open"
// },
// ];

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
</script>

<style scoped>
/* Style amélioré pour le bouton */

</style>
