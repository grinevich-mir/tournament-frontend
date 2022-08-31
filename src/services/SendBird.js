import SendBird from 'sendbird';

const sendBird = new SendBird({
  appId: process.env.VUE_APP_SENDBIRD_APP_ID,
});
const ChannelHandler = new sendBird.ChannelHandler();

export default {

  login(username, accessToken) {
    return new Promise((resolve, reject) => sendBird.connect(username, accessToken, (user, error) => {
      if (error) reject(error);
      resolve(user);
    }));
  },

  logout() {
    return new Promise((resolve) => sendBird.disconnect(() => {
      resolve('disconnected');
    }));
  },

  getChannel(channelUrl) {
    return new Promise((resolve, reject) => sendBird.OpenChannel.getChannel(channelUrl, (channel, error) => {
      if (error) reject(error);
      channel.enter();
      resolve(channel);
    }));
  },

  exitChannel(channelUrl) {
    return new Promise((resolve, reject) => sendBird.OpenChannel.getChannel(channelUrl, (channel, error) => {
      if (error) reject(error);
      channel.exit();
      resolve(channel);
    }));
  },

  getChannelMessages(channel, messageNumber) {
    const messageListQuery = channel.createPreviousMessageListQuery();
    const messageNumberOrDefault = messageNumber || 10;

    return new Promise((resolve, reject) => messageListQuery.load(messageNumberOrDefault, false, (messageList, error) => {
      if (error) reject(error);
      resolve(messageList);
    }));
  },

  getPreviousMessages(channel, earliestMessageTimestamp, limit) {
    const messageListQuery = channel.createMessageListQuery();

    return new Promise((resolve, reject) => messageListQuery.prev(earliestMessageTimestamp, limit, false, (messageList, error) => {
      if (error) reject(error);
      resolve(messageList);
    }));
  },

  getChannelList() {
    const openChannelListQuery = sendBird.OpenChannel.createOpenChannelListQuery();

    return new Promise((resolve, reject) => openChannelListQuery.next((channels, error) => {
      if (error) reject(error);
      resolve(channels);
    }));
  },

  getChannelUsers(channel) {
    const participantListQuery = channel.createParticipantListQuery();

    return new Promise((resolve, reject) => participantListQuery.next((participantList, error) => {
      if (error) reject(error);
      resolve(participantList);
    }));
  },

  sendMessage(channel, message) {
    return new Promise((resolve, reject) => channel.sendUserMessage(message, (messageResult, error) => {
      if (error) reject(error);
      resolve(messageResult);
    }));
  },

  onMessageReceived(channel, cb) {
    ChannelHandler.onMessageReceived = (channel, message) => { // eslint-disable-line
      cb(channel, message);
    };

    sendBird.addChannelHandler(channel, ChannelHandler);
  },

  onChannelFrozen(channel, cb) {
    ChannelHandler.onChannelFrozen = (channel) => { // eslint-disable-line
      cb(channel);
    };

    sendBird.addChannelHandler(channel, ChannelHandler);
  },

  onChannelUnfrozen(channel, cb) {
    ChannelHandler.onChannelUnfrozen = (channel) => { // eslint-disable-line
      cb(channel);
    };

    sendBird.addChannelHandler(channel, ChannelHandler);
  },

  onUserEntered(channel, cb) {
    ChannelHandler.onUserEntered = (channel, user) => { // eslint-disable-line
      cb(channel, user);
    };

    sendBird.addChannelHandler(channel, ChannelHandler);
  },

  onUserExited(channel, cb) {
    ChannelHandler.onUserExited = (channel, user) => { // eslint-disable-line
      cb(channel, user);
    };

    sendBird.addChannelHandler(channel, ChannelHandler);
  },

};
