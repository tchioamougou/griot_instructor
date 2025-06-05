<template>
  <ItemLayout :title="$t('promotions')">
    <template #main>
      <div class="g-container">
        <div class="g-tip">
          <div class="title">
            <i class="bi bi-patch-exclamation-fill"></i>{{ $t('refer_to_student') }}
          </div>
          <div class="list">
            <ul>
              <li>
                {{ $t('refer_to_student_msg') }}
                <a href="#">{{ $t('Learn more') }}</a>
              </li>
            </ul>
          </div>
          <BaseInput type="text" :disabled="true" show-right-message :model-value="referralLink" button="Copy"
            :is-copy="true" />
        </div>
        <div class="block">
          <div class="title">{{ $t('coupons') }}</div>
          <div class="content">
            <div class="coupon_bloc" v-if="!creatingCoupon">
              <template v-if="isLoadingActive">
                <div class="control_spinner">
                  <spinner-cmp color="text-black" />
                </div>
              </template>
              <template v-else>
                <span class="title">{{ getCurrentMonthLabel }} {{ $t('coupons') }}</span>
                <div class="description">
                  <span class="message">
                    {{ $t('coupons_per_month', { restOfCoupon: restOfCoupon }) }}
                  </span><button @click="initCreateCoupon" class="g-add-more-button" :disabled="!canCreateCoupon">
                    +
                  </button>
                </div>
              </template>
            </div>
            <div class="g-create_coupon" v-if="creatingCoupon">
              <div class="title_bloc">
                <span class="title">{{ $t('create_new_coupon') }}</span><span class="icon" @click="cancel"><i
                    class="bi bi-x-lg"></i></span>
              </div>
              <div class="description">
                {{ $t('create_new_coupon_msg', { restOfCoupon: restOfCoupon, currentMonth: 'June' }) }}
              </div>
              <div class="type">
                <div class="title">{{ $t('pick_coupon_type_msg') }}</div>
                <div class="row">
                  <div class="col-md-4 col-sm-12" v-for="(cp, i) in couponCategories" :key="i">
                    <div class="coupon_card">
                      <div class="input">
                        <input type="radio" :id="cp.type" name="couponType" v-model="couponType" :value="cp.type" />
                      </div>
                      <label class="coupon_card_description" :for="cp.type">
                        <span class="coupon_card_title">{{ $t(cp.title) }}</span>
                        <span>{{ $t(cp.message) }}</span>
                        <span>{{ $t(cp.rdt) }}</span>
                        <span>{{ $t(cp.days) }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="value">
                <BaseInput :label="$t('set_price')" type="number" :description="$t('set_price_description')"
                  show-description v-if="couponType == 'CustomPrice'" v-model="customPrice" />
                <CustomInput :label="$t('percentage')" type="number" :description="$t('percentage_description')"
                  show-description v-if="couponType == 'CustomRate'" v-model:number="customRate" />
              </div>
              <div class="StartDate">
                <BaseInput :label="$t('start_date')" type="datetime-local" v-model="startDate" />
              </div>
              <div class="endDate">
                <span class="label">{{ $t('end_date') }}</span>
                <span class="value">{{ endDate }}</span>
              </div>
              <div class="editCoupon">
                <BaseInput v-model="couponCode" :label="$t('edit_coupon_code')" type="text"
                  :description="$t('edit_coupon_code_description')" show-description />
              </div>
              <div class="actions">
                <button class="cancel" @click="cancel">{{ $t('cancel_btn') }}</button>
                <button class="save" @click="createCouponStripe" :disabled="isSaving">
                  <spinner-cmp v-if="isSaving" />{{ $t('save') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="title">{{ $t('active_coupon') }}</div>
          <div class="content">
            <template v-if="isLoadingActive">
              <div class="control_spinner">
                <spinner-cmp color="text-black" />
              </div>
            </template>
            <template v-else>
              <!-- @un-activate="cancelPromotionsConfirmation"-->
              <course-data-table :columns="columnsActive" :records="activeCoupons"
                v-if="activeCoupons && activeCoupons.length > 0" />
              <div class="align-content-center" v-if="!activeCoupons || activeCoupons.length < 1">
                {{ $t('no_coupon_found') }}
              </div>
            </template>
          </div>
        </div>
        <div class="block">
          <div class="title">{{ $t('expired_coupon') }}</div>
          <div class="content">
            <template v-if="isLoadingExpired">
              <div class="control_spinner">
                <spinner-cmp color="text-black" />
              </div>
            </template>
            <template v-else>
              <!-- @delete="deleteConfirmation"-->
              <course-data-table v-if="recordsExpired && recordsExpired.length > 0" :columns="columnsExpired"
                :records="recordsExpired" />
              <div class="align-content-center" v-if="!recordsExpired || recordsExpired.length < 1">
                {{ $t('no_coupon_found') }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </ItemLayout>
  <GConfirmation id="promotions" ref="confirmation" :message="$t(message)" :title="$t(title)" @accepted="onAccepted"
    @cancel="onCancel" />
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import {
  convertTimestampToDate,
  convertToTimestamp,
  currentTime,
  generateCoupon,
  generateReferralCode,
  getCurrentMonth,
} from "@/utilities/UtilityFunction";
import CourseDataTable from "@/components/tables/GTable.vue";
import SpinnerCmp from "@/components/spinner/Spinner.vue";
import {
  createCoupon,
  createNewPromotions,
  updatePromotions,
} from "@/stripe/Products";
import { createPromotions, deletePromotion, UpdatePromotion } from "@/services/griot_service";
import BaseInput from "@/components/forms/FormElements/BaseInput.vue";
import CustomInput from "@/components/forms/FormElements/CustomInput.vue";
import GConfirmation from "@/components/ui/GConfirmation.vue";
import ItemLayout from "./items/ItemLayout.vue";


const emits = defineEmits<{
  (e: 'refresh'): void;
}>();

const props = defineProps<{
  course: Record<string, any>; // Assuming course is an object with properties like id, stripeProductId, etc.
}>();

const recordsExpired = ref<object[]>([]);
const activeCoupons = ref<object[]>([]);
const creatingCoupon = ref(false);
const couponType = ref<string>("");
const isSaving = ref(false);
const startDate = ref<string>(currentTime());
const customPrice = ref<number>(2000);
const customRate = ref<number>(10);
const couponCode = ref<string>('');
const duration = ref<number>(5);
const isLoadingActive = ref(false);
const isLoadingExpired = ref(false);
const maximunCoupons = ref<number>(3);

const couponCategories = ref<Record<any,any>[]>([
  {
    type: "Free",
    title: "Free",
    message: "Completely free course",
    rdt: "Unlimited Redemptions",
    days: "5 Days",
  },
  {
    type: "CustomRate",
    title: "Custom Rate",
    message: "Between 10% and 80%",
    rdt: "Unlimited Redemptions",
    days: "5 Days",
  },
]);

const columnsActive = ref<Record<string, any>[]>([
  { name: "Code", value: "code", isSortable: true, isText: true },
  { name: "Discount", value: "discount", isSortable: true, isText: true },
  { name: "Start date", value: "createdAt", isSortable: true, isDate: true },
  { name: "End date", value: "expiresAt", isSortable: true, isDate: true },
  { name: "Redemptions", value: "coupon_max_redemptions", isSortable: true, isText: true },
  {
    name: " ", value: "", isAction: true, actionName: "view-course", buttons: [
      {
        fieldName: "Redemptions",
        icon: "bi-share",
        isIcon: true,
        actionName: "share",
        tooltip: "Share promotions",
      },
      {
        fieldName: "Redemptions",
        icon: "bi-x-circle",
        isIcon: true,
        actionName: "unActivate",
        tooltip: "Cancel promotions",
      }
    ]
  }
]);

const columnsExpired = ref<Record<string, any>[]>([...columnsActive.value]);

const confirmation = ref<InstanceType<typeof GConfirmation> | null>(null);
const currentPr = ref<Record<string, any> | null>(null);
const message = ref<string>("");
const title = ref<string>("");
let action: "edit" | "delete" | null = null;

const getCurrentMonthLabel = computed(() => getCurrentMonth());

const endDate = computed(() => {
  const myDate = new Date(convertToTimestamp(startDate.value));
  myDate.setDate(myDate.getDate() + duration.value);
  return myDate;
});

const restOfCoupon = computed(() => maximunCoupons.value - activeCoupons.value.length);

const canCreateCoupon = computed(() => restOfCoupon.value > 0);

const referralLink = computed(() => {
  return `${import.meta.env.VITE_APP_HOST}course/${props.course.id}?referralCode=${props.course.referralCode ?? generateReferralCode()}`;
});

const createCouponStripe = () => {
  const params: any = {
    applies_to: { products: [props.course.stripeProductId] },
    max_redemptions: 100,
    metadata: {
      applies_to_product: props.course.stripeProductId,
      startDate: startDate.value,
      endDate: endDate.value,
      couponCode: couponCode.value,
    },
  };

  isSaving.value = true;

  if (couponType.value === "CustomRate") {
    params.percent_off = customRate.value;
    params.name = `${customRate.value}% off ${props.course.title}`;
  } else if (couponType.value === "CustomPrice") {
    params.amount_off = customPrice.value;
    params.name = `${customPrice.value} XOF off ${props.course.title}`;
    params.currency = 'eur';
  } else if (couponType.value === "Free") {
    params.percent_off = 100;
    params.name = `100% off ${props.course.title}`;
  }

  params.name = params.name.slice(0, 40);

  createCoupon(params)
    .then(async (result: any) => {
      const paramPromo = {
        coupon: result.id,
        code: result.metadata.couponCode,
        expires_at: convertToTimestamp(endDate.value.toISOString()) / 1000,
      };
      return createNewPromotions(paramPromo)
        .then((res: any) => createNewPromotionsLocal(res));
    })
    .catch((error: any) => {
      console.error("Error creating coupon:", error);
      isSaving.value = false;
    });
};

const createNewPromotionsLocal = (pr: any) => {
  const pro: Record<string, any> = {
    id: pr.id,
    active: pr.active,
    code: pr.code,
    createdAt: convertTimestampToDate(pr.created),
    expiresAt: convertTimestampToDate(pr.expires_at),
    livemode: pr.livemode,
    max_redemptions: pr.max_redemptions ?? 0,
    times_redeemed: pr.times_redeemed ?? 0,
    coupon_Code: pr.coupon.metadata.couponCode,
    coupon_amount_off: pr.coupon.amount_off ?? 0,
    coupon_currency: pr.coupon.currency ?? "",
    coupon_duration: pr.coupon.duration,
    coupon_duration_in_months: pr.coupon.duration_in_months,
    coupon_max_redemptions: `${pr.coupon.max_redemptions ?? "0"}`,
    coupon_name: pr.coupon.name,
    coupon_percent_off: pr.coupon.percent_off ?? 0,
    coupon_redeem_by: pr.coupon.redeem_by,
    coupon_valid: pr.coupon.valid,
    courseId: props.course.id,
  };

  createPromotions(props.course.id, [pro])
    .then((res) => res.json())
    .then(() => {
      cancel();
      isSaving.value = false;
      emits("refresh");
    })
    .catch((error) => {
      console.error("Error saving local promotion:", error);
      isSaving.value = false;
    });
};

const cancelPromotions = (record: Record<string, any>) => {
  updatePromotions(record.id, { active: false })
    .then((updated: any) => {
      return UpdatePromotion(props.course.id, updated.id, { active: false });
    })
    .then((res: any) => res.json())
    .then(() => {
      emits("refresh");
      confirmation.value?.hideSpinner();
      confirmation.value?.hide();
    })
    .catch((error: any) => {
      console.error("Cancel error:", error);
      confirmation.value?.hideSpinner();
    });
};

const deleteCoupon = (record: Record<string, any>) => {
  deletePromotion(props.course.id, record.id)
    .then((response) => {
      confirmation.value?.hideSpinner();
      if (response.status === 200) {
        emits("refresh");
        confirmation.value?.hide();
      }
    })
    .catch((error) => {
      console.error("Delete error:", error);
      confirmation.value?.hideSpinner();
    });
};

const cancelPromotionsConfirmation = (record: Record<string, any>) => {
  currentPr.value = record;
  message.value = "Are you sure to want to deactivate this coupons? This action is not reversible.";
  title.value = "Deactivate coupon";
  confirmation.value?.show();
  action = "edit";
};

const deleteConfirmation = (record: Record<string, any>) => {
  currentPr.value = record;
  message.value = "Are you sure to want to delete this coupon? This action is not reversible.";
  title.value = "Delete coupon";
  confirmation.value?.show();
  action = "delete";
};

const initCreateCoupon = () => creatingCoupon.value = true;
const cancel = () => creatingCoupon.value = false;

const onAccepted = () => {
  confirmation.value?.showSpinner();
  if (action === "edit" && currentPr.value) cancelPromotions(currentPr.value);
  if (action === "delete" && currentPr.value) deleteCoupon(currentPr.value);
};

const onCancel = () => confirmation.value?.hide();

const initData = () => {
  if (props.course?.promotions) {
    const promotions = props.course.promotions.map((e: any) => ({
      ...e,
      discount: e.coupon_amount_off ? -e.coupon_amount_off : `${e.coupon_percent_off}%`,
    }));
    activeCoupons.value = promotions.filter((s: any) => s.active);
    recordsExpired.value = promotions.filter((s: any) => !s.active);
  }
};

watch(() => props.course, initData);
initData();

couponCode.value = generateCoupon();
columnsExpired.value[columnsExpired.value.length - 1] = {
  name: " ",
  value: "",
  isAction: true,
  buttons: [
    {
      fieldName: "Redemptions",
      icon: "bi-x-circle",
      isIcon: true,
      actionName: "delete",
      tooltip: "Delete promotions",
    },
  ],
};
</script>

<style scoped>
.g-border-1 {
  border: 0.1em solid rgb(169, 169, 169, 0.3);
}

.g-add-more-button {
  margin: 0;
  padding-top: 0.2em;
  background-color: white;
  color: gray;
}

.coupon_bloc .description {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.g-create_coupon {
  padding: 0.5em 1em;
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: sans-serif;
}

.g-create_coupon .title_bloc {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0.5em;
}

.g-create_coupon .title_bloc .title {
  font-weight: 900;
  font-size: 1em;
}

.g-create_coupon .description {
  margin-top: 1em;
  margin-bottom: 3em;
}

.type .title {
  font-weight: 900;
  font-size: 1.1em;
}

.coupon_card {
  display: flex;
  flex-direction: row;
  padding: 1em 1em;
  border: 0.1em solid rgb(128, 128, 128, 0.2);
  margin: 1em 0;
  font-family: sans-serif;
  cursor: pointer;
}

.coupon_card:hover {
  background-color: rgb(128, 128, 128, 0.1);
}

.coupon_card_description {
  display: flex;
  flex-direction: column;
  font-size: small;
  cursor: pointer;
}

.coupon_card_title {
  font-weight: 700;
  font-size: 1.2em;
  margin-bottom: 0.2em;
}

input[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 2px solid #0a0809;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}

input[type="radio"]:checked:before {
  content: "";
  width: 10px;
  height: 10px;
  background-color: black;
  position: absolute;
  color: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  font-size: 5px;
  line-height: 5px;
  text-align: center;
}

.coupon_card .input {
  margin-right: 0.5em;
}

button.cancel {
  padding: 0.5em 1em;
  outline: none;
  border: none;
  background-color: white;
  font-weight: 700;
  color: black;
}

.block {
  margin: 2em 0;
}

.block .title {
  font-weight: 900;
  font-size: 1.1em;
}

.block .content {
  border: 0.1em solid rgb(128, 128, 128, 0.1);
  padding: 1em;
}

.coupon_bloc .title {
  font-weight: 700;
  font-size: 1em;
  font-family: sans-serif;
}

.coupon_bloc .description .message {
  padding-top: 1em;
  font-size: 0.9em;
}

.endDate {
  display: flex;
  flex-direction: column;
}

.endDate .label {
  font-weight: 700;
  font-size: 0.9em;
  margin: 0.2em 0;
}

.endDate .value {
  margin: 0.2em 0;
}

.control_spinner {
  text-align: center;
  width: 100%;
}

.g-add-more-button:disabled:hover {
  background-color: gray;
}
</style>
