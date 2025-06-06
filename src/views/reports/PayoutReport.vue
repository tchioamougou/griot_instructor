<template>
    <admin-layout>
    <p class="h3 mt-3 mb-5 g-heading-serif-xxl">Payout Report</p>
    <div class="g-tip mb-10">
        <div class="title important">
            <i class="bi bi-patch-exclamation-fill"></i> {{ $t("Stay informed about your payouts.") }}
        </div>
        <div class="list">
            <ul>
                <li>
                    {{ $t("Learn more about") }}
                </li>
                <li>
                    {{ $t("In case you have not received your payout") }}
                </li>
            </ul>
        </div>
    </div>
    <p class="h3 mt-3 mb-5 g-heading-serif-xxl"> Payout History</p>

    <CustomTable :columns="payoutColumns" :rows="payoutRows" :perPage="5" />
    </admin-layout>
</template>
<script lang="ts" setup>
import CustomTable from '@/components/tables/CustomTable.vue';
import { FileText } from 'lucide-vue-next';
import AdminLayout from '@/components/layout/AdminLayout.vue'

const payoutColumns = [
    { key: 'date', label: 'Created', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'method', label: 'Payout method', type: 'text' },
    { key: 'preTax', label: 'Pre-tax amount', type: 'text' },
    { key: 'tax', label: 'Withholding tax', type: 'text' },
    { key: 'net', label: 'Net earning', type: 'text' },
    { key: 'payslip', label: 'Payslip', type: 'icon', icon: FileText },
];

const payoutRows = [
    { date: 'Jun 2025', status: 'Success', method: 'Payoneer', preTax: '$5.37', tax: '$0', net: '$5.37', payslip: true },
    { date: 'May 2025', status: 'Success', method: 'Payoneer', preTax: '$11.88', tax: '$0', net: '$11.88', payslip: true },
    { date: 'Apr 2025', status: 'Success', method: 'Payoneer', preTax: '$15.88', tax: '$0', net: '$15.88', payslip: true },
    // ...add the rest
];
</script>
<style lang="scss" scoped></style>