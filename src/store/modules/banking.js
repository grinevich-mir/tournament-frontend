import formatMoney from '@/helpers/format-money';

export default {
  state: {
    wallet: null,
    paymentOptions: null,
    paymentMethod: null,
    simpleWithdrawal: false,
    minWithdrawal: 100,
  },
  getters: {
    walletBalance(state) {
      return state.wallet !== null ? formatMoney(state.wallet.withdrawable.balance, state.wallet.withdrawable.currencyCode) : false;
    },
    diamondBalance(state) {
      return state.wallet !== null ? state.wallet.diamonds : false;
    },
  },
  mutations: {
    SET_WALLET(state, wallet) {
      state.wallet = wallet;
    },
    SET_PAYMENTOPTIONS(state, paymentOptions) {
      state.paymentOptions = paymentOptions;
    },
    SET_PAYMENTMETHOD(state, paymentMethod) {
      state.paymentMethod = paymentMethod;
    },
    SET_DIAMONDS_BALANCE(state, diamonds) {
      state.wallet = { ...state.wallet, diamonds };
    },
    SET_WALLET_WITHDRAWABLE(state, balance) {
      state.wallet = {
        ...state.wallet,
        withdrawable: {
          balance,
        },
      };
    },
  },
  actions: {
    loadWallet({ commit }) {
      return this.$api
        .get('/banking/wallet')
        .then((response) => response.data)
        .then((wallet) => {
          commit('SET_WALLET', wallet);
        });
    },
    loadPaymentMethods({ commit }) {
      return this.$api.get('/payment/method')
        .then((response) => response.data)
        .then((paymentMethod) => {
          commit('SET_PAYMENTMETHOD', paymentMethod);
        }).catch(() => {
          commit('SET_PAYMENTMETHOD', null);
        });
    },
    loadPaymentOptions({ commit }) {
      return this.$api.get('/payment/option')
        .then((response) => response.data)
        .then((paymentOptions) => {
          commit('SET_PAYMENTOPTIONS', paymentOptions);
        }).catch(() => {
          commit('SET_PAYMENTOPTIONS', null);
        });
    },
    updateWalletBalance({ commit }, data) {
      console.log('updateWalletBalance', data);
      data.payload.forEach((event) => {
        console.log(event);
        if (event.account === 'Diamonds') {
          commit('SET_DIAMONDS_BALANCE', event.balance);
        }
        if (event.account === 'Withdrawable') {
          console.log('SET_WALLET_WITHDRAWABLE');
          commit('SET_WALLET_WITHDRAWABLE', event.balance);
        }
      });
    },
    incrementDiamondBalance({ commit, state }, increment) {
      commit('SET_DIAMONDS_BALANCE', state.wallet.diamonds + increment);
    },
  },
};
