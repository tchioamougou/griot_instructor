<template>

  <div v-if="isLoading"
    class="fixed inset-0 z-[100000] flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
    <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
    </svg>

  </div>

  <!-- <div v-if="isLoading" class="fixed inset-0 z-[9999] bg-white/70 dark:bg-gray-900/70 flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <svg class="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span class="text-gray-700 dark:text-gray-200 text-lg font-semibold">Chargement…</span>
    </div>
  </div> -->
  <aside>

    <div :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]">


      <div :class="[
        'pt-4 pb-10 flex  ',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]">
        <router-link to="/" class="flex items-center gap-2 ">


          <img v-if="isExpanded || isHovered || isMobileOpen" class="dark:hidden rounded-full w-20"
            src="/src/assets/images/logo/GRIOT-withe-v1.png" alt="Logo" />

          <img v-if="isExpanded || isHovered || isMobileOpen" class="hidden dark:block rounded-full w-10"
            src="/src/assets/images/logo/GRIOT-withe-v1.png" alt="Logo" />

          <img v-else class=" rounded-full w-10" src="/src/assets/images/logo/GRIOT-withe-v1.png" alt="Logo" />
          <span v-if="isExpanded || isHovered || isMobileOpen"
            class="inline-flex text-2xl text-gray-900 font-bold">Instructor</span>
        </router-link>
      </div>
      <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar mt-2"
        @mouseenter="!isExpanded && (isHovered = true)" @mouseleave="isHovered = false">
        <nav class="">
          <div class="flex flex-col gap-2">
            <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            
              <ul class="flex flex-col gap-3 ">
                <li v-for="(item, index) in menuGroup.items" :key="item.name">
                  <button v-if="item.subItems" @click="toggleSubmenu(groupIndex, index)" :class="[
                    'menu-item group text-md w-full ',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]">
                    <span :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                      <component :is="item.icon" />
                    </span>
                    <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text  ">  {{ $t(item.name) }}
</span>
                    <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-primary': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]" />
                  </button>
                  <router-link v-else-if="item.path" :to="item.path" @click="startLoading" :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]">
                    <span :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                      <component :is="item.icon" />
                    </span>
                    <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ $t(item.name)  }}</span>
                  </router-link>
                  <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                    @after-leave="endTransition">
                    <div v-show="isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                      ">
                      <ul class="mt-2 space-y-1 ml-9">
                        <li v-for="subItem in item.subItems" :key="subItem.name">
                          <router-link :to="subItem.path" @click="startLoading" :class="[
                            'menu-dropdown-item text-md ',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]">
                            {{ $t(subItem.name)  }}
          
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </transition>
                </li>
              </ul>
            </div>
          </div>
        </nav>

      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";


import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ListIcon,
  SettingsIcon,
  UserGroupIcon,
  RoomIcon,
  PaymentIcon
} from "../../icons";
import { useSidebar } from "@/composables/useSidebar";
import { isLoading } from '@/composables/spinner';

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();



const startLoading = () => {
  isLoading.value = true;
};

// Stop loading on navigation end
watch(() => route.fullPath, () => {
  isLoading.value = false;
});


// === Interfaces de typage ===
interface SubItem {
  name: string;
  path: string;
  pro?: boolean;
}

interface MenuItem {
  icon?: any;
  name: string;
  path?: string;
  subItems?: SubItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

// === Menu Data ===
const menuGroups: MenuGroup[] = [
  {
    title: 'Menu', // Optional to translate too if needed
    items: [
      {
        icon: GridIcon,
        name: 'menu.dashboard',  // Use translation key here
        path: '/',
      },
      {
        icon: CalenderIcon,
        name: 'menu.courses',
        path: '/course',
      },
      {
        icon: RoomIcon,
        name: 'menu.communication',
        path: '/profile',
        subItems: [
          { name: 'menu.messages', path: '/communitcation/messages' },
          { name: 'menu.qna', path: '/communitcation/question' },
        ],
      },
      {
        name: 'menu.performance',
        icon: ListIcon,
        subItems: [
          { name: 'menu.overview', path: '/performance/overview' },
          { name: 'menu.reviews', path: '/performance/reviews' },
          { name: 'menu.courseEngagement', path: '/performance/engagement' },
        ],
      },
      {
        name: 'menu.payments',
        icon: PaymentIcon,
        subItems: [
          { name: 'menu.revenueReport', path: '/revenue-report' },
          { name: 'menu.payoutReport', path: '/payout-report' },
          { name: 'menu.payoutTaxes', path: '/payout-taxes' },
        ],
      },
      {
        name: 'menu.students',
        icon: UserCircleIcon,
        path: '/students',
      },
      {
        name: 'menu.accountSetting',
        icon: SettingsIcon,
        path: '/setting',
      },
    ],
  },
];





// Vérifie si une route est active
const isActive = (path: string): boolean => route.path === path;

// Toggle l'ouverture/fermeture d'un sous-menu
const toggleSubmenu = (groupIndex: number, itemIndex: number): void => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

// Vérifie si un des sous-menus contient une route active
const isAnySubmenuRouteActive = computed<boolean>(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems?.some((subItem) => isActive(subItem.path))
    )
  );
});

// Vérifie si le sous-menu est ouvert ou contient une route active
const isSubmenuOpen = (groupIndex: number, itemIndex: number): boolean | undefined => {
  const key = `${groupIndex}-${itemIndex}`;
  const item = menuGroups[groupIndex].items[itemIndex];

  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      item.subItems?.some((subItem) => isActive(subItem.path)))
  );
};

// Transition pour ouvrir le menu avec animation
const startTransition = (el: Element): void => {
  // Assurez-vous que el est bien un HTMLElement
  const htmlEl = el as HTMLElement;

  htmlEl.style.height = 'auto';
  const height = htmlEl.scrollHeight;
  htmlEl.style.height = '0px';
  void htmlEl.offsetHeight; // force reflow
  htmlEl.style.height = height + 'px';
};


// Nettoie la transition
const endTransition = (el: Element): void => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '';
};

</script>
