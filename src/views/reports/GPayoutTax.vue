<template>
  <admin-layout>
    <div class="container-md">
      <h1 class="g-heading-serif-xxl text-center mb-5" v-t="'payout.header'" />
      <div>
        <h2 class="g-heading-serif-lg" v-t="'payout.methodTitle'" />

        <div class="g-tip">
          <div class="title important">
            <i class="bi bi-patch-exclamation-fill"></i> {{ $t('payout.tipTitle') }}
          </div>
          <div class="list">
            <ul>
              <li v-t="'payout.tipDescription1'" />
              <li><a href="#" v-t="'payout.tipLearnMore'" /></li>
            </ul>
          </div>
        </div>

        <!-- Payoneer -->
        <div class="border-1 rounded-md py-2 mt-2 px-4 d-flex mb-3 justify-content-between flex justify-between ">
          <div><img src="@/assets/images/logo/payoneer_logo.svg" alt="payoneer" /></div>
          <div>
            <Button variant="primary" size="sm" v-t="'payout.connect'" />
          </div>
        </div>

        <!-- Mobile Money -->
        <div class="border-1 flex justify-between rounded-md py-2 mt-2 px-4 d-flex mb-3 justify-content-between">
          <div>
            <img src="https://docs.cinetpay.com/images/latest_inline.webp" alt="Logo CinetPay" />
            <a
              class="g-text-sm form-control-color"
              v-if="mobileMoney && mobileMoney.is_default_payout_method"
              v-t="'payout.active'"
            />
            <a
              class="g-text-sm form-control-color"
              v-if="mobileMoney && !mobileMoney.is_default_payout_method"
              v-t="'payout.setActive'"
            />
          </div>
          <div>
            <span v-if="mobileMoney" class="me-3 g-text-sm">
              {{ mobileMoney.phone }}
            </span>
            <Button size="sm" @click="phoneSet">
              <span v-if="!mobileMoney" v-t="'payout.connect'" />
              <span v-if="mobileMoney" v-t="'payout.change'" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Tax -->
      <div class="mt-5">
        <h2 class="g-heading-serif-lg" v-t="'tax.statusTitle'" />
        <div class="g-tip">
          <div class="title important">
            <i class="bi bi-patch-exclamation-fill"></i> {{ $t('tax.tipTitle') }}
          </div>
          <div class="list">
            <ul>
              <li v-t="'tax.tipDescription1'" />
              <li><a href="#" v-t="'tax.tipLearnMore'" /></li>
            </ul>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <Button size="sm" v-t="'tax.submitNewForm'" />
        </div>
      </div>

      <!-- Tax Documents -->
      <div class="mt-5">
        <h2 class="g-heading-serif-lg mb-4" v-t="'tax.documentsTitle'" />
        <CustomTable :columns="payoutColumns" :rows="payoutRows" :perPage="5" />
      </div>
    </div>

    <!-- Phone Modal -->
    <template v-if="isphoneConfiguration">
      <phone-verification-modal
        ref="phoneConfiguration"
        :payoutMethod="mobileMoney"
        @close="closeModal"
        @verify="savePhone"
      />
    </template>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getUserPayoutMethod } from "@/services/griot_service";
import { useAuthStore } from '@/composables/user'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import Button from "@/components/ui/Button.vue";
import PhoneVerificationModal from "@/views/reports/PhoneVerificationModal.vue";
import CustomTable from "@/components/tables/CustomTable.vue";

const authStore = useAuthStore()

const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})
const isphoneConfiguration = ref(false);
const payoutMethods = ref([]);
const phoneSet = () => {
  isphoneConfiguration.value = true
}
const closeModal = () => {
  isphoneConfiguration.value = false;
}

const uid = computed(() => {
  return user.value.id;
});
const mobileMoney: any = computed(() => {
  if (payoutMethods.value) {
    const filters = payoutMethods.value.filter((e: any) => e.payout_method_type = "MobileMoney");
    return filters && filters.length > 0 && filters[0];
  }
  return null
})
const savePhone = () => {
  closeModal()
}
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

const payoutColumns = [
  { key: 'Document', label: 'document', type: 'text' },
  { key: 'Date', label: 'date', type: 'text' },
];

const payoutRows: any = [];
//init
onMounted(() => {
  getPayoutConfiguration();
})
</script>

<style scoped>
img {
  height: 24px;
}

.pp img {
  height: 40px
}
</style>