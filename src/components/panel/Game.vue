<template>
  <div class="game" @click="emitGoToGame" :class="computeClasses">
    <div class="game__thumbnail" :class="{ 'v-step-2': tournament && tournament.metadata && tournament.metadata.onboardingStep === 1 }">
      <div v-if="jackpots.length" class="thumbnail-jackpot" :class="{ 'v-step-3': tournament && tournament.metadata && tournament.metadata.onboardingStep === 1 }">
        <div class="tn-jackpot-single" v-for="(jackpot, i) in jackpots" :key="`tn-jackpot-${i}`" :class="[{ 'active': showJackpotIndex === i || jackpots.length === 1 }, jackpot.label.toLowerCase()]">
          <div class="tn-jackpot-single-inner">
            <div class="tn-jp-col tn-jp-col--left"></div>
            <div class="tn-jp-col tn-jp-col--middle">{{ jackpot.label }} Prize <strong>{{ formatMoney(jackpot.balance, 'USD', true) }}</strong></div>
            <div class="tn-jp-col tn-jp-col--right"></div>
          </div>
        </div>
        <div class="jackpot-overlay"></div>
      </div>
      <div v-if="!gameOverlay.show && !isMobile" class="play-overlay">
        <div class="btn-container">
          <img svg-inline src="@/assets/play-button.svg" alt="Play">
        </div>
      </div>
      <div v-if="gameOverlay.show" class="game__overlay">
        <div v-if="gameOverlay.showIcon" class="game__overlay-icon">
          <img v-if="!gameOverlay.isLoader" svg-inline class="icon-padlock" src="@/assets/padlock.svg" alt="padlock" />
          <div v-if="gameOverlay.isLoader" class="game__loading">
            <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
          </div>
        </div>
        <div v-html="gameOverlay.message" class="game__overlay-text"></div>
        <Badge v-if="gameOverlay.showIcon && !gameOverlay.isLoader" class="game__overlay-button" text="Unlock" variant="emerald" />
        <Badge v-if="enableUnlockBtnWhenOutOfChances && isOutOfChances && userLevel < 2" class="game__overlay-button" text="Unlock more games" variant="emerald" />
      </div>
      <Badge class="game__type" :variant="badgeColorVariant" :text="badgeTextVariant"/>
      <div v-if="!tournament.public" class="game__internal" :class="{ jackpot: jackpots.length }">
        INTERNAL
      </div>
      <div v-if="!ended && tournament.playerJoined === true && !tournament.playerCompleted" class="game__playing" :class="{ jackpot: jackpots.length }">
        <img svg-inline src="@/assets/check2.svg" class="icon"/> ENTERED
      </div>
      <img :src="tournament.bannerImgUrl" :alt="tournament.name">
      <span class="free-entries">
        <div class="game__diamond-cost" v-if="!isOutOfChances && isFreeGame && tournament.playerAllocationsRemaining" :class="{ 'v-step-5': tournament && tournament.metadata && tournament.metadata.onboardingStep === 1 }">
          <p class="game__entry-cost-amount">Free entries: <span class="green">{{tournament.playerAllocationsRemaining}}</span></p>
        </div>
        <div class="game__diamond-cost" v-else-if="!isOutOfChances && freeEntriesLeft > 0" :class="{ 'v-step-5': tournament && tournament.metadata && tournament.metadata.onboardingStep === 1 }">
          <p class="game__entry-cost-amount">Free entries: <span class="green">{{freeEntriesLeft}}</span></p>
        </div>
      </span>
    </div>
    <div class="game__timer-bar">
      <div class="game__timer-bar__progress" :style="{ width: `${timerBar}%` }" :class="{ started: started }"></div>
    </div>
    <div class="game__info-box">
      <img class="read-more" @click="showPrizeDetails" svg-inline src="@/assets/info-icon.svg" alt="INFO">
      <img class="game__logo" v-if="tournament.metadata && tournament.metadata.logo" :src="tournament.metadata.logo" :alt="tournament.name">
      <div class="game__info">
        <div class="game__text">
          <p class="game__desc" v-if="description.length">
            <span v-for="(item, index) in description" :key="index" :class="{ gold: item.gold }">{{item.string}}</span>
          </p>
        </div>
        <Button variant="rounded-blue" text="Enter Now" />
      </div>
    </div>
    <div class="game__status">
      <div class="game__live-stats">
        <div class="game__timer game__quick-stats">
          <div class="time" :class="{ 'v-step-4': tournament && tournament.metadata && tournament.metadata.onboardingStep === 1 }">
            <span>{{ started ? 'Time left' : 'Starts in' }}</span>
            <template v-if="timeLeft && timeLeft > 0">
              <span class="game__time-left green" :class="{ right: !started}">{{ timeLeft | toSingleUnitTimeShort }}</span>
            </template>
            <span v-if="!timeLeft || timeLeft <= 0" class="game__time-left placeholder">--:--</span>
          </div>
        </div>
        <div class="game__quick-stats">
          <div class="game__players-joined">
            <span class="game__player-count">Players <span class="green">{{ tournament.playerCount }}</span></span>
          </div>
        </div>
        <div class="game__quick-stats">
          <div class="game__diamond-cost" :class="{ 'v-step-5': tournament && tournament.metadata && tournament.metadata.onboardingStep === 1 }">
            <span :class="{ 'v-step-5': tournament && tournament.metadata && tournament.metadata.onboardingStep === 1 }">Entry cost: <span class="green no-margin"><img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">{{ freeEntriesLeft > 0 ? nextEntryCost : tournament.playerEntryCost || 0}}</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import Badge from '@/components/global/Badge.vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'Game',
  data() {
    return {
      timeLeft: 0,
      started: false,
      ended: false,
      entryCutOffTime: 0,
      polling: null,
      timerBar: 100,
      gameOverlay: {
        show: false,
        showIcon: false,
        isLoader: false,
        message: '',
      },
      showJackpotIndex: 0,
      jackpotIntervalPolling: null,
      howManyJackpots: 0,
      enableUnlockBtnWhenOutOfChances: false,
      enableJackpotSlider: false,
    };
  },
  props: ['tournament', 'userLevel', 'index'],
  components: {
    Badge,
    Button,
  },
  created() {
    this.updatetimeLeft();
    this.updateCutOffTime();
    this.showOverlay();
    this.updateTimerBar();
    // run specific methods in 1 second intervals
    this.polling = setInterval(() => {
      this.updatetimeLeft();
      this.updateCutOffTime();
      this.showOverlay();
      this.updateTimerBar();
    }, 1000);
    if (this.enableJackpotSlider && typeof this.tournament.jackpotTriggers !== 'undefined' && this.tournament.jackpotTriggers.length) {
      this.jackpotIntervalPolling = setInterval(() => {
        this.jackpotInterval();
      }, 6000);
    }
  },
  beforeDestroy() {
    // clear the exsisting interval
    clearInterval(this.polling);
    if (this.jackpotIntervalPolling) {
      clearInterval(this.jackpotIntervalPolling);
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    description() {
      if (!this.tournament) return null;
      const splitStrings = this.tournament.description.split(/(.*)(\[\[gold\]\].*\[\[\/gold\]\])(.*)/).filter((s) => s.length);
      const desc = [];
      splitStrings.forEach((string) => {
        if (string.includes('[[gold]]')) {
          desc.push({
            string: string.replace('[[gold]]', '').replace('[[/gold]]', ''),
            gold: true,
          });
        } else {
          desc.push({
            string,
          });
        }
      });
      return desc;
    },
    isFreeGame() {
      return this.tournament.entryCosts.length === 1 && this.tournament.entryCosts[0] === 0;
    },
    nextEntryCost() {
      return this.tournament.entryCosts.find((c) => c > 0);
    },
    totalFreeEntries() {
      return this.tournament.entryCosts.filter((e) => e === 0).length;
    },
    freeEntriesLeft() {
      return this.totalFreeEntries - this.tournament.playerAllocationsComplete;
    },
    displayShadow() {
      if (!this.tournament.metadata || this.tournament.metadata.onboardingStep !== 1 || !this.$tours.onboarding || !this.$tours.onboarding.currentStep) return false;
      return [2, 3, 4, 5].includes(this.$tours.onboarding.currentStep);
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    diamondBalance() {
      return this.$store.getters.diamondBalance;
    },
    isMembershipLocked() {
      return this.tournament.minLevel > this.userLevel;
    },
    // set the badge color based on the received prop
    badgeColorVariant() {
      if (this.tournament.metadata && this.tournament.metadata.gameType) return this.tournament.metadata.gameType.toLowerCase();
      return this.tournament.type ? this.tournament.type.toLowerCase() : '';
    },
    // set the badge text based on the received prop
    badgeTextVariant() {
      if (this.tournament.metadata && this.tournament.metadata.gameType) return this.tournament.metadata.gameType;
      return this.tournament.type === 'HiLo' ? 'Hi-Lo' : this.tournament.type;
    },
    // set the tournament/game description based on the received prop
    tournamentDescription() {
      return this.tournament.description ? this.tournament.description : this.tournament.name;
    },
    highestJackpot() {
      let highestJackpot = false;
      if (this.jackpots.length) {
        const sortedJackpots = [...this.jackpots];
        sortedJackpots.sort((a, b) => b.balance - a.balance);
        [highestJackpot] = sortedJackpots;
      }
      return highestJackpot;
    },
    jackpots() {
      const jackpots = [];
      if (typeof this.tournament.jackpotTriggers !== 'undefined' && this.tournament.jackpotTriggers.length) {
        this.tournament.jackpotTriggers.forEach((jackpotTrigger) => {
          if (jackpotTrigger.enabled) {
            const lookForJackpot = this.$store.getters.getJackpotById(jackpotTrigger.jackpotId);
            if (lookForJackpot) {
              jackpots.push(lookForJackpot);
            }
          }
        });
      }
      return jackpots;
    },
    isOutOfChances() {
      return this.tournament.playerCompleted && this.tournament.playerJoined === true && ((this.timeLeft > 0 && this.started) || this.timeLeft <= 0);
    },
    hasCost() {
      return this.tournament.playerEntryCost && (!this.tournament.playerJoined || this.tournament.playerAllocations === this.tournament.playerAllocationsComplete);
    },
    isOver30Days() {
      return this.$dayjs(this.tournament.endTime).diff(this.$dayjs(), 'days') > 30;
    },
    computeClasses() {
      let classes = '';
      if (this.tournament.metadata && this.tournament.metadata.onboardingStep) classes += `v-step-${this.tournament.metadata.onboardingStep}`;
      if (this.displayShadow) classes += ' has-shadow';
      return classes;
    },
    endDate() {
      if (!this.tournament || !this.tournament.endTime) return null;
      const tz = this.$dayjs.tz.guess();
      if (tz) {
        return this.$dayjs(this.tournament.endTime)
          .subtract(5, 'hour')
          .tz(tz)
          .startOf('day')
          .format('MMM Do, YYYY');
      }
      return this.$dayjs(this.tournament.endTime).startOf('day').format('MMM Do, YYYY');
    },
  },
  methods: {
    // method to update time until the game starts
    updatetimeLeft() {
      // game start time
      let targetTime;
      this.started = this.$dayjs(this.tournament.startTime).isSameOrBefore();

      if (this.started && this.tournament.endTime && (this.tournament.allowJoinAfterStart === true || this.tournament.playerJoined === true)) {
        targetTime = this.$dayjs(this.tournament.endTime);
      } else {
        targetTime = this.$dayjs(this.tournament.startTime);
      }
      // current time
      const nowTime = this.$dayjs.utc();
      // time difference - games that have been played will have a negative value
      this.timeLeft = targetTime.diff(nowTime, 'seconds');
      this.ended = this.ended && this.timeLeft < 1;
    },
    // update cut off time
    updateCutOffTime() {
      // game cut off  time
      const gameCutOffTime = this.$dayjs(this.tournament.entryCutOffTime);
      // current time
      const nowTime = this.$dayjs.utc();
      // time difference
      this.entryCutOffTime = gameCutOffTime.diff(nowTime, 'seconds');
    },
    // Show an overlay over the brand thumbnail image.
    // Check if the game requires VIP acces and if the user is a VIP member
    // The api calls for new tournaments every 10 seconds, therefore game start time is not always in sync with the call
    // When the tournament timer reaches zero an overlay is added to show that the next game (replacement) will be loaded soon
    // Third condition - an overlay with a countdown will be show when there's 60 seconds left to start and there is at least 1 player
    // Forth condition - and overlay with a counntdown will be show if there are 0 players and the game starts in 10 seconds
    showOverlay() {
      this.gameOverlay.show = false;
      this.gameOverlay.message = '';
      this.gameOverlay.showIcon = false;
      this.gameOverlay.isLoader = false;

      if (this.tournament.minLevel > this.userLevel) {
        this.gameOverlay.show = true;
        this.gameOverlay.showIcon = true;
        this.gameOverlay.message = '';
        return;
      }

      if (this.timeLeft > 0 && this.entryCutOffTime <= 0 && !this.tournament.playerJoined) {
        this.gameOverlay.show = true;
        this.gameOverlay.message = `Next game starts in ${this.$options.filters.toMinutes(this.timeLeft)}<br><span class="second-line">Please wait to join</span>`;
        return;
      }

      if (((this.timeLeft > 0 && this.started) || this.timeLeft <= 0) && this.tournament.playerJoined === true && this.tournament.playerCompleted) {
        this.gameOverlay.show = true;
        this.gameOverlay.message = 'No more chances left';
        return;
      }

      if (this.timeLeft <= 0 && !this.tournament.playerJoined) {
        this.gameOverlay.show = true;
        this.gameOverlay.showIcon = true;
        this.gameOverlay.isLoader = true;
        this.gameOverlay.message = 'Waiting for the next game to start';
      }
    },
    // update timer bar to show progress
    updateTimerBar() {
      let maxTime = 300; // 5 minutes is 100%
      if (this.started) {
        maxTime = this.tournament.durationMins * 60; //
      }
      const percentageOfMaxTime = this.timeLeft / maxTime;
      if (this.timeLeft > maxTime) {
        this.timerBar = 100;
      } else if (this.timeLeft >= 0) {
        this.timerBar = percentageOfMaxTime * 100;
      } else {
        this.timerBar = 0;
      }
    },
    jackpotInterval() {
      if (this.jackpots.length && this.showJackpotIndex >= this.jackpots.length - 1) {
        this.showJackpotIndex = 0;
      } else if (this.jackpots.length) {
        this.showJackpotIndex += 1;
      }
    },
    emitGoToGame() {
      EventBus.$emit('goToGame', this.tournament);
    },
    showPrizeDetails(event) {
      event.cancelBubble = true;
      if (event.stopPropagation) event.stopPropagation();
      EventBus.$emit('showPrizeDetails', this.tournament.id, this.tournament.name);
    },
  },
};
</script>

<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap');
  .game {
    cursor: pointer;
    border-radius: 12.5px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &.has-shadow {
      box-shadow: 0 0 0 99999px rgba(0,0,0,0.6) !important;
      pointer-events: auto;
      z-index: 9999;
    }
  }
  .game__thumbnail {
    height: 180px;
    position: relative;
    &.v-step-2.v-tour__target--highlighted {
      .thumbnail-jackpot {
        .tn-jackpot-single {
          z-index: -1;
        }
        .jackpot-overlay {
          opacity: 1;
        }
      }
    }
    & .ticket-corner {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 69px;
      height: 77px;
      object-fit: contain;
      opacity: 0.85;
    }
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      display: block;
    }
    .badge {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 1;
      // text-transform: uppercase;
    }
    &:hover {
      & .play-overlay {
        opacity: 1;

        & .btn-container {
          opacity: 1;
        }
      }
    }

    & .play-overlay {
      display: flex;
      opacity: 0;
      transition: .2s opacity cubic-bezier(0.42, 0, 0.36, 1.26);
      position: absolute;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.6);

      & .btn-container {
        padding: 11px;
        padding-left: 16px;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        border: 4px solid #fff;
        opacity: 0;
        transition: .25s opacity ease-in-out;
        transition-delay: .1s;
        & svg {
          width: 28px;
          height: 33px;
          path {
            fill: #fff;
          }
        }
      }
    }

    & .free-entries {
      position: absolute;
      color: #fff;
      top: 20px;
      right: 16px;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 17px;

      & .ticket-icon {
        margin-left: 3px;
        margin-right: 5px;
        width: 18px;
        display: inline-block;
        transform: translateY(3px);
      }
    }
  }
  .game__info-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $light-navy;
    padding: 20px;
    padding-right: 34px;
    padding-left: 5px;
    flex: 1;
    border-bottom: 1px solid #4C4C64;
    position: relative;

    .game__logo {
      height: 135px;
    }
    .game__info {
      margin-left: 10px;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 6px;
      & .game__prize-type {
        font-size: 14px;
        font-weight: 400;
        line-height: 19px;
        color: rgba(255, 255, 255, 0.4);
      }
      & .game__desc {
        font-family: Roboto Condensed;
        font-size: 22px;
        font-weight: 700;
        line-height: 26px;
        margin-top: 4px;
        margin-bottom: 14px;
        color: #fff;
        text-transform: uppercase;
        & .gold {
          background: linear-gradient(115.15deg, #D7AF58 3.55%, #FFDE95 98.01%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      & .button {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0;
        padding: 13px auto;
        flex: 1;
        text-transform: capitalize;
        position: relative;
        max-height: 48px;

        & .text {
          padding-right: 30px;
        }

        &.button--outlined-white {
          box-shadow: inset 0px 0px 0px 1px #fff;
          margin-right: 15px;
        }
      }
    }
    .game__entry-cost {
      text-align: left;
      font-weight: bold;

      .game__entry-cost-label {
        font-size: 14px;
        color: #fff;
        margin-bottom: 2px;
      }
      .game__entry-cost-amount {
        font-size: 20px;
        color: #fff;
      }
    }
  }
  .game__timer-bar {
    background-color: #0B0B11;
    & .game__timer-bar__progress {
      background: $blue-gradient-horizontal;
      height: 5px;

      &.started {
        // background: $orange-gradient-horizontal;
        background: linear-gradient(270deg, #FF0000 0%, #F10031 13.18%, #E10069 28.38%, #D80089 75%, #CB00B7 100%);
      }
    }
  }
  .game__live-stats {
    background-color: $light-navy;
    padding: 12px 20px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  // .time {
  //   min-width: 127px;
  // }
  .game__quick-stats {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 400;

    & span.green {
      // color: $emerald;
      color: #7CFF84;
      margin-left: 4px;
      font-weight: 600;
      &.no-margin {
        margin-left: 0;
      }
      & .ticket-icon {
        margin-right: 0px;
        height: 11px;
        transform: translateY(1px);
        path {
          fill: #7CFF84;
        }
      }
    }

    & .status {
      margin-right: 10px;
    }
  }
  .game__time-left {
    &.placeholder {
      margin-left: 6px;
    }
  }
  .game__overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .game__overlay-text {
    color: #fff;
    font-size: 12px;
    font-weight: 400;
    z-index: 1;
    text-align: center;
    line-height: 1.5;
  }
  .game__overlay-button {
    margin-top: 0.8rem;
    pointer-events: none;
    padding: 0.4rem 1.5rem;
    border: 2px solid rgba(255, 255, 255, 0.35);
  }
  /deep/ .second-line {
    color: $emerald;
  }
  /deep/ .big-message {
    font-size: 20px;
    font-weight: 700;
  }
  .game__overlay-icon {
    z-index: 1;
    margin-bottom: .5rem;
  }
  .icon-padlock {
    width: 25px;
  }
  .game__internal {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: .35rem 1rem;
    font-size: 11px;
    font-weight: 600;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 0 6px 0 0;
    &.jackpot {
      bottom: 25px;
    }
  }
  .read-more {
    position: absolute;
    top: 10px;
    right: 14px;
    opacity: 0.3;
    &:hover {
      opacity: 0.5;
    }
  }
  .game__playing {
    display: flex;
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 3px 7px;
    padding-top: 6px;
    font-size: 11px;
    font-weight: 600;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 5px 0 0 0;
    &.jackpot {
      bottom: 25px;
    }

    .icon {
      width: 11px;
      height: 11px;
      fill: $emerald;
      stroke: $emerald;
      margin-right: 5px;
    }
  }
  .game__joined {
    position: absolute;
    right: 1rem;
    top: 1rem;
    padding: .35rem 1rem;
    font-size: 15px;
    font-weight: 600;
    background-color: $emerald;
    color: #fff;
    border-radius: 2px;
  }
  .thumbnail-jackpot {
    z-index: 2;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    .jackpot-overlay {
      opacity: 0;
      background-color: rgba(0,0,0,0.6);
      border-top: 1px solid rgba(0,0,0,0.6);
      border-bottom: 1px solid rgba(0,0,0,0.6);
      width: 100%;
      height: 100%;
      z-index: 10;
    }
  }
  .thumbnail-jackpot + .game__overlay {
    padding-bottom: 20px;
  }
  .tn-jackpot-single {
    max-height: 0px;
    opacity: 0;
    transition: 0.4s all ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.75);
    border-top: 1px solid #2e6eff;
    border-bottom: 1px solid #2e6eff;
    padding: 6px;
    text-align: center;
    color: #fff;

    position: absolute;
    left: 0;
    right: 0;
    top: 20px;
    bottom: 0;

    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;

    &.mega {
      background: linear-gradient(0deg, #C6A156 0%, #FFD978 100%, #FFD978 100%, #FFD978 100%);
      border: none;
      color: #000;
    }
    &.maxi {
      background: $silver-gradient-diagonal-double;
      border-color: #A9A9A9;
      color: #000;
    }
    &.mini {
      background: $orange-gradient-diagonal-double;
      border-color: #9b623c;
      color: #000;
    }
  }
  .tn-jackpot-single.active {
    max-height: 100px;
    opacity: 1;
    top: 0;
  }
  .thumbnail-jackpot {
    height: 25px;
  }
  @media (max-width: 392px) {
    .game__info-box .game__logo {
      margin-top: -25px !important;
      max-height: 100px !important;
    }
  }
  @media (max-width: 350px) {
    .game__info-box {
      position: relative;
      .game__logo {
        z-index: 10;
        margin-top: 0 !important;
        max-height: 50px !important;
        position: absolute;
        right: 0;
        top: -17px;
      }
    }
    .read-more {
      top: 32px;
    }
    .game__live-stats {
      padding: 10px;
    }
  }
</style>
