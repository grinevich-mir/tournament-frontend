import Vue from 'vue';

export default {
  state: {
    isUserDataLoading: false,
    user: null,
    userData: null,
    showCompleteRegModal: false,
  },
  getters: {
    token: (state) => {
      let token = false;
      if (state.user) {
        token = state.user.signInUserSession.accessToken.jwtToken;
      }
      return token;
    },
    tokenExp: (state) => {
      let tokenExp = false;
      if (state.user) {
        tokenExp = state.user.signInUserSession.accessToken.payload.exp;
      }
      return tokenExp;
    },
    userLevel: (state) => {
      if (state.userData !== null) {
        return state.userData.level;
      }
      return 0;
    },
    displayName: (state) => {
      if (state.userData) {
        return state.userData.displayName;
      }
      return '';
    },
    completedTour: (state) => {
      if (!state.userData || !state.userData.metadata) return null;
      return state.userData.metadata.completedTour;
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USERDATA(state, userData) {
      state.userData = userData;
    },
    SET_SHOWCOMPLETEREGMODAL(state, modalstate) {
      state.showCompleteRegModal = modalstate;
    },
  },
  actions: {
    loading_userdata(context, payload) {
      context.commit('SET_USERDATALOADING', payload);
    },
    showCompleteRegModal({ commit }, modalstate = true) {
      commit('SET_SHOWCOMPLETEREGMODAL', modalstate);
    },
    login(context, payload) {
      context.commit('setAuthState', true);
      context.commit('setToken', payload.tokenData);
      localStorage.setItem('access_token', payload.tokenData.access_token);
    },
    logout({ commit }) {
      // commit('setAuthState', false);
      // commit('setToken', {
      //   token_type: '',
      //   access_token: '',
      //   expires_in: 0,
      // });
      commit('SET_USER', null);
      commit('SET_WALLET', null);
      commit('SET_USERDATA', null);
      commit('SET_INVENTORY', null);
      commit('SET_SUBSCRIPTION', null);
      commit('SET_PAYMENTMETHOD', null);
      commit('SET_NOTIFICATIONS', null);
      commit('SET_LAST_PURCHASES', null);
      commit('SET_GAME_CLICKED', null);

      if (localStorage.access_token) {
        localStorage.removeItem('access_token');
        Vue.toasted.show('You\'ve been logged out.', { singleton: true });
      }
      if (localStorage.currentOrder) {
        localStorage.removeItem('currentOrder', true);
      }
    },
    loadUserData({ commit, dispatch }) {
      return this.$api
        .get('/user')
        .then((response) => response.data)
        .then((userData) => {
          commit('SET_USERDATA', userData);
          if (userData.displayName === undefined) {
            commit('SET_SHOWCOMPLETEREGMODAL', true);
          }
          dispatch('loadPaymentMethods');
        });
    },
  },
};
