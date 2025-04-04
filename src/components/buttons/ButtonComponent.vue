<template>
    <button class="" :class="buttonClasses" :disabled="disabled" @click="handleClick">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    variant: {
        type: String,
        default: 'primary', // Options : 'primary', 'secondary', 'danger'
    },
    size: {
        type: String,
        default: 'md', // Options : 'sm', 'md', 'lg'
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
 
const emits = defineEmits(['click']);

const handleClick = () => {
    if (!props.disabled) {
        emits('click');
    }
};

const buttonClasses = computed(() => {
    const baseClasses = 'font-medium rounded focus:outline-none focus:ring-2 transition rounded-full';

    const variantClasses = {
        primary: 'bg-orange-500 text-white hover:bg-orange-500 focus:ring-orange-300',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-3 text-lg',
    };

    const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${variantClasses[props.variant] || ''} ${sizeClasses[props.size] || ''} ${disabledClasses}`;
});
</script>
