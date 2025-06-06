<template>
    <admin-layout>
  <div class="container-md">
    <h1 class="g-heading-serif-xxl text-center mb-5">Payout & Tax Settings</h1>
    <div>
      <h2 class="g-heading-serif-lg">Payout Method</h2>
      <!-- Learn about payment method-->
      <div class="g-border-1 py-3 px-4 d-flex mb-5">
        <i class="bi bi-info-circle me-3"></i>
        <div class="d-flex flex-column">
          <h3 class="mb-2 g-heading-serif-lg">Choose your payout method below.</h3>
          <p class="g-text-sm">Connecting to a new payout method may take a few days. You won’t receive payments to the
            new linked account until its status is approved.
            <a href="#">Learn more about payout methods.</a></p>
        </div>
      </div>
      <div class="g-border-1 py-3 px-4 d-flex mb-3 justify-content-between">
        <div><img src="../assets/images/logo/paypal_logo.svg"></div>
        <div class="pp"><img src="https://www.paypalobjects.com/devdoc/log-in-with-paypal-button.png"></div>
      </div>
      <div class="g-border-1 py-3 px-4 d-flex mb-3 justify-content-between">
        <div><img src="../assets/images/logo/payoneer_logo.svg" alt="payoneer"></div>
        <div>
          <button class="bg-transparent py-1 px-5 g-text-bold g-text-sm b">
            Connect
          </button>
        </div>
      </div>
      <div class="g-border-1 py-3 px-4 d-flex mb-3 justify-content-between">
        <div><img src="https://docs.cinetpay.com/images/latest_inline.webp" alt="Logo CinetPay">
          <a class="g-text-sm form-control-color" v-if="mobileMoney &&mobileMoney.is_default_payout_method ">Active</a>
          <a class="g-text-sm form-control-color" v-if="mobileMoney && !mobileMoney.is_default_payout_method ">Set as Active</a>
        </div>
        <div>
          <span v-if="mobileMoney" class="me-3 g-text-sm">
{{ mobileMoney.phone }}
          </span>
          <button class="bg-transparent py-1 px-5 g-text-bold g-text-sm " @click="phoneSet">
            <span v-if="!mobileMoney">Connect</span>
            <span v-if="mobileMoney">Change</span>

          </button>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h2 class="g-heading-serif-lg">Withholding Tax Status</h2>
      <div class="g-border-1 py-3 px-4 d-flex">
        <p class="g-text-sm">Your tax documentation has been approved. Based on your current status, your IRS
          withholding tax rate is 30%. Your tax form will remain valid through 2025-12-31.</p>
        <span class="g-text-sm">Active</span>
      </div>
      <div class="d-flex justify-content-end">
        <button class="bg-transparent py-2 px-3 g-text-bold g-text-sm mt-2">
          Submit a new form
        </button>
      </div>
    </div>
    <div class="mt-5">
      <h2 class="g-heading-serif-lg">Tax Documents</h2>
      <div class="g-text-sm mb-4">No documents available</div>
      <a href="/">Manage Promotional Agreements</a> <a href="/"><i class="bi bi-box-arrow-up-right"></i></a>
    </div>
  </div>
  </admin-layout>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {getUserPayoutMethod} from "@/services/griot_service";
import { useAuthStore } from '@/composables/user'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const authStore = useAuthStore()

const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const phoneConfiguration = ref(null);
const payoutMethods = ref([]);
const phoneSet = () => {
  phoneConfiguration.value.show()
}

const uid = computed(() => {
 return user.value.id;
});
const mobileMoney = computed(() => {
  if (payoutMethods.value) {
    const filters = payoutMethods.value.filter(e => e.payout_method_type = "MobileMoney");
    return filters && filters.length > 0 && filters[0];
  }
  return null
})
const getPayoutConfiguration = () => {
  getUserPayoutMethod(uid.value).then((response) => {
    return response.json();
  }).then((result) => {
    console.log('result', result)
    payoutMethods.value = result;
  }).catch((error) => {
    console.log("error", error);
  })
}
//init
onMounted(() => {
  getPayoutConfiguration();
})
</script>

<style scoped>
button {
  border: 0.01em solid black;
}
button:hover{
  background-color: rgb(0, 128, 0,0.1)!important;
}

img {
  height: 24px;
}

.pp img {
  height: 40px
}
</style>