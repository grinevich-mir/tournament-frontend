import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import banking from './modules/banking';
import tournaments from './modules/tournaments';
import inventory from './modules/inventory';
import vip from './modules/vip';
import notifications from './modules/notifications';
import helpers from './modules/helpers';
import diamonds from './modules/diamonds';
import referrals from './modules/referrals';

Vue.use(Vuex);

// TODO: HANDLE API ERRORS
// function handleError(error) {
//   this.$rollbar.info('loadTournaments');
// }

export default new Vuex.Store({
  modules: {
    auth,
    banking,
    inventory,
    tournaments,
    notifications,
    vip,
    helpers,
    diamonds,
    referrals,
  },
});
