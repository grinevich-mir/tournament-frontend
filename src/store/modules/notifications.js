export default {
  state: {
    notifications: null,
    // count: 0,
  },
  getters: {
    unreadNotificationCount: (state) => {
      if (!state.notifications || !state.notifications.items.length) return null;
      return state.notifications.items.filter((o) => !o.read).length;
    },
  },
  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications;
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.items.push(notification);
    },
    UPDATE_NOTIFICATION(state, notification) {
      const index = state.notifications.items.findIndex((n) => n.id === notification.id);
      state.notifications.items[index] = notification;
    },
    // SET_NOTIFICATION_COUNT(state, count) {
    //   state.count = count;
    // },
  },
  actions: {
    pushNotification({ commit }, data) {
      commit('ADD_NOTIFICATION', data.payload);
    },
    loadNotifications({ commit }) {
      return this.$api
        .get('/notification')
        .then((response) => response.data)
        .then((notifications) => {
          commit('SET_NOTIFICATIONS', notifications);
        });
    },
    markAsRead({ commit }, notification) {
      return this.$api
        .post(`/notification/${notification.id}/read`)
        .then(() => {
          notification.read = true;
          commit('UPDATE_NOTIFICATION', notification);
        });
    },
    markAllAsRead({ commit, state }) {
      return this.$api
        .delete('/notification/all/read')
        .then(() => {
          const n = { ...state.notifications };
          n.items.forEach((e) => { e.read = true; });
          commit('SET_NOTIFICATIONS', n);
        });
    },
    // loadNotificationCount({ commit }) {
    //   return this.$api
    //     .get('/notification/count')
    //     .then((response) => response.data.count)
    //     .then((count) => {
    //       commit('SET_NOTIFICATION_COUNT', count);
    //     });
    // },
  },
};
