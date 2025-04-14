<template>
    <AdminLayout>
      <PageBreadcrumb :pageTitle="currentPageTitle" />
      <div class="space-y-5 sm:space-y-6">
        <ComponentCard title="">
          <form class="space-y-4" @submit.prevent="SaveReservation">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
              <div>
                <Input :inputType="'text'" :lb="'First Name'" :placeholder="'First Name'" :id="'first'" :forLabel="'first'" v-model="form.firstName" />
              </div>
              <div>
                <Input :inputType="'text'" :lb="'Last Name'" :placeholder="'Last Name'" :id="'last'" :forLabel="'last'" v-model="form.lastName" />
              </div>
              <div>
                <Select :lb="'Gender'" :options="Gender" v-model="form.gender"/>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
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
                    type="text"
                    placeholder="info@gmail.com"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pl-[62px] text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div>
                <Input :lb="'Address'"  :placeholder="'Address'" :id="'address'" :forLabel="'address'" v-model="form.address" />
              </div>
              <div>
                <Select :lb="'Customer type'" :options="Gender" v-model="form.customType"/>
              </div>
              <div><FileInput/></div>
              <div>
                <Select :lb="'Select an package'" :options="Package" v-model="form.package"/>
              </div>

              <div>
                <Select :lb="'Select Room Type'" :options="RoomType" v-model="form.roomType"/>
              </div>
              <div>
                <Select :lb="'Room Number'" :options="Package" v-model="form.roomNumber"/>
              </div>
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
                      <button @click="adults > 0 && adults--" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">-</button>
                      <span class="w-6 text-center">{{ adults }}</span>
                      <button @click="adults++" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">+</button>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-gray-700 dark:text-white">Children</span>
                    <div class="flex items-center gap-2">
                      <button @click="children > 0 && children--" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">-</button>
                      <span class="w-6 text-center">{{ children }}</span>
                      <button @click="children++" class="px-2  bg-gray-200 dark:bg-gray-700 rounded-full">+</button>
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


            <ButtonComponent type="submit" :disabled="!!dateError">Add Booking</ButtonComponent>
          </form>
        </ComponentCard>
      </div>
    </AdminLayout>
  </template>

<script setup lang="ts">
import { ref,computed, watch } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ComponentCard from "@/components/common/ComponentCard.vue";
import FileInput from "@/components/forms/FormElements/FileInput.vue";
import Input from "@/components/forms/FormElements/Input.vue";
import Select from "@/components/forms/FormElements/Select.vue";
import flatPickr from 'vue-flatpickr-component'
import ButtonComponent from "@/components/buttons/ButtonComponent.vue";
import 'flatpickr/dist/flatpickr.css'






const showDropdown = ref(false)
const adults = ref(1)
const children = ref(0)

const totalPersons = computed(() => adults.value + children.value)
const currentPageTitle = ref("Add Booking");
const selectedCountry = ref('CM')
const Gender = ref([
  {value: 'male', label: "Male"},
  {value: 'female', label: "Female"},
  {value: 'other', label: "Other"},
])
const Package = ref([
  {value: 'Strater', label: "Strater Package"},
  {value: 'Honeymoon', label: "Honeymoon Package"},
  {value: 'Vacation', label: "Vacation Package"},
  {value: 'Spring', label: "Spring Package"},
])

const RoomType = ref([
  {value: 'Delux', label: "Delux"},
  {value: 'Super Delux', label: "Super Delux"},
  {value: 'Single', label: "Single"},
  {value: 'Double', label: "Double"},
])

const countryCodes = {
  CM: '+237',
  US: '+1',
  GB: '+44',
  AU: '+61',
}



const updatePhoneNumber = () => {
  form.value.phoneNumber = countryCodes[selectedCountry.value as keyof typeof countryCodes]
}


const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y',
  wrap: true,
}

interface ReservationForm {
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  email: string
  address: string
  customType: string
  package:string
  roomType:string
  roomNumber:string
  arrivalDate: string
  departureDate: string
  normalDescription:string
  numberOfNights: number | null
}


const form = ref<ReservationForm>({
  firstName: '',
  lastName: '',
  gender: '',
  phoneNumber: '',
  email: '',
  address: '',
  customType: '',
  package:'',
  roomType:'',
  roomNumber:'',
  arrivalDate: '',
  departureDate: '',
  normalDescription:'',
  numberOfNights: totalPersons.value,
})

const SaveReservation = async () => {
  try {

    console.log('✅ Réservation enregistrée avec succès !', form.value)
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'enregistrement :', error.response?.data || error.message)
  }
}

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
