<template>
  <router-link to="/" class="lg:hidden flex items-center gap-2">
  <!-- Logo en mode clair -->
  <img class="dark:hidden rounded-full w-10" src="@/assets/images/logo/GRIOT-withe-v1.png" alt="Logo" />



  <!-- Logo en mode sombre -->
  <img class="hidden dark:block rounded-full w-10" src="@/assets/images/logo/Griot-black-review.ico" alt="Logo" />
    <!-- Texte -->
    <span class="inline-flex text-xl text-purple-500 font-bold">{{ $t('instructor') }}</span>
</router-link>

</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
