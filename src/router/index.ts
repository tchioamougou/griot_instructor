import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/composables/user'
import { isLoading } from '@/composables/spinner'

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
      meta: { requiresAuth: true }
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


    // manage instructor information in the course creation process

    {
      path: '/course',
      name: 'All Courses',
      component: () => import('@/views/courses/Courses.vue'),
      meta: {
        title: 'All Courses',
      },
    },

    {
      path: '/students',
      name: 'All students',
      component: () => import('@/views/performance/GStudents.vue'),
      meta: {
        title: 'All students',
      },
    },

     {
      path: '/performance/reviews',
      name: 'All Reviews',
      component: () => import('@/views/performance/GReviewsPerformance.vue'),
      meta: {
        title: 'All students',
      },
    },
    
     {
      path: '/performance/overview',
      name: 'Overview',
      component: () => import('@/views/performance/GOverview.vue'),
      meta: {
        title: 'Overview',
      },
    },
    
     {
      path: '/performance/engagement',
      name: 'Engagement',
      component: () => import('@/views/performance/GEngagement.vue'),
      meta: {
        title: 'Engagement',
      },
    },
      {
      path: '/payout-report',
      name: 'Payout Report',
      component: () => import('@/views/reports/PayoutReport.vue'),
      meta: {
        title: 'All students',
      },
    },
  
      {
      path: '/revenue-report',
      name: 'Revenue Report',
      component: () => import('@/views/reports/RevenueReport.vue'),
      meta: {
        title: 'All students',
      },
    },
          {
      path: '/payout-taxes',
      name: 'Payout Taxes',
      component: () => import('@/views/reports/GPayoutTax.vue'),
      meta: {
        title: 'Payout Taxes',
      },
    },
    /// Course Edit instruction 

      {
      path: "/course/:courseId/manage/:item",
      name: "editCourse",
      component: () => import('../views/courses/EditCourse.vue'),
      meta: {
        requiresAuth: true,
        noHeader: true,
        onlyInstructor: true,
      },
    },
  ],
})
router.beforeEach(async (to, from, next) => {
  isLoading.value = true;
  const authStore = useAuthStore();

  // Si la route nécessite une authentification et qu'on a pas de token
  if (to.meta.requiresAuth && !authStore.user) {
    return next('/signin');
  }

  // Si on va vers /signin et qu'on est déjà connecté
  if (to.path === '/signin' && authStore.token) {
    return next('/');
  }

  next();
});

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});


export default router

// router.beforeEach((to, from, next) => {
//   // document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
//   document.title = "Enjoy"
//   next()
// })


