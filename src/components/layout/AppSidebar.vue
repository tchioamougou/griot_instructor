<template>


  <aside>

  <div
  :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"

  >


    <div
      :class="[
        'pt-4 pb-10 flex  ',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/" class="flex items-center gap-2 ">


        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden rounded-full w-10"
          src="/src/assets/images/header/logo2.png"
          alt="Logo"

        />

        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block rounded-full w-10"
          src="/src/assets/images/header/logo2.png"
          alt="Logo"

        />

        <img
          v-else
          class=" rounded-full w-10"
          src="/src/assets/images/header/logo2.png"
          alt="Logo"

        />
        <span v-if="isExpanded || isHovered || isMobileOpen" class="inline-flex text-2xl text-purple-500 font-bold">Enjoy</span>
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar mt-2"
      @mouseenter="!isExpanded && (isHovered = true)"
     @mouseleave="isHovered = false"
    >
      <nav class="">
        <div class="flex flex-col gap-2">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <!-- <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2> -->
            <ul class="flex flex-col gap-3 ">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group text-md w-full ',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text  "
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-purple-400': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
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

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
  SettingsIcon,
  UserGroupIcon,
  RoomIcon,
} from "../../icons";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const menuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: "/",

      },
      {
        icon: CalenderIcon,
        name: "Booking",
        path: "/calendar1",
        subItems: [{ name: "All Booking", path: "/rr"},{name:"Add Booking" ,path: "/fff"},{name:"Edit Booking", path: "/ww"}],
      },
      {
        icon: RoomIcon,
        name: "Room",
        path: "/profile",
        subItems: [{ name: "All Rooms", path: "/ff"},
        {name:"Room Types", path: "/ddd"}
      ],
      },

      {
        name: "Reports",
        icon: ListIcon,
        subItems: [
          { name: "Stocks", path: "/form-elements" },
          { name: "Expenses", path: "/nnn" },
          { name: "Booking", path: "/element" },
        ],
      },
      {
        name: "Customers",
        icon: UserGroupIcon,
        path: "/basic-tables",
      },
      {
        name: "Payements",
        icon: PageIcon,
        subItems: [
          { name: "Payment Methods", path: "/blank"},
          // { name: "404 Page", path: "/error-404", pro: false },
          { name: "Invoice List", path:"/calendar"},
          { name: "Invoice Details"},
        ],
      },
      {
        name: "User",
        icon: UserCircleIcon,
        path: "/c",
      },

      {
        name: "Setting",
        icon: SettingsIcon,
        path: "/cal",
      },
    ],
  },
  {
    title: "Others",
    items: [
      {
        icon: PieChartIcon,
        name: "Charts",
        subItems: [
          { name: "Line Chart", path: "/line-chart", pro: false },
          { name: "Bar Chart", path: "/bar-chart", pro: false },
        ],
      },
      {
        icon: BoxCubeIcon,
        name: "Ui Elements",
        subItems: [
          { name: "Alerts", path: "/alerts", pro: false },
          { name: "Avatars", path: "/avatars", pro: false },
          { name: "Badge", path: "/badge", pro: false },
          { name: "Buttons", path: "/buttons", pro: false },
          { name: "Images", path: "/images", pro: false },
          { name: "Videos", path: "/videos", pro: false },
        ],
      },
      {
        icon: PlugInIcon,
        name: "Authentication",
        subItems: [
          { name: "Signin", path: "/signin", pro: false },
          { name: "Signup", path: "/signup", pro: false },
        ],
      },
      // ... Add other menu items here
    ],
  },
];

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
