<template>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="space-y-5 sm:space-y-6">
        <ComponentCard title="">
          <form class="space-y-4" >
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
              <div>
                <Input :inputType="'text'" :lb="'First Name'" :placeholder="'First Name'" :id="'first'" :forLabel="'first'" v-model="form.firstName" />
              </div>
              <div>
                <Input :inputType="'text'" :lb="'Last Name'" :placeholder="'Last Name'" :id="'last'" :forLabel="'last'" v-model="form.lastName" />
              </div>
              <!-- <div>
                <Select :lb="'Gender'" :options="Gender" v-model="form.gender"/>
              </div> -->

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
                    v-model="form.phoneNumber"
                    placeholder="+237 693774450"
                    type="tel"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-3 pl-[84px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
              </div>
              </div>
            </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
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
                    v-model="form.email"
                    type="email"
                    placeholder="info@gmail.com"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <!-- <div>
                <Input :lb="'Address'"  :placeholder="'Address'" :id="'address'" :forLabel="'address'" v-model="form.address" />
              </div> -->
              <!-- <div>
                <Select :lb="'Customer type'" :options="CustomerTypes" v-model="form.customType"/>
              </div> -->
              <div><FileInput/></div>
              <div>
                <Select :lb="'Select reservation Type'" :options="Package" v-model="form.package"/>
              </div>

              <div>
                <Select :lb="'Select Room'" :options="ServiceProduct" v-model="form.roomType"/>
              </div>
              <!-- <div>
                <Select :lb="'Room Number'" :options="Package" v-model="form.roomNumber"/>
              </div> -->
              <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Arrived Date
              </label>
              <div class="relative">
                <flat-pickr
                  v-model="form.arrivalDate"
                  :config="flatpickrConfig"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Select date"
                />
                <span
                  class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
                >
                  <svg
                    class="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                      fill=""
                    />
                  </svg>
                </span>
          </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Depart Date
                </label>
                <div class="relative">
                  <flat-pickr
                    v-model="form.departureDate"
                    :config="flatpickrConfig"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    placeholder="Select date"
                  />
                  <span
                    class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
                  >
                    <svg
                      class="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </div>
                <p v-if="dateError" class="text-sm text-red-600">
                  {{ dateError }}
              </p>
              </div>

              <Input
                  :lb="'Number of nights'"
                  :inputType="'Number'"
                  :placeholder="'Nombre de nuits'"
                  :id="'total1'"
                  :forLabel="'total1'"
                  :modelValue="numberOfNights ?? ''"
                  :disabled="true"

                />
              <!-- Input déclencheur -->
            <div class="relative w-full">
              <label for="total" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Total Person
              </label>
              <input
                id="total"
                type="text"
                readonly
                :value="`${totalPersons} personne${totalPersons > 1 ? 's' : ''}`"
                @click="showDropdown = !showDropdown"
                class="cursor-pointer dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-md text-gray-800 placeholder:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                placeholder="Total Person"
              />

              <!-- Dropdown -->
              <div
                v-if="showDropdown"
                class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4"
              >
                <!-- Compteurs -->
                <div class="mb-5">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-700 dark:text-white">Adult(s)</span>
                    <div class="flex items-center gap-2">
                      <button @click.prevent="adults > 0 && adults--" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">-</button>
                      <span class="w-6 text-center">{{ adults }}</span>
                      <button @click.prevent="adults++" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">+</button>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-700 dark:text-white">Children</span>
                    <div class="flex items-center gap-2">
                      <button @click.prevent="children > 0 && children--" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">-</button>
                      <span class="w-6 text-center">{{ children }}</span>
                      <button @click.prevent="children++" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">+</button>
                    </div>
                  </div>
                </div>

                <button
                  @click.prevent="showDropdown = false"
                  class="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-700 mt-2"
                >
                  Validate
                </button>
              </div>
            </div>
              <div>
                <Input :lb="'Total Price'"   :id="'total'" :forLabel="'total'" v-model="form.totalPrice" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Note
              </label>
              <textarea
                v-model="form.normalDescription"
                placeholder="Large text area content"
                rows="6"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              ></textarea>
            </div>
          </form>

            <ButtonComponent type="button" :disabled="!!dateError || isLoading" @click="Save ">
               Add Booking
             </ButtonComponent>

        </ComponentCard>
      </div>
    </AdminLayout>

    <Modal v-if="isPaymentModalOpen" @close="isPaymentModalOpen = false">
  <template #body>
    <div
      class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
    >
      <!-- Close button -->
      <button
        @click="isPaymentModalOpen = false"
        class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
      >
        <svg
          class="fill-current"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.04 16.54a.9.9 0 0 0 1.41 1.42L12 13.41l4.54 4.55a.9.9 0 1 0 1.41-1.42L13.41 12l4.55-4.54a.9.9 0 0 0-1.42-1.41L12 10.59 7.46 6.05a.9.9 0 0 0-1.41 1.42L10.59 12l-4.55 4.54Z"
            fill=""
          />
        </svg>
      </button>

      <!-- Title -->
      <div class="mb-6 text-center">
        <h4 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Confirm Booking & Payment
        </h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Review the reservation details before confirming.
        </p>
      </div>
      <form  class="flex flex-col">
      <div class="custom-scrollbar h-[300px] overflow-y-auto p-2">
        <div class="space-y-8">

        <div class="border rounded-md p-4 text-sm text-gray-700 dark:text-gray-300">
          <div class="space-y-2">
            <div><strong>Client:</strong> {{ selectedReservation?.userFullName }}</div>
            <div><strong>Room:</strong> {{ selectedReservation?.roomName }}</div>
            <div><strong>Type:</strong> {{ selectedReservation?.reservationType }}</div>
            <div><strong>Total:</strong> {{ selectedReservation?.totalPrice }} FCFA</div>
          </div>
        </div>

        <div class="mt-6 border rounded-md p-4">
          <Select :lb="'Payment Method'" :options="Payements[0].paymentMethods" v-model="selectedPaymentMethod"/>

        </div>
      </div>
      </div>
      </form>

      <!-- Buttons -->
      <div class="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row">
        <!-- Cancel -->
        <button
          type="button"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05] sm:w-auto"
          @click="isPaymentModalOpen = false"
        >
          Cancel
        </button>

        <!-- Confirm -->
        <ButtonComponent
          type="button"
          :disabled="isLoading || !selectedPaymentMethod"
          @click="confirmReservation"
        >
          <span v-if="!isLoading">Confirm & Pay</span>
          <span v-else class="flex items-center gap-2">
            <Spinner class="w-4 h-4" />
            Processing...
          </span>
        </ButtonComponent>
      </div>
    </div>
  </template>
</Modal>

  </template>

<script setup lang="ts">
import { ref,computed, watch,onMounted } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ComponentCard from "@/components/common/ComponentCard.vue";
import FileInput from "@/components/forms/FormElements/FileInput.vue";
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import flatPickr from 'vue-flatpickr-component'
import ButtonComponent from "@/components/buttons/ButtonComponent.vue";
import { getServiceProduct,createReservation,getService} from "@/services/api";
import type { ProductType,serviceType} from '@/types/option'
import 'flatpickr/dist/flatpickr.css'
import { useToast } from 'vue-toastification'
import Spinner from '@/components/spinner/Spinner.vue'; // adapte le chemin
import { useServiceStore } from '@/stores/serviceStore';
const serviceStore = useServiceStore();
import Modal from '@/components/profile/Modal.vue'


const isLoading = ref(false);


const isPaymentModalOpen = ref(false);
const selectedReservation = ref<any>(null);
  const toast = useToast()






const showDropdown = ref(false)
const adults = ref(1)
const children = ref(0)

const totalPersons = computed(() => adults.value + children.value)
const currentPageTitle = ref("Add Booking");
const selectedCountry = ref('GB')
const Gender = ref([
  {value: 'male', label: "Male"},
  {value: 'female', label: "Female"},
  {value: 'other', label: "Other"},
])
const Package = ref([
  {value: 'Individual', label: 'Individual'},
  {value: 'Group', label: "Group"},
  {value: 'Corporate', label: "Corporate"},
  {value: 'Wedding', label: "Wedding"},
  {value: 'Honeymoon', label: "Honeymoon"},
  {value: 'Standard', label: "Standard"},
])


const countryCodes = {
  CM: '+237',
  US: '+1',
  GB: '+44',
  AU: '+61',
}

// const Payements = ref<any[]>([]);

const updatePhoneNumber = () => {
  form.value.phoneNumber = countryCodes[selectedCountry.value as keyof typeof countryCodes]
}



type PaymentMethodOption = {
  label: string;
  value: string;
};

type FormattedServiceType = {
  id: number;
  name: string;
  paymentMethods: PaymentMethodOption[];

};

const Payements = ref<FormattedServiceType[]>([]);

const fetchServiceData = async () => {
  try {
    const serviceId = serviceStore.serviceId;
    const response = await getService(serviceId);

    const service = response.data;

    // Parse du champ JSON
    const parsedMethods: string[] = JSON.parse(service.paymentMethods || '[]');

    const paymentMethods = parsedMethods.map(method => ({
      label: method,
      value: method
    }));

    Payements.value = [{
      ...service,
      paymentMethods,


    }];

    console.log('Service formaté:', Payements.value);
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
  }
};





const ServiceProduct = ref<ProductType[]>([]);

const fetchServiceProduct = async () => {
  try {
    const serviceId = serviceStore.serviceId
    const response = await getServiceProduct(serviceId);
    const serviceProducts = response.data;
    console.log("hhh", response)
    ServiceProduct.value = serviceProducts.filter((product:any)=>product.status == 'Open').map((products: any) => {
      return {
        ...products,
        value: products.productName,
        label: products.productName,
      }
    });

    console.log("Service Products avec options (depuis backend):", ServiceProduct.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
};


fetchServiceProduct()

const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

watch(totalPersons, (newVal:any) => {
  form.value.totalPerson = newVal
})

onMounted(()=>{
  fetchServiceData()
})

interface ReservationForm {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  roomType:string
  package:string
  arrivalDate: string
  departureDate: string
  normalDescription:string
  totalPerson:number | null
  numberOfNights: number | null
  totalPrice : number | null
  payment : string
}

const selectedPaymentMethod = ref('')

const paymentStatus = selectedPaymentMethod.value === 'Carte bancaire' ? 'pending' : 'paid';
const form = ref<ReservationForm>({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  roomType: '',
  package:'',
  arrivalDate: '',
  departureDate: '',
  normalDescription:'',
  totalPerson: totalPersons.value,
  totalPrice:null,
  numberOfNights: totalPersons.value,
  payment: paymentStatus
})

const confirmReservation = async () => {
  isLoading.value = true;
  try {

    const reservationPayload = {

      first_name: form.value.firstName,
      last_name: form.value.lastName,
      email: form.value.email,
      phone_number: form.value.phoneNumber,
      role_id: 1,
      created_by: 2,
      last_modified_by: 2,
      service_id: serviceStore.serviceId,
      reservation_type: form.value.package,
      reservation_product:form.value.roomType,
      status: 'pending',
      total_price: form.value.totalPrice,
      total_person: form.value.totalPerson,
      arrived_date: form.value.arrivalDate,
      depart_date: form.value.departureDate,
      comment: form.value.normalDescription,
      payment : form.value.payment
    }
    console.log('✅ reservationPayload', reservationPayload)

    const response = await createReservation(reservationPayload)

    form.value = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      roomType: '',
      package:'',
      arrivalDate: '',
      departureDate: '',
      normalDescription:'',
      totalPerson: totalPersons.value,
      totalPrice:null,
      numberOfNights: totalPersons.value,
      payment:''
    }
    isPaymentModalOpen.value = false;
    console.log('✅ Réservation créée avec succès !', response.data)
  } catch (error: any) {
    console.error('❌ Error while saving:', error.response?.data || error.message)
  }finally {
    isLoading.value = false;
  }
}

// const selectedPaymentMethod = ref('');

// const confirmReservation = async () => {
//   if (!selectedPaymentMethod.value) {
//     console.log("Veuillez sélectionner un mode de paiement.");
//     return;
//   }

//   const status = selectedPaymentMethod.value === 'cash' ? 'paid' : 'pending';

//   const reservationData = {
//     first_name: form.value.firstName,
//     last_name: form.value.lastName,
//     email: form.value.email,
//     phone_number: form.value.phoneNumber,
//     role_id: 1,
//     created_by: 2,
//     last_modified_by: 2,
//     service_id: serviceStore.serviceId,
//     reservation_type: form.value.package,
//     reservation_product: form.value.roomType,
//     status: status,
//     total_price: form.value.totalPrice,
//     total_person: form.value.totalPerson,
//     arrived_date: form.value.arrivalDate,
//     depart_date: form.value.departureDate,
//     comment: form.value.normalDescription,
//     paymentMethod: status
//   };

//   if (selectedPaymentMethod.value === 'cash') {
//     try {
//       await createReservation(reservationData);
//       toast.success("Réservation enregistrée avec succès !");

//       form.value = {
//         firstName: '',
//         lastName: '',
//         gender: '',
//         phoneNumber: '',
//         email: '',
//         address: '',
//         roomType: '',
//         package: '',
//         arrivalDate: '',
//         departureDate: '',
//         normalDescription: '',
//         totalPerson: totalPersons.value,
//         totalPrice: null,
//         numberOfNights: totalPersons.value,
//       };
//       isPaymentModalOpen.value = false;
//     } catch (err) {
//       console.log("Erreur lors de la réservation.");
//     }
//   } else if (selectedPaymentMethod.value === 'card') {
//     selectedReservation.value = reservationData;
//     isPaymentModalOpen.value = true;
//   }

// };



const Save = () => {
  // // Exemples de vérifications simples
  // if (dateError || !formData.userId || !formData.totalPrice || !formData.reservationType) {
  //   // Tu peux aussi afficher une alerte ici si tu veux
  //   return;
  // }

  // Préparer les données pour affichage dans la modal
  selectedReservation.value = {
    userFullName: form.value.firstName,
    totalPrice: form.value.totalPrice,
    reservationType: form.value.package
  };

  // Ouvre la modal de paiement
  isPaymentModalOpen.value = true;
};

const dateError = ref<string | null>(null)

watch([() => form.value.arrivalDate, () => form.value.departureDate], () => {
  const arrivalDate = form.value.arrivalDate
  const departureDate = form.value.departureDate

  if (!arrivalDate || !departureDate) {
    dateError.value = null
    return
  }

  const arrival = new Date(arrivalDate)
  const departure = new Date(departureDate)

  if (departure <= arrival) {
    dateError.value = 'The departure date must be after the arrival date.'
  } else {
    dateError.value = null
  }
})

const numberOfNights = computed(() => {
  const { arrivalDate, departureDate } = form.value

  if (!arrivalDate || !departureDate) return null

  const arrival = new Date(arrivalDate)
  const departure = new Date(departureDate)

  const diffTime = departure.getTime() - arrival.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays > 0 ? diffDays : null
})




  </script>
