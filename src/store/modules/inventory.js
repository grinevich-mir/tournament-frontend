// import Vue from 'vue';

export default {
  state: {
    inventory: null,
    // count: 0,
  },
  getters: {
    // unclaimedGiftCount: (state, getters, rootState, rootGetters) => {
    //   if (state.inventory) {
    //     const notClaimed = state.inventory.items.filter((item) => item.level !== rootGetters.userLevel && item.claimed === false && (Vue.$dayjs(item.expires).isAfter() || typeof item.expires === 'undefined'));
    //     return notClaimed.length;
    //   }
    //   return 0;
    // },
    unclaimedGiftCount: (state) => {
      if (!state.inventory || !state.inventory.items.length) return null;
      return state.inventory.items.filter((o) => !o.claimed).length; // might need to add expired check
    },
  },
  mutations: {
    SET_INVENTORY(state, inventory) {
      state.inventory = inventory;
    },
    // SET_INVENTORY_COUNT(state, count) {
    //   state.count = count;
    // },
  },
  actions: {
    loadInventory({ commit }) {
      return this.$api
        .get('/inventory')
        .then((response) => response.data)
        .then((inventory) => {
          commit('SET_INVENTORY', inventory);
        })
        .catch(() => {
          commit('SET_INVENTORY', null);
        });
    },
    // loadInventoryCount({ commit }) {
    //   return this.$api
    //     .get('/inventory/count')
    //     .then((response) => response.data.count)
    //     .then((count) => {
    //       commit('SET_INVENTORY_COUNT', count);
    //     });
    // },
  },
};
