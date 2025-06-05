<template>
    <div class="g-table-border">
        <table :class="'table caption-top ' + customCssClass">
            <caption class="g-caption-border" v-if="showHeader">
                <div>
                    <span class="float-start g-caption-header">{{ title }}</span>
                    <span class="float-end g-button" v-if="showButtonAllElement">View all</span>
                </div>
            </caption>
            <thead>
                <tr>
                    <th scope="col" v-for="(col) in columns" :key="col.value" :ref="col.value" :style="col.style">
                        {{ col.name }}
                        <span class="g-cell" @click="sortBy(col)" v-if="col.isSortable"><i :class="col.direction === 'up' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'
                            "></i></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in recordsLocal" :key="index">
                    <td v-for="(col) in columns" :key="col.value" :style="col.style">
                        <img :src="record[col.image]" height="50" width="50" v-if="col.isImage" alt=""
                            :class="col.isRounded ? 'rounded-img' : 'normal-im'" />
                        <span v-if="col.isCurrency">{{ getCurrencySymbolDefault() }}</span>
                        <span v-if="col.isText"> {{ record[col.value] }}</span>
                        <span v-if="col.isDate && record[col.value]">
                            {{
                                formatDateLocal(record[col.value])
                            }}</span>
                        <span v-if="col.isSimpleButtonView" :style="col.contentStyle">
                            <span v-if="col.isCondition">
                                {{ record[col.value] ?? col.defaultValue }}
                            </span>
                            <span v-else>
                                {{
                                    record[col.value]
                                }}
                            </span>
                        </span>
                        <a v-if="col.isLink" href="#" @click="emits(col.actionName, record)">{{ record[col.value] }}</a>
                        <span class="g-action" v-if="col.isAction">
                            <span v-for="(bt, id) in col.buttons" :key="id">
                                <span class="me-1 d-inline-block" tabindex="0" data-bs-toggle="tooltip"
                                    :title="bt.tooltip" data-bs-placement="top" v-if="bt.isIcon"
                                    @click="clickOn(bt.actionName, record)"> <i
                                        :class="'bi ms-2 ' + bt.icon"></i></span>
                                <span class="me-1 d-inline-block" tabindex="0" data-bs-toggle="tooltip"
                                    :title="bt.tooltip" data-bs-placement="top" v-if="bt.isButton"
                                    @click="clickOn(bt.actionName, record)"><button>{{
                                        record[bt.fieldName]
                                        }}</button></span>
                            </span>
                        </span>
                        <span v-if="col.isProgression">
                            <span>{{ record[col.value] }}%</span>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25"
                                    aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <template v-if="!recordsLocal || recordsLocal.length <= 0">
            <div class="text-center mt-5 mb-3">No record to display</div>
        </template>
        <!--pagination -->
        <div class="mb-2 p-2" v-if="totalPage && totalPage > 1">
           <!-- <g-pagination :current-page="page" :page-size="pageSize" :total-elements="totalRecord"
                :total-page="totalPage" v-model="currentPage" />-->
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    formatDateT,
    getCurrencySymbolDefault,
    sortByKeyASC,
    sortByKeyDESC
} from "@/utilities/UtilityFunction";
import { ref, watch, computed } from "vue";


// Props
const props = defineProps<{
    records: Record<any, any>[];
    pageSize?: number;
    showButtonAllElement?: boolean;
    title?: string;
    showHeader?: boolean;
    totalPage?: number;
    totalRecord?: number;
    page?: number;
    columns: Record<any, any>[];
    customCssClass?: string;
}>();

const emits = defineEmits<{
    (e: "selectedItem", record: Record<any, any>): void;
    (e: "changePage", page: number): void;
    (e: string, record: Record<any, any>): void; // fallback for dynamic emits like `clickOn`
}>();

// Reactive State
const currentPage = ref(props.page ?? 1);
const rating = 4.2;

const styleConfig = {
    fullStarColor: "#ed8a19",
    emptyStarColor: "#737373",
    starWidth: 10,
    starHeight: 10,
};

const lastFilter = ref<string | null>(null);
const currentFilter = ref("Selling");
const recordsLocal = ref<Record<any, any>[]>([]);
const pageTab = ref<any[]>([]); // Define specific type if available

// Sort records
const sortBy = (col: Record<any, any>) => {
    if (currentFilter.value !== col.value) {
        lastFilter.value = currentFilter.value;
        props.columns.forEach((e) => {
            if (e.value === lastFilter.value) {
                e.direction = "down";
            }
        });
    }

    currentFilter.value = col.value;
    col.direction = col.direction === "up" ? "down" : "up";

    const sorted = col.direction === "up"
        ? sortByKeyASC(recordsLocal.value, currentFilter.value)
        : sortByKeyDESC(recordsLocal.value, currentFilter.value);

    recordsLocal.value = [...sorted];
};

// Format date for display
const formatDateLocal = (dt: string): string => {
    return formatDateT(dt);
};

// Emit event when row is selected
const selectedItem = (record: Record<any, any>) => {
    emits("selectedItem", record);
};

// Emit any named action
const clickOn = (actionName: string, record: Record<any, any>) => {
    emits(actionName, record);
};

// Watchers
watch(
    () => props.records,
    (newValue) => {
        recordsLocal.value = newValue;
    },
    { immediate: true }
);

watch(currentPage, (val) => {
    emits("changePage", val);
});

// Initialization
const init = () => {
    recordsLocal.value = props.records;
};
init();
//@import url(../../assets/css/link.css);

</script>

<style scoped>

.g-caption-header {
    font-weight: bolder;
    font-size: 30px;
}

.g-caption-button {
    color: white;
    background-color: #bed9cb;
    padding: 9px;
    font-size: 15px;
    margin-right: 12px;
    pointer-events: auto;
    cursor: pointer;
}

.g-caption-border {
    border-bottom: 1px solid rgb(128, 128, 128);
    padding: 8px;
    margin-bottom: 3px;
}

.g-caption-button:hover {
    background-color: #00bd7e;
}

.g-action:hover {
    color: darkgreen;
}

.g-table-border {
    border-radius: 2px;
}

.g-cell {
    cursor: pointer;
}

g-table-border th {
    cursor: pointer;
}

.g-table-border th:hover {
    color: var(--g-color-table-header);
}

.rounded-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 0.5em;
}

.normal-im {
    margin-right: 0.5em;
}

th {
    padding: 0.5em;
}

td {
    padding: 0.5em;
}

.bi {
    cursor: pointer;
}
</style>
