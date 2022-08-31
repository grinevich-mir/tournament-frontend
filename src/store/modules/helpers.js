export default {
  state: {
    isMobile: false,
    isMobileSmall: false,
  },
  mutations: {
    SET_ISMOBILE(state, isMobile) {
      state.isMobile = isMobile;
    },
    SET_ISMOBILESMALL(state, isMobileSmall) {
      state.isMobileSmall = isMobileSmall;
    },
  },
  actions: {
    setIsMobile({ commit }, isMobile) {
      commit('SET_ISMOBILE', isMobile);
    },
    setIsMobileSmall({ commit }, isMobileSmall) {
      commit('SET_ISMOBILESMALL', isMobileSmall);
    },
  },
};
