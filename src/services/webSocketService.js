import EventBus from '@/helpers/event-bus';
import { refreshToken } from '../router';

const webSocketsService = {};

webSocketsService.install = (Vue, options) => {
  let ws = null;
  let reconnectInterval = options.reconnectInterval || 1000;

  const { store } = options;

  function handleMessage(params) {
    const data = JSON.parse(params.data);
    console.log('message received', data);
    switch (data.type) {
      default:
        return data;
      case 'Notification:Added':
        EventBus.$emit('notification', data);
        return store.dispatch('pushNotification', data);
      case 'Tournament:Entry:Update':
        EventBus.$emit('tournamentEntryUpdate', data.payload);
        break;
      case 'Wallet:BalanceUpdated':
        return store.dispatch('updateWalletBalance', data);
      case 'Order:Complete':
        return EventBus.$emit('orderComplete', data);
    }

    return data;
  }

  Vue.prototype.$webSocketsConnect = () => {
    Vue.prototype.$webSocketsDisconnect();

    ws = new WebSocket(options.url);

    ws.onopen = () => {
      // Restart reconnect interval
      reconnectInterval = options.reconnectInterval || 1000;
      console.log('✅ Socket connected!');
      Vue.prototype.$webSocketsLogin();
    };

    ws.onmessage = (event) => {
      // New message from the WS - use JSON.parse(event.data)
      handleMessage(event);
    };

    ws.onclose = (event) => {
      console.log('Socket closed.');

      if (event.code === 3000) {
        return;
      }
      const maxReconnectInterval = options.maxReconnectInterval || 3000;
      setTimeout(() => {
        if (reconnectInterval < maxReconnectInterval) {
          // Reconnect interval can't be > x seconds
          reconnectInterval += 1000;
        }
        Vue.prototype.$webSocketsConnect();
      }, reconnectInterval);
    };

    ws.onerror = (error) => {
      console.log(error);
      ws.close();
    };
  };

  Vue.prototype.$webSocketsDisconnect = () => {
    if (!ws) {
      return;
    }
    ws.close(3000);
    ws = null;
    console.log('✅ Socket disconnected!');
  };

  Vue.prototype.$webSocketsSend = (data) => {
    if (!ws) {
      return;
    }
    // Send data to the backend - use JSON.stringify(data)
    ws.send(JSON.stringify(data));
  };

  Vue.prototype.$webSocketsLogin = () => {
    if (!ws || !store.state.auth.user) {
      return;
    }

    refreshToken().then(() => {
      ws.send(JSON.stringify({
        action: 'login',
        token: store.state.auth.user.signInUserSession.accessToken.jwtToken,
      }));
      console.log('✅ Socket login!');
    });
  };

  Vue.prototype.$webSocketsLogout = () => {
    if (!ws || !store.state.auth.user) {
      return;
    }

    ws.send(JSON.stringify({
      action: 'logout',
    }));
    console.log('✅ Socket logout!');
  };
};

export default webSocketsService;
