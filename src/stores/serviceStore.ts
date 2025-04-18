
import { defineStore } from 'pinia';

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceId: 4,
  }),
});
