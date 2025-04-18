import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/Edashboard.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/all_booking',
      name: 'All Booking',
      component: () => import('../views/Bookings/AllBooking.vue'),
      meta: {
        title: 'All Booking',
      },
    },
    {
      path: '/add_booking',
      name: 'Add Booking',
      component: () => import('../views/Bookings/AddBooking.vue'),
      meta: {
        title: 'Add Booking',
      },
    },
    {
      path: '/edit_booking',
      name: 'Edit Booking',
      component: () => import('../views/Bookings/EditBooking.vue'),
      meta: {
        title: 'Edit Booking',
      },
    },
    {
      path: '/all_room',
      name: 'All Room',
      component: () => import('../views/Room/AllRoom.vue'),
      meta: {
        title: 'All Room',
      },
    },
    {
      path: '/type_room',
      name: 'Room Type',
      component: () => import('../views/Room/RoomTypes.vue'),
      meta: {
        title: 'Room Type',
      },
    },
    {
      path: '/stock',
      name: 'stock',
      component: () => import('../views/Reports/StocksTable.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/Users/UsersTable.vue'),
    },
    {
      path: '/expense',
      name: 'expense',
      component: () => import('../views/Reports/ExpensesTable.vue'),
    },
    {
      path: '/booking',
      name: 'Booking',
      component: () => import('../views/Reports/BookingTable.vue'),
    },
    {
      path: '/customers',
      name: 'Customers',
      component: () => import('../views/Customers/CustomersTable.vue'),
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  // document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  document.title = "Enjoy"
  next()
})
