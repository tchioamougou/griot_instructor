<template>
<div>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="bg-white p-6 rounded-lg shadow-md  min-h-screen">
      <SettingTables @tab-selected="changeTab" :tabs="tabs">
        <GeneralSetting v-if="openTab === 1"/>
      </SettingTables>
    </div>
  </AdminLayout>
</div>

</template>

<script setup lang="ts">
import SettingTables from '../Tables/SettingTables.vue';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import {ref,computed} from 'vue'
import { useI18n } from "vue-i18n";
import { UserIcon, MailIcon, ShieldCheck  } from 'lucide-vue-next';
import GeneralSetting from './GeneralSetting.vue';




const { t } = useI18n();
const openTab = ref(1);
const selectedTab = ref('history')
const currentPageTitle = computed(()=>t("Setting"));


// Liste des onglets
const tabs = computed(() => [
  { label: t('General'), name: 'general', icon: UserIcon},
  { label: t('E-mail'), name: 'email',icon: MailIcon },
  { label: t('Security'), name: 'security', icon: ShieldCheck  },
]);

// const changeTab = (tabIndex : any) => {
//   openTab.value = tabIndex;
//   selectedTab.value = tabs[tabIndex - 1].name

// };
const changeTab = (tabIndex: number) => {
  openTab.value = tabIndex;
  selectedTab.value = tabs.value[tabIndex - 1]?.name || 'general';
};




</script>
