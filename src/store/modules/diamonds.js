export default {
  state: {
    gameClicked: null,
    items: [],
    lastPurchases: [],
  },
  getters: {
    lastDiamondPurchase(state) {
      if (!state.lastPurchases.length) return null;
      return state.lastPurchases.find((o) => o.type === 'Diamonds');
    },
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_LAST_PURCHASES(state, lastPurchases) {
      state.lastPurchases = lastPurchases;
    },
    SET_GAME_CLICKED(state, game) {
      state.gameClicked = game;
    },
  },
  actions: {
    loadTicketStore({ commit }) {
      return this.$api.get('/store')
        .then((response) => response.data)
        .then((data) => {
          commit('SET_ITEMS', data.items.sort((a, b) => a.price - b.price));
          commit('SET_LAST_PURCHASES', data.lastPurchases);
        });
    },
    setGameClicked({ commit }, game) {
      commit('SET_GAME_CLICKED', game);
    },
  },
};
