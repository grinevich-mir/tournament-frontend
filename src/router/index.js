import Vue from 'vue';
import VueRouter from 'vue-router';
import { AmplifyEventBus, AmplifyPlugin } from 'aws-amplify-vue';
import * as AmplifyModules from 'aws-amplify';
import EventBus from '@/helpers/event-bus';
import store from '../store';

import Home from '../views/Home.vue';

Vue.use(VueRouter);
Vue.use(AmplifyPlugin, AmplifyModules);

export function refreshToken() {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
    if (data && data.signInUserSession) {
      store.commit('SET_USER', data);
    }
  });
}

export function getUser() {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
    if (data && data.signInUserSession) {
      store.commit('SET_USER', data);
      store.dispatch('loadJackpotsInterval');
      store.dispatch('loadUserData');
      store.dispatch('loadWallet');
      store.dispatch('loadInventory');
      store.dispatch('loadNotifications');
      store.dispatch('loadTicketStore');
      // store.dispatch('loadSubscription');
      // store.dispatch('loadInventoryCount');
      // store.dispatch('loadNotificationCount');
      Vue.prototype.$webSocketsConnect();
    }
    return data;
  }).catch((e) => {
    store.commit('SET_USER', null);
    console.log(e);
    return null;
  });
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      layout: 'blank',
      requiresAuth: false,
      guestOnly: true,
      allowAllWhenNotDirect: true,
    },
  },
  {
    path: '/fury-vs-wilder',
    name: 'LandingPageFury',
    component: () => import(/* webpackChunkName: "LandingPageFury" */ '../views/landing-pages/Fury.vue'),
    meta: {
      layout: 'blank',
      requiresAuth: false,
      guestOnly: false,
      // allowAllWhenNotDirect: true,
    },
  },
  {
    path: '/iphone-13-pro',
    name: 'LandingPageIphone',
    component: () => import(/* webpackChunkName: "LandingPageIphone" */ '../views/landing-pages/Iphone.vue'),
    meta: {
      layout: 'blank',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/Login.vue'),
    // component: () => import(/* webpackChunkName: "auth" */ '../components/auth/LoginForm.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false,
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/Register.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false,
      guestOnly: true,
    },
  },
  {
    path: '/forgotten-password',
    name: 'ForgottenPassword',
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/ForgottenPassword.vue'),
    // component: () => import(/* webpackChunkName: "auth" */ '../components/auth/LoginForm.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false,
      guestOnly: true,
    },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/ResetPassword.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false,
      guestOnly: true,
    },
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/Lobby.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/buy-diamonds',
    redirect: {
      name: 'Lobby',
      query: {
        store: true,
      },
    },
  },
  {
    path: '/buy-tickets',
    redirect: {
      name: 'Lobby',
      query: {
        store: true,
      },
    },
  },
  {
    path: '/play/:id',
    name: 'Play',
    component: () => import(/* webpackChunkName: "play" */ '../views/Play.vue'),
    props: ({ params }) => ({ id: Number.parseInt(params.id, 10) || 0 }),
    meta: {
      layout: 'blank',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/History.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/winners',
    name: 'Winners',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/winners/WinnersWrapper.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/Profile.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/Address.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/withdrawal',
    name: 'Withdrawal',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/Withdrawal.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/payment-history',
    name: 'PaymentHistory',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/PaymentHistory.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  // {
  //   path: '/new-payment-method',
  //   name: 'NewPaymentMethod',
  //   component: () => import(/* webpackChunkName: "lobby" */ '../views/NewPaymentMethod.vue'),
  //   meta: {
  //     layout: 'main',
  //     requiresAuth: true,
  //     guestOnly: false,
  //   },
  // },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: () => import(/* webpackChunkName: "lobby" */ '../components/diamond-store/PaymentSuccess.vue'),
    meta: {
      layout: 'blank',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  // ----------- UPGRADE -----------
  // {
  //   path: '/member',
  //   redirect: { name: 'Upgrade' },
  // },
  // {
  //   path: '/upgrade',
  //   name: 'Upgrade',
  //   component: () => import(/* webpackChunkName: "lobby" */ '../views/Upgrade.vue'),
  //   meta: {
  //     layout: 'auth',
  //     requiresAuth: true,
  //     guestOnly: false,
  //   },
  //   beforeEnter(to, from, next) {
  //     if (!store.state.vip.subscription) {
  //       // console.log('load sub', store.state.vip.subscription);
  //       store.dispatch('loadSubscription')
  //         .then(() => {
  //           if (store.state.vip.subscription && store.state.vip.subscription.status !== 'Expired') {
  //             // console.log('sub expired -> redirect profile');
  //             return next({ name: 'Profile' });
  //           }
  //           return next();
  //         });
  //     } else {
  //       // console.log('sub already loaded', store.state.vip.subscription);
  //       if (store.state.vip.subscription && store.state.vip.subscription.status !== 'Expired') {
  //         // console.log('sub expired -> redirect profile');
  //         return next({ name: 'Profile' });
  //       }
  //       return next();
  //     }
  //     // console.log('default next');
  //     return next();
  //   },
  // },
  // -------------------------------

  // {
  //   path: '/member',
  //   name: 'Vip',
  //   component: () => import(/* webpackChunkName: "lobby" */ '../views/Vip.vue'),
  //   meta: {
  //     layout: 'main',
  //     requiresAuth: true,
  //     guestOnly: false,
  //   },
  // },
  {
    path: '/amoe',
    name: 'Amoe',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/Amoe.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/notifications/NotificationsWrapper.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
    beforeEnter: async (to, from, next) => {
      await getUser();
      return next();
    },
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsConditions',
    component: () => import(/* webpackChunkName: "static" */ '../views/ContentPage.vue'),
    meta: {
      layout: 'static',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import(/* webpackChunkName: "static" */ '../views/ContentPage.vue'),
    meta: {
      layout: 'static',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  // {
  //   path: '/game-rules',
  //   name: 'GameRules',
  //   component: () => import(/* webpackChunkName: "static" */ '../views/ContentPage.vue'),
  //   meta: {
  //     layout: 'static',
  //     requiresAuth: false,
  //     guestOnly: false,
  //   },
  // },
  {
    path: '/cookie-policy',
    name: 'CookiePolicy',
    component: () => import(/* webpackChunkName: "static" */ '../views/ContentPage.vue'),
    meta: {
      layout: 'static',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  // {
  //   path: '/faq',
  //   name: 'FAQ',
  //   component: () => import(/* webpackChunkName: "static" */ '../views/ContentPage.vue'),
  //   meta: {
  //     layout: 'static',
  //     requiresAuth: false,
  //     guestOnly: false,
  //   },
  // },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: () => import(/* webpackChunkName: "static" */ '../views/ContentPage.vue'),
    meta: {
      layout: 'static',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "static" */ '../views/affiliates/Contact.vue'),
    meta: {
      layout: 'static',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/referrals',
    name: 'Referrals',
    component: () => import(/* webpackChunkName: "lobby" */ '../views/referrals/ReferralsWrapper.vue'),
    meta: {
      layout: 'main',
      requiresAuth: true,
      guestOnly: false,
    },
    redirect: '/referrals/refer-a-friend',
    children: [
      {
        path: '/referrals/refer-a-friend',
        name: 'ReferAFriend',
        component: () => import(/* webpackChunkName: "lobby" */ '../views/referrals/ReferAFriend.vue'),
        meta: {
          layout: 'main',
          requiresAuth: true,
          guestOnly: false,
        },
      },
      {
        path: '/referrals/list',
        name: 'ReferralsList',
        component: () => import(/* webpackChunkName: "lobby" */ '../views/referrals/ReferralsList.vue'),
        meta: {
          layout: 'main',
          requiresAuth: true,
          guestOnly: false,
        },
      },
      {
        path: '/referrals/rewards',
        name: 'ReferralsRewards',
        component: () => import(/* webpackChunkName: "lobby" */ '../views/referrals/Rewards.vue'),
        meta: {
          layout: 'main',
          requiresAuth: true,
          guestOnly: false,
        },
      },
    ],
  },
  {
    path: '/r/:slug',
    name: 'ReferralLander',
    component: Home,
    // component: () => import(/* webpackChunkName: "lobby" */ '../views/referrals/Lander.vue'),
    meta: {
      layout: 'blank',
      requiresAuth: false,
      guestOnly: true,
      allowAllWhenNotDirect: true,
    },
  },
  {
    path: '/affiliates',
    name: 'AffiliatesHome',
    component: () => import(/* webpackChunkName: "static" */ '../views/affiliates/Home.vue'),
    meta: {
      layout: 'affiliates',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/affiliates/commission',
    name: 'AffiliatesCommission',
    component: () => import(/* webpackChunkName: "static" */ '../views/affiliates/Commission.vue'),
    meta: {
      layout: 'affiliates',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/affiliates/faq',
    name: 'AffiliatesFAQ',
    component: () => import(/* webpackChunkName: "static" */ '../views/affiliates/FAQ.vue'),
    meta: {
      layout: 'affiliates',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/affiliates/contact',
    name: 'AffiliatesContact',
    component: () => import(/* webpackChunkName: "static" */ '../views/affiliates/Contact.vue'),
    meta: {
      layout: 'affiliates',
      requiresAuth: false,
      guestOnly: false,
    },
  },
  {
    path: '/affiliates/terms',
    name: 'AffiliatesTerms',
    component: () => import(/* webpackChunkName: "static" */ '../views/affiliates/Terms.vue'),
    meta: {
      layout: 'affiliates',
      requiresAuth: false,
      guestOnly: false,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // linkActiveClass: 'active',
  // linkExactActiveClass: '',
  scrollBehavior(to, from, savedPosition) { // eslint-disable-line no-unused-vars
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
  routes,
});

let user;

AmplifyEventBus.$on('authState', async (state) => {
  if (state === 'signedOut') {
    Vue.prototype.$webSocketsDisconnect();
    user = null;
    store.commit('SET_USER', null);
    router.replace({ name: 'Home' });
  }
});

AmplifyModules.Hub.listen('auth', async (data) => {
  const { payload } = data;
  if (payload.event === 'signIn' && payload.data) {
    user = await getUser();
    if (router.currentRoute.name !== 'Register') {
      if (router.currentRoute.query.redirect) {
        router.replace({ path: router.currentRoute.query.redirect });
      } else {
        router.replace({ name: 'Lobby', query: router.currentRoute.query });
      }
    }
  }
});

// router.beforeResolve(async (to, from, next) => {
router.beforeEach(async (to, from, next) => {
  // affiliate cookies
  if (to.query.btag && !Vue.$cookies.get('affx')) {
    Vue.$cookies.set('affx', to.query.btag, '30d');
  }
  if (to.query.restorePurchase && localStorage.currentOrder) {
    Vue.prototype.$api.get(`/order/${JSON.parse(localStorage.getItem('currentOrder')).orderId}`)
      .then((response) => {
        if (response.data.status === 'Complete') {
          EventBus.$emit('openTicketConfirmedView');
        }
      });
  }

  document.body.classList.remove('no-scroll');
  if (to.matched.some((record) => record.meta.requiresAuth) && !store.state.auth.user) {
    user = await getUser();
    if (!user) {
      return next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
        replace: true,
      });
    }
    return next();
  }
  if (to.matched.some((record) => record.meta.requiresAuth) && store.state.auth.user) {
    if (store.getters.tokenExp) {
      if (store.getters.tokenExp <= Math.round((new Date()).getTime() / 1000)) {
        user = await getUser();
      }
    }
  }
  // if (to.matched.some((record) => record.meta.guestOnly)) {
  if (to.meta.allowAllWhenNotDirect) {
    user = await getUser();
    if (user && !from.name) {
      return next({ name: 'Lobby', query: to.query, replace: true });
      // return next();
    }
  } else if (to.meta.guestOnly) {
    user = await getUser();
    if (user) {
      return next({ name: 'Lobby', query: to.query, replace: true });
    }
  }
  return next();
});

export default router;
