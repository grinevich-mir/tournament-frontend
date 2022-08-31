<template>
  <div class="waiting-room" :class="{ 'chat-active': waitroomChatActive }" :style="{ backgroundImage: `url(${waitingRoomBackground}` }">
    <div v-if="ended && !started" class="game-area-timer">
      <img v-if="waitingRoomLogo" :src="waitingRoomLogo" alt="game-logo">
      <h1>Welcome to {{gameData.name}}</h1>
      <h1>Sit tight!</h1>
      <p>We're busy preparing your brand new shiny tournament.<br>We want everything to be perfect for you.</p>
      <p class="label">Your Tournament starts in</p>
      <div class="time-left">{{ timeLeft | toMinutes }}</div>
      <p>Good luck and don't forget to boast about your high scores in the chat room!</p>
    </div>
    <div v-else-if="gameData !== null" class="game-timeleft-loader">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <img svg-inline class="waitroom-close" src="@/assets/close.svg" alt="close-icon" @click="$router.push({ name: 'Lobby' })" />
    <transition name="fade">
      <div v-if="gameData !== null" class="waitroom-game-details">
        <div class="waitroom-playercount">
          <div class="waitroom-playercount__icon">
            <img svg-inline class="icon" src="@/assets/players.svg" alt="players" />
          </div>
          <div class="waitroom-playercount__text">{{ gameData.playerCount }}</div>
        </div>
        <div class="waitroom-badges">
          <!-- <Badge v-if="vipGame" text="Member" variant="vip"/> -->
          <!-- <Badge :text="badgeTextVariant" :variant="badgeColorVariant"/> -->
          <Badge :text="formatMoney(gameData.prizeTotal, gameData.currencyCode)" variant="emerald"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import Badge from '@/components/global/Badge.vue';

export default {
  name: 'WaitingRoom',
  props: ['gameData', 'started', 'ended', 'preStartTime', 'readyToJoin'],
  components: {
    Badge,
  },
  data() {
    return {
      timeLeft: 0,
      waitroomChatActive: false,
      polling: null,
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    waitingRoomBackground() {
      if (this.gameData && this.gameData.metadata) {
        if (this.isMobile) {
          if (this.gameData.metadata.waitingRoomMobileBackgroundUrl) {
            return this.gameData.metadata.waitingRoomMobileBackgroundUrl;
          }
          // return DEFAULT_WAITING_BG_MOBILE;
        }
        if (this.gameData.metadata.waitingRoomDesktopBackgroundUrl) {
          return this.gameData.metadata.waitingRoomDesktopBackgroundUrl;
        }
        // return DEFAULT_WAITING_BG_DESKTOP;
      }
      return null;
    },
    waitingRoomLogo() {
      if (this.gameData && this.gameData.metadata && this.gameData.metadata.waitingRoomLogoUrl) {
        return this.gameData.metadata.waitingRoomLogoUrl;
      }
      // return DEFAULT_WAITING_GAME_LOGO;
      return null;
    },
  },
  created() {
    this.updatetimeLeft();
    this.polling = setInterval(() => {
      this.updatetimeLeft();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    // method to update time until the game starts
    updatetimeLeft() {
      if (!this.gameData || this.readyToJoin) return;
      // game start time
      let targetTime;
      if (this.started && this.gameData.endTime !== undefined) {
        targetTime = this.$dayjs(this.gameData.endTime);
        // this.readyToJoin = true;
        EventBus.$emit('readyToJoin', true);
      } else {
        targetTime = this.$dayjs(this.gameData.startTime);
      }
      // current time
      const nowTime = this.$dayjs.utc();
      // time difference - games that have been played will have a negative value
      this.timeLeft = Math.max(targetTime.diff(nowTime, 'seconds'), 0);
      if (this.timeLeft < this.preStartTime && !this.readyToJoin) {
        // this.readyToJoin = true;
        EventBus.$emit('readyToJoin', true);
      }
      if (this.timeLeft > this.preStartTime && this.isMobile && !this.waitroomChatActive) {
        // this.waitroomChatActive = true;
        EventBus.$emit('waitroomChatActive', true);
      }
      if (this.started && this.timeLeft < 1 && this.gameData.endTime) {
        if (!this.ended) {
          console.log('Tournament time ended');
          // this.startPolling(Math.floor(Math.random() * 2000) + 1000);
          EventBus.$emit('startPolling', Math.floor(Math.random() * 2000) + 1000);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .waiting-room {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: .2s ease-in-out padding;
    position: relative;
    background-size: cover;
    background-position: center;
    &.chat-active {
      padding-bottom: 200px;
    }

    .game-area-timer {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      font-size: 2rem;
      margin-top: auto;
      text-align: center;
      // max-width: 500px;
      padding: 10px;

      > img {
        width: 150px;
      }

      > h1:first-of-type {
        margin: 1rem 0;
      }
      > h1:last-of-type {
        margin-bottom: 1rem;
      }

      > p {
        margin: 1rem 0;
        font-size: 18px;
        line-height: 1.5;

        &:last-of-type {
          max-width: 400px;
        }
      }

      > .time-left {
        width: 320px;
        padding: 15px;
        border-radius: 50px;
        background-color: rgba(0, 0, 0, 0.29);
      }
    }
    .waitroom-game-details,
    .game-timeleft-loader {
      margin-top: auto;
    }
    .waitroom-close {
      position: absolute;
      width: 20px;
      height: 20px;
      fill: #fff;
      left: 1rem;
      top: 1rem;
      cursor: pointer;
      transition: 0.2s ease-in-out fill;
      &:hover {
        fill: $kimberly;
      }
    }
    .waitroom-game-details {
      width: 100%;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .play-area.has-bg,
    .play-area--mobile.has-bg {
      background: linear-gradient(#101018, #1D1D30, #101018);
    }
    .waitroom-badges {
      .badge:not(:last-child) {
        margin-right: 1rem;
      }
    }
    .waitroom-playercount__icon {
      margin-right: .5rem;
      .icon {
        display: block;
      }
    }
    .waitroom-playercount {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 14px;
    }
  }
  @media (max-width: 1279px) {
    .waitroom-game-details {
      margin-bottom: .5rem !important;
    }
  }
  @media (max-width: 767px) {
    .game-area-timer {
      > img {
        width: 90px;
      }
      > h1 {
        font-size: 24px;
        &:first-of-type {
          margin: 0.5rem 0;
        }
        &:last-of-type {
          margin-bottom: 0.5rem;
        }
      }
      > p {
        font-size: 14px;
        margin: 0.5rem 0;
      }
    }
  }
  @media (max-width: 575px) {
    .game-area-timer {
      > h1 {
        font-size: 18px;
      }
      > .time-left {
        font-size: 18px;
        width: 180px;
        padding: 10px;
      }
      > p {
        font-size: 12px;
        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
  @media (max-width: 350px) {
    .game-area-timer > img {
      width: 40px;
    }
  }
</style>
