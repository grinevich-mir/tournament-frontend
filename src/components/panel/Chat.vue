<template>
    <div class="chat" @scroll="onFeedScroll">
      <div class="chat__feed-wrapper" @scroll="onFeedScroll">
        <transition name="fade">
          <div class="chat__feed" v-if="messageList.length > 0 || chatClosed || gameOver || chatUser !== null">
            <div v-if="messageList.length === 0" class="entry">
              <span class="entry__usr" style="color: #fff;">Joined</span> <span class="joined">{{ chatUser.nickname }}</span>
            </div>
            <div v-for="message in messageList" class="entry" :key="message.messageId">
              <span class="entry__usr" :class="`user-${message._sender.userId}`">
                <SupportIcon v-if="isSupportUser(message._sender.nickname)" />
                <Flag v-else-if="message._sender.metaData && message._sender.metaData.country" :country="message._sender.metaData.country" size="sm" round />
                {{ message._sender.nickname }}
              </span> {{ message.message }}
            </div>
            <div v-if="chatClosed" class="entry">
              <span class="entry__usr" style="color: #fff;">MESSAGE</span> <span class="joined">Chat is now closed.</span>
            </div>
          </div>
        </transition>
      </div>
      <div class="chat__input-wrapper">
        <transition name="fade">
          <div v-if="newMessages > 0 && !chatIsActive && !chatClosed && !gameOver" class="new-messages" @click="updateScrollPosition()">
            {{newMessages}} NEW
          </div>
        </transition>
        <form @submit.prevent="sendMessage" class="chat__input" :class="{ disabled: chatClosed || gameOver }">
          <div class="input-box">
            <textarea ref="input" wrap="soft" @keydown="submitMessage($event)" @input="resizeTextarea($event)" @focus="onFocus" @blur="onBlur" :placeholder="placeholder" rows="1" class="chat-textarea" id="msg-box" name="chat-msg" v-model="myMessage"></textarea> <!-- eslint-disable-line -->
          </div>
          <button type="submit" class="post-msg" :class="{ active: chatIsFocused }">
            <img v-if="chatClosed" svg-inline class="send-icon" src="@/assets/chat.svg" alt="chat"/>
            <img v-else svg-inline class="send-icon" src="@/assets/send.svg" alt="send message"/>
          </button>
        </form>
      </div>
    </div>
</template>

<script>
import SendBird from '@/services/SendBird';
import Flag from '@/components/global/Flag.vue';
import SupportIcon from '@/components/global/SupportIcon.vue';
import EventBus from '@/helpers/event-bus';

export default {
  name: 'Chat',
  props: ['channel', 'isMobileSmall', 'isMobile', 'gameOver', 'chatIsActive'],
  components: {
    Flag,
    SupportIcon,
  },
  data() {
    return {
      placeholder: 'Send a message',
      chatUser: null,
      channelData: null,
      messageList: [],
      chatUsers: [],
      myMessage: '',
      textAreaHeight: '34px',
      textAreaMaxHeight: '122px',
      textAreaHeightMobile: '29px',
      textAreaMaxHeightMobile: '50px',
      colorIndex: 0,
      chatClosed: false,
      chatIsFocused: false,
      scrolledToBottom: true,
      newMessages: 0,
    };
  },
  computed: {
    userChatToken() {
      return this.$store.state.auth.userData.chatToken;
    },
    userID() {
      return this.$store.state.auth.userData.id.toString();
    },
    messageListCount() {
      return this.messageList.length;
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
  },
  methods: {
    // apply colors to usernames
    applyColors() {
      const colors = [
        '#ED49C3',
        '#0D7EE8',
        '#FF682E',
      ];
      if (this.messageList.length > 0) {
        this.messageList.forEach((message) => {
          // TODO: message._sender.connectionStatus
          const { userId } = message._sender; // eslint-disable-line
          if (this.chatUsers.indexOf(userId) !== -1) return;
          if (this.colorIndex > 2) {
            this.colorIndex = 0;
          }
          const styleTag = document.querySelector('.chat__feed-wrapper style');
          styleTag.innerHTML += `.user-${userId} { color: ${colors[this.colorIndex]}; }`;
          this.chatUsers.push(userId);
          this.colorIndex += 1;
        });
      }
    },
    // resize textarea based on user input
    resizeTextarea(e) {
      const textArea = e.target || e;
      if (this.isMobileSmall) {
        this.textAreaHeight = this.textAreaHeightMobile;
        this.textAreaMaxHeight = this.textAreaMaxHeightMobile;
      }
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
      textArea.style.maxHeight = this.textAreaMaxHeight;
    },
    sendMessage() {
      if (this.chatClosed) {
        return;
      }
      if (this.$store.state.vip.vipActive && this.$store.state.vip.showVip && this.$store.state.vip.onlyVipCanChat && this.userLevel <= 1) {
        document.body.classList.add('vip-modal-opened');
        return;
      }
      if (this.isMobileSmall) {
        this.textAreaHeight = this.textAreaHeightMobile;
      }
      const textArea = this.$el.querySelector('textarea');
      textArea.style.maxHeight = this.textAreaHeight;
      textArea.style.height = this.textAreaHeight;
      const sendmessage = this.myMessage.trim(); // trim message of all whitespace
      this.myMessage = '';
      if (sendmessage) {
        SendBird.sendMessage(this.channelData, sendmessage)
          .then((message) => {
            this.messageList.push(message);
            this.updateScrollPosition();
          })
          .catch((error) => {
            if (error) this.chatClosed = true;
            textArea.blur();
            this.resizeTextarea(textArea);
            this.updateScrollPosition();
          });
      }

      this.$refs.input.focus();
    },
    // update scroll position to automatically scroll to bottom when new messsages are added
    updateScrollPosition() {
      this.newMessages = 0;
      setTimeout(() => {
        const chatBox = this.$el.querySelector('.chat__feed');
        const chatWrapper = this.$el;
        if (this.isMobile) {
          const chatFeedWrapper = this.$el.querySelector('.chat__feed-wrapper');
          chatFeedWrapper.scrollTop = chatBox.clientHeight;
        }
        chatWrapper.scrollTop = chatBox.clientHeight;
      }, 100);
    },
    // submit message on 'enter' press (without shift)
    submitMessage(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        const newMessage = this.myMessage.trim();
        const textArea = this.$el.querySelector('textarea');
        if (newMessage) {
          if (this.isMobileSmall) {
            this.textAreaHeight = this.textAreaHeightMobile;
          }
          this.$el.querySelector('.post-msg').click();
          textArea.style.maxHeight = this.textAreaHeight;
          textArea.style.height = this.textAreaHeight;
        }
      }
    },
    // set the textarea to default height on blur
    defaultTextArea() {
      if (this.myMessage) return;
      this.placeholder = 'Send a message';
      const textArea = this.$el.querySelector('textarea');
      if (this.isMobileSmall) {
        this.textAreaHeight = this.textAreaHeightMobile;
      }
      textArea.style.height = this.textAreaHeight;
    },
    onFocus() {
      this.chatIsFocused = true;
      this.placeholder = '';
      this.updateScrollPosition();
      setTimeout(() => {
        if (this.chatIsFocused) {
          this.$emit('focus');
        }
      }, 10);
    },
    onBlur() {
      this.chatIsFocused = false;
      this.defaultTextArea();
      setTimeout(() => {
        if (!this.chatIsFocused) {
          this.$emit('blur');
        }
      }, 10);
    },
    onFeedScroll(event) {
      this.scrolledToBottom = event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 15;

      if (this.scrolledToBottom) {
        this.newMessages = 0;
      }
    },
    focusInput() {
      if (!this.$refs.input) return;
      this.$nextTick(() => this.$refs.input.focus());
    },
    isSupportUser(displayName) {
      return displayName.match(/^Support_.*$/);
    },
  },
  watch: {
    messageListCount(val, oldVal) {
      if (val !== oldVal) {
        this.applyColors();

        if (this.scrolledToBottom) {
          this.newMessages = 0;
          return this.updateScrollPosition();
        }
        this.newMessages += val - oldVal;
      }
      return '';
    },
    chatIsActive: {
      immediate: true,
      handler(val) {
        if (!this.$refs.input) {
          return;
        }

        if (!val) {
          this.$refs.input.blur();
        }
      },
    },
    chatClosed(val) {
      if (val) {
        this.updateScrollPosition();
      }
    },
    gameOver(val) {
      if (val) {
        this.updateScrollPosition();
      }
    },
  },
  mounted() {
    // create a style tag to contain user colors styles
    const chatWrapper = document.querySelector('.chat__feed-wrapper');
    const style = document.createElement('style');
    style.innerHTML = '';
    chatWrapper.prepend(style);
  },
  async created() {
    try {
      if (!this.userChatToken) {
        await this.$store.dispatch('loadUserData');
      }

      this.chatUser = await SendBird.login(this.userID, this.userChatToken);
      this.channelData = await SendBird.getChannel(this.channel);
      this.messageList = await SendBird.getChannelMessages(this.channelData, 20);
      SendBird.onMessageReceived(this.channelData, (channel, message) => this.messageList.push(message));
      SendBird.onChannelFrozen(this.channelData, () => { this.chatClosed = true; });
      SendBird.onChannelUnfrozen(this.channelData, () => { this.chatClosed = false; });
    } catch (err) {
      console.error('Something gone wrong with connection: ', err, err.code);
    }
    EventBus.$on('focusInput', this.focusInput);
  },
  // TODO: beforeDestroy handle SendBird
  beforeDestroy() {
    EventBus.$off('focusInput');
  },
};
</script>

<style scoped lang="scss">
  .chat {
    background-color: $navy;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .entry {
    padding: .5rem 1rem;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    color: #fff;
    overflow: hidden;
    &:nth-child(odd) {
      background-color: $light-navy;
    }
    & .support-icon {
      margin-top: -2px;
    }
  }
  .entry__usr {
    font-weight: 700;
    margin-right: .5rem;
  }
  .chat__input-wrapper {
    margin-top: auto;
    display: flex;
    position: sticky;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .chat__input {
    display: flex;
    align-items: center;
    padding: 2rem 1rem;
    width: 100%;
    background-color: $navy;
    &.disabled {
      .input-box,
      .post-msg {
        opacity: .25;
        pointer-events: none;
      }
    }
  }
  .new-messages {
    position: absolute;
    cursor: pointer;
    left: 50%;
    transform: translateX(-50%);
    bottom: 98px;
    text-align: center;
    align-self: center;
    color: #fff;
    background-color: $orange;
    padding: .4rem .8rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: .8rem;
    z-index: 2;
  }
  .joined {
    color: $emerald;
  }
  .chevron-icon,
  .send-icon {
    width: 25px;
    display: block;
    fill: $kimberly;
    transition: 0.2s ease-in-out fill;
    outline: none !important;
  }
  .input-box {
    flex: 1;
  }
  .post-msg {
    margin-left: 1rem;
    cursor: pointer;
    &:hover {
      .send-icon {
        fill: $blue;
      }
    }
  }
  .chat-textarea {
    background-color: $light-navy;
    color: $kimberly;
    padding: .5rem 1rem;
    border-radius: 20px;
    resize: none;
    display: block;
    width: 100%;
    max-height: 122px;
    font-weight: 600;
    transition: 0.2s ease-in-out box-shadow;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px $blue;
    }
    &::placeholder {
      color: #fff;
      font-weight: 500;
    }
  }
  .chat::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 1280px) {
    .chat {
      overflow-y: scroll;
    }
  }
  @media (max-width: 1279px) {
    .chat__input-wrapper {
      margin-top: 0;
      order: 2;
    }
    .chat__input {
      padding: 0 1rem;
      order: 2;
      bottom: unset;
      top: 0;
      margin-top: 0;
      max-height: 0;
      opacity: 0;
      visibility: collapse;
      background-color: transparent;
      &.disabled {
        max-height: 0 !important;
        opacity: 0 !important;
        visibility: collapse !important;
        padding: 0 !important;
        overflow: hidden;
      }
      .chat-textarea {
        border-radius: 10px;
        padding: 0.5rem 0.5rem;
        &:focus {
          outline: none;
          box-shadow: none;
        }
      }
    }
    .new-messages {
      bottom: 4px;
      font-size: .65rem;
    }
    .entry {
      padding: .1rem 0.5rem;
    }
    .chat {
      flex: none;
      background-color: rgba(29, 29, 48, 0.6);
      overflow: hidden;
    }
    .chat__feed-wrapper {
      order: 1;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
    }
    .send-icon {
      fill: #fff;
    }
    .post-msg {
      margin-left: .5rem;
      // max-width: 0;
      // visibility: collapse;
      // opacity: 0;
      transition: 0.2s ease-in-out all;
      &.active {
        visibility: visible;
        opacity: 1;
        max-width: 1000px;
        position: relative;
      }
    }
    .entry:nth-child(odd) {
      background-color: transparent;
    }
  }
  @media (max-width: 767px) {
    .input-box {
      font-size: 12px;
    }
    .chevron-icon,
    .send-icon {
      width: 20px;
    }
  }
</style>
