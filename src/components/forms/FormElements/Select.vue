<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';


interface OptionType {
  label: string;
  value: string | number ;
}

const props = defineProps<{
  lb?: string;
  defaultValue?: any[];
  isRequired?: boolean;
  modelValue?: string | number | null;
  options: OptionType[];
  disabled?: boolean;
}>();


const isDropdownOpen = ref(false);


const selectWrapper = ref<any>(null);

const selectedOption = ref<any>(props.options.find((option:any) => option.value === props.modelValue) || null);

// Synchroniser la sélection de l'option avec la prop modelValue
watch(() => props.modelValue, (newVal) => {
  selectedOption.value = props.options.find((option:any) => option.value === newVal) || null;
});

// Gérer l'ouverture et la fermeture du dropdown
const handleDropdownToggle = () => {
  if (!props.disabled) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

// Gérer la sélection d'une option
const selectOption = (option:any) => {
  if (!props.disabled) {
    selectedOption.value = option;
    isDropdownOpen.value = false;
    emit('update:modelValue', option.value); // Propager la nouvelle valeur avec v-model
    emit('select', option); // Émettre un événement pour l'option sélectionnée
    emit('change', option.value)
  }
}

const handleClickOutside = (event:any) => {
  if (selectWrapper.value && !selectWrapper.value?.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

// Écouter l'événement click globalement
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});



const emit = defineEmits(['update:modelValue', 'select','change'])


// Nettoyer l'écouteur d'événements lors du démontage
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="selectWrapper" class="w-full">
    <label for="floating_select" class="text-base"
        :class="['mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400', isDropdownOpen ? '  text-blue-500' : 'text-gray-500']">
        {{ lb }}<span v-if="isRequired" class="text-red-500">*</span>
      </label>
    <div :class="['relative font-sans cursor-pointer', disabled ? 'cursor-not-allowed text opacity-50' : '']"
      @click="handleDropdownToggle">
      <div
        :class="['flex justify-between dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800', isDropdownOpen ? ' border-blue-500 text-gray-900' : 'bg-transparent border-gray-400']">
        <span>{{ selectedOption ? selectedOption.label : " " }}</span>

        <span :class="[isDropdownOpen ? ' text-blue-500' : ' text-gray-500']">▼</span>
      </div>

      <input type="hidden" :required="isRequired" :value="selectedOption ? selectedOption.value : ''" class="" />
      <ul v-if="isDropdownOpen"
        class="custom-scrollbar text-lg sm:text-base absolute top-full left-0 right-0 bg-white border-2 border-gray-300 border-t-0 rounded-b-lg max-h-40 overflow-y-auto z-50 mt-1">
        <li v-for="option in options" :key="option.value" @click="!disabled && selectOption(option)"
          :class="['px-5 py-2 cursor-pointer hover:bg-gray-200', disabled ? 'cursor-not-allowed text-gray-400' : '']">
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
}

.text {
  background-color: #f3f4f6;
  /* Fond grisé */
}

.opacity-50 {
  opacity: 0.5;
}

.custom-scrollbar {
  scrollbar-width: thin;
  /* Pour Firefox */
  scrollbar-color: #3b82f6 #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #25ebe5;
}
</style>
