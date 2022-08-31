export default {
  state: {
    subscription: null,
    showVip: process.env.VUE_APP_SHOW_VIP === 'true',
    vipActive: process.env.VUE_APP_VIP_ACTIVE === 'true',
    showVipTimer: process.env.VUE_APP_SHOW_VIP_TIMER === 'true',
    onlyVipCanChat: process.env.VUE_APP_ONLY_VIP_CAN_CHAT === 'true',
    benefits: [
      '✅ &nbsp;No commitment, cancel anytime',
      '✅ &nbsp;Access every game on Tournament for 24h',
      '✅ &nbsp;Unrestricted chat, community and huge cash prizes',
      '✅ &nbsp;Enjoy Membership for $19.99/mo. (Less than $1 per day)',
    ],
    trialBenefits: [
      '✅ &nbsp;No commitment, cancel anytime',
      '✅ &nbsp;Access every game on Tournament for 24h',
      '✅ &nbsp;Unrestricted chat, community and huge cash prizes',
      '✅ &nbsp;Enjoy Membership after 24h for $19.99/mo. (Less than $1 per day)',
    ],
  },
  getters: {
    canUpgradeToVip: (state, getters, rootState, rootGetters) => {
      if (!rootState.auth.userData) {
        return false;
      }
      if (state.showVip && (rootGetters.userLevel <= 1 || !rootState.auth.userData.subscribing)) {
        return true;
      }
      return false;
    },
    canUseTrial: (state, getters, rootState, rootGetters) => {
      if (!rootState.auth.userData) {
        return false;
      }
      if (state.showVip && (rootGetters.userLevel <= 1 && !rootState.auth.userData.subscribed)) {
        return true;
      }
      return false;
    },
    benefits: (state, getters, rootState) => {
      let canTrial = true;

      if (rootState.auth.userData && rootState.auth.userData.subscribed) {
        canTrial = false;
      }

      if (canTrial) {
        return state.trialBenefits;
      }

      return state.benefits;
    },
  },
  mutations: {
    SET_SUBSCRIPTION(state, subscription) {
      state.subscription = subscription;
    },
  },
  actions: {
    loadSubscription({ commit }) {
      return this.$api
        .get('/upgrade/subscription')
        .then((response) => response.data)
        .then((subscription) => {
          commit('SET_SUBSCRIPTION', subscription);
        })
        .catch(() => {
          commit('SET_SUBSCRIPTION', false);
        });
    },
  },
};
