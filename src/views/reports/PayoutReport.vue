<template>
    <admin-layout>
        <p class="h3 mt-3 mb-5 g-heading-serif-xxl" v-t="'payout_report.title'" />

        <div class="g-tip mb-10">
            <div class="title important">
                <i class="bi bi-patch-exclamation-fill"></i> {{ $t('payout_report.tip.title') }}
            </div>
            <div class="list">
                <ul>
                    <li>{{ $t('payout_report.tip.learnMore') }}</li>
                    <li>{{ $t('payout_report.tip.notReceived') }}</li>
                </ul>
            </div>
        </div>

        <p class="h3 mt-3 mb-5 g-heading-serif-xxl" v-t="'payout_report.historyTitle'" />
        <CustomTable :columns="payoutColumns" :rows="payoutRows" :perPage="20" />
    </admin-layout>
</template>
<script lang="ts" setup>
import CustomTable from '@/components/tables/CustomTable.vue';
import { FileText } from 'lucide-vue-next';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const payoutColumns = [
    { key: 'date', label: t('payout_report.columns.created'), type: 'text' },
    { key: 'status', label: t('payout_report.columns.status'), type: 'status' },
    { key: 'method', label: t('payout_report.columns.method'), type: 'text' },
    { key: 'preTax', label: t('payout_report.columns.preTax'), type: 'text' },
    { key: 'tax', label: t('payout_report.columns.tax'), type: 'text' },
    { key: 'net', label: t('payout_report.columns.net'), type: 'text' },
    { key: 'payslip', label: t('payout_report.columns.payslip'), type: 'icon', icon: FileText },
];

const payoutRows :any = [
      ];
</script>
