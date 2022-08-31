<template>
  <div class="control-strip">
    <div class="controls controls--exit" @click="$router.push({ name: 'Lobby' })">
      <img svg-inline class="close" src="@/assets/exit-game2.svg" alt="close-icon" />
    </div>
    <div class="controls controls--name" v-if="tournament && !text && !ending">
        {{ tournament.name }} (ID: {{ tournament.id }})
    </div>
    <div class="controls controls--info marquee" v-if="text && !ending">
        <div class="fade-bg"></div>
        <p>{{ text }}</p>
    </div>
    <div class="controls controls--name alert" v-if="ending">
        <p v-if="timeLeft > 0">{{ timeLeft | toMinutes }}</p>
        <p v-if="timeLeft === 0">Tournament Finished</p>
    </div>
    <div class="controls controls--sound" @click="handleSoundControl">
      <template v-if="showSoundControl">
      <img v-if="soundEnabled" svg-inline class="sound" src="@/assets/sound2.svg" alt="sound-icon" />
      <img v-else svg-inline class="sound" src="@/assets/sound2-off.svg" alt="sound-icon" />
      </template>
    </div>
    <div class="control-strip__timer-bar" v-if="timeLeft >= 0">
      <div class="control-strip__timer-bar__progress" :style="{ width: `${timerBar}%` }" v-bind:class="{ started: started }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlStrip',
  props: {
    soundEnabled: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
    showSoundControl: {
      type: Boolean,
      default: false,
    },
    tournament: {
      type: Object,
      default: undefined,
    },
  },
  components: {
    //
  },
  data() {
    return {
      started: false,
      timeLeft: 1,
      polling: null,
      ending: false,
    };
  },
  computed: {
    //
  },
  methods: {
    handleSoundControl() {
      this.$emit('soundControl');
    },
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
      this.timeLeft = Math.max(targetTime.diff(nowTime, 'seconds'), 0);
      this.ending = this.started && this.tournament.endTime && this.timeLeft <= 120;
    },
    updateTimerBar() {
      const maxTime = 300; // 5 minutes is 100%
      const percentageOfMaxTime = this.timeLeft / maxTime;
      if (this.timeLeft > maxTime) {
        this.timerBar = 100;
      } else if (this.timeLeft >= 0) {
        this.timerBar = percentageOfMaxTime * 100;
      } else {
        this.timerBar = 0;
      }
    },
  },
  mounted() {
    //
  },
  created() {
    this.updatetimeLeft();
    this.updateTimerBar();
    // run specific methods in 1 second intervals
    this.polling = setInterval(() => {
      this.updatetimeLeft();
      this.updateTimerBar();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  destroyed() {
    //
  },
};
</script>

<style scoped lang="scss">
  @keyframes timer-alert {
    0% {
      color: white;
    }
    100% {
      color: red;
    }
  }
  .controls svg {
    width: 18px;
  }
  .control-strip {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 12px;
    background-color: #1A1A2A;
    justify-content: space-between;
  }
  .controls--exit, .controls--sound {
    flex: none;
    width: 2.9rem;
    padding-top: 0.1rem;
    justify-content: center;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .controls--info {
    white-space: pre;
    overflow: hidden;
    position: relative;
    flex: 1;
    padding-left: 1px;
    padding-right: 1px;
  }
  .controls--name {
    flex: 1;
    text-align: center;
    font-weight: 800;

    &.alert {
      animation: timer-alert 2s linear infinite;
      animation-direction: alternate-reverse;
    }
  }
  .fade-bg {
    position: absolute;
    left: -1px;
    right: -2px;
    top: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(26,26,42,1) 0%, rgba(26,26,42,0) 20%, rgba(26,26,42,0) 80%, rgba(26,26,42,1) 100%);
    z-index: 2;
  }
  .control-strip--desktop {
    position: absolute;
    z-index: 9;
    top: .5rem;
    left: .5rem;
    right: .5rem;
    background-color: #0f0f18 !important;
    .controls svg {
      width: 24px;
    }
    .controls--exit, .controls--sound {
      padding-top: .4rem;
      width: 3.2rem;
    }
    .fade-bg {
      background: linear-gradient(90deg, rgba(15,15,24,1) 0%, rgba(15,15,24,0) 20%, rgba(15,15,24,0) 80%, rgba(15,15,24,1) 100%);
    }
    .controls--name {
      font-size: 1rem;
    }
  }
  .control-strip--mobile {
    height: 27px;
    overflow-y: hidden;
  }
  .marquee p {
    display: inline-block;
    padding-left: 100%;
    /* show the marquee just outside the paragraph */
    will-change: transform;
    animation: marquee 15s linear infinite;
  }
  .marquee p:hover {
    animation-play-state: paused
  }
  .control-strip__timer-bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
  .control-strip__timer-bar__progress {
    background: $blue-gradient-horizontal;
    height: 1px;

    &.started {
      background: $orange-gradient-horizontal;
    }
  }
  @keyframes marquee {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-100%, 0); }
  }
  /* Respect user preferences about animations */
  @media (prefers-reduced-motion: reduce) {
    .marquee {
      white-space: normal;
    }
    .marquee p {
      animation-iteration-count: 1;
      animation-duration: 0.01;
      /* instead of animation: none, so an animationend event is
       * still available, if previously attached.
       */
      padding-left: 0;
    }
  }
  @media (min-width: 1280px) {
    .control-strip--mobile {
      display: none !important;
    }
  }
  @media (max-width: 1439px) {

  }
  @media (max-width: 1279px) {
    .control-strip--desktop {
      display: none !important;
    }
  }
  @media (max-width: 767px) {

  }
</style>
