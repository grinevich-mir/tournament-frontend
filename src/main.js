import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import '@/scss/global.scss';
import VueTour from 'vue-tour';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';

import Amplify from 'aws-amplify';
import awsconfig from '@/aws-exports';

import MainLayout from '@/layouts/Main.vue';
import AuthLayout from '@/layouts/Auth.vue';
import StaticLayout from '@/layouts/Static.vue';
import BlankLayout from '@/layouts/Blank.vue';
import AffiliatesLayout from '@/layouts/Affiliates.vue';

import axios from 'axios';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import Rollbar from 'rollbar';
import VueNoty from 'vuejs-noty';
import vueDebounce from 'vue-debounce';
import formatMoney from '@/helpers/format-money';
import VueCookies from '@/helpers/cookies';
import VTooltip from 'v-tooltip';
import VueCompositionAPI from '@vue/composition-api';
import webSocketService from './services/webSocketService';

import App from './App.vue';

import router, { refreshToken } from './router';
import store from './store';
import '@/helpers/filters';

require('vue-tour/dist/vue-tour.css');

// Use axios
const api = axios.create({
  baseURL: process.env.VUE_APP_API_HOST,
});
api.interceptors.request.use(async (config) => {
  try {
    await refreshToken();
  } catch {
    // Do nothing
  }
  const { token } = store.getters;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Vue.prototype.$http = axios;
Vue.prototype.$api = api;
store.$api = api;
Vue.prototype.formatMoney = formatMoney;

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(timezone);
Vue.prototype.$dayjs = dayjs;

// Set the Rollbar instance in the Vue prototype before creating the first Vue instance.
const rollbarInstance = new Rollbar({
  accessToken: '32e337ceb79444d6b155be7af1a1120a',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: window.location.hostname,
  },
});
if (window.location.hostname === 'localhost' || window.location.hostname === '192.168.0.39' || window.location.hostname === '172.25.187.34' || window.location.hostname === process.env.VUE_APP_LOCAL_HOSTNAME) {
  rollbarInstance.configure({ enabled: false });
}
Vue.prototype.$rollbar = rollbarInstance;
store.$rollbar = rollbarInstance;
// If you have already set up a global error handler, just add `vm.$rollbar.error(err)` to the top of it.
// If not, this simple example will preserve the app's existing behavior while also reporting uncaught errors to Rollbar.
Vue.config.errorHandler = (err, vm, info) => { // eslint-disable-line
  vm.$rollbar.error(err);
  throw err; // rethrow
};

Vue.use(Vue2TouchEvents, {
  //
});
Vue.use(VueNoty, {
  timeout: 2500,
  progressBar: true,
  // layout: 'topCenter',
  layout: 'topRight',
});
Vue.use(vueDebounce);
Vue.use(webSocketService, {
  store,
  url: `${process.env.VUE_APP_WEBSOCKET_URL}`,
});
Vue.use(VueCookies);
Vue.use(VTooltip);
Vue.use(VueTour);
Vue.use(VueTelInput);
Vue.use(VueCompositionAPI);

Vue.component('main-layout', MainLayout);
Vue.component('auth-layout', AuthLayout);
Vue.component('static-layout', StaticLayout);
Vue.component('blank-layout', BlankLayout);
Vue.component('affiliates-layout', AffiliatesLayout);

Vue.config.productionTip = false;

Amplify.configure(awsconfig);

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    //
  },
}).$mount('#app');
