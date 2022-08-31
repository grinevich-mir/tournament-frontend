export default {
  state: {
    referralUser: null,
    rewards: null,
    referrals: null,
    commissionRates: null,
  },
  getters: {
    referralCount(state) {
      return state.referralUser !== null ? state.referralUser.referralCount : 0;
    },
    referralRevenue(state) {
      return state.referralUser !== null ? state.referralUser.revenue : 0;
    },
    rewardCount(state) {
      return state.referralUser !== null ? state.referralUser.rewardCount : 0;
    },
    referralCode(state) {
      return state.referralUser !== null ? state.referralUser.code : null;
    },
    referralSlug(state) {
      return state.referralUser !== null ? state.referralUser.slug : null;
    },
    referralGroup(state) {
      return state.referralUser !== null ? state.referralUser.group : null;
    },
  },
  mutations: {
    SET_REFERRAL_USER(state, referralUser) {
      state.referralUser = referralUser;
    },
    SET_REFERRALS(state, referrals) {
      state.referrals = referrals;
    },
    SET_REWARDS(state, rewards) {
      state.rewards = rewards;
    },
    SET_COMMISSION_RATES(state, rates) {
      state.commissionRates = rates;
    },
  },
  actions: {
    loadReferralUser({ commit }) {
      return this.$api
        .get('/referral/user')
        .then((response) => response.data)
        .then((user) => {
          commit('SET_REFERRAL_USER', user);
        });
    },
    loadReferrals({ commit }, options) {
      return this.$api
        .get('/referral', { params: options })
        .then((response) => response.data)
        .then((referrals) => {
          commit('SET_REFERRALS', referrals);
        });
    },
    loadReferralRewards({ commit }, options) {
      return this.$api
        .get('/referral/reward', { params: options })
        .then((response) => response.data)
        .then((rewards) => {
          commit('SET_REWARDS', rewards);
        });
    },
    loadReferralCommissionRates({ commit }) {
      return this.$api
        .get('/referral/commission')
        .then((response) => response.data)
        .then((rates) => {
          commit('SET_COMMISSION_RATES', rates);
        });
    },
  },
};
