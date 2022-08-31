<template>
  <div class="game-area" :class="{ 'no-ratio': noMobileRatio, 'no-ratio-desktop': noDesktopRatio }">
    <template v-if="!showNewDesktopControls">
      <!-- temporary disabled for  mobile -->
      <div class="show-info" v-if="!isMobile && (rules || userProgress)" @click="showRules = !showRules">
        <img v-if="!showRules" svg-inline class="show-info__icon" src="@/assets/info.svg" alt="info-icon" />
        <img v-else svg-inline class="show-info__icon" src="@/assets/close.svg" alt="info-icon" />
      </div>
      <div v-if="!isMobile" class="go-full-screen" @click="goFullScreen">
        <img v-if="!isFullScreen" svg-inline class="full-screen" src="@/assets/full-screen.svg" alt="resize screen" />
        <img v-else svg-inline class="full-screen" src="@/assets/shrink-screen.svg" alt="resize screen" />
      </div>
    </template>
    <transition name="fade">
      <div v-if="showRules && !isMobile" class="game-rules" @click="showRules = !showRules">
        <div class="rules-milestones">
          <div v-if="rules" class="rm-col rm-col--rules">
            <p class="rm-col__title">Game rules</p>
            <div v-html="rules"></div>
          </div>
          <!-- <div v-if="userProgress" class="rm-col rm-col--milestones">
            <p class="rm-col__title">Milestones</p>
            <div class="milestones-list">
              <div class="milestones" v-for="progress in userProgress" :key="progress.event">
                <p class="milestones--label">{{ progress.event.match(/[A-Z][a-z]+/g).join(' ') }}</p>
                <div class="milestone" v-for="milestone in progress.milestones" :key="milestone.description" :class="{ complete: progress.count >= milestone.target }">
                  <div class="milestone__label">{{ milestone.description}}</div>
                  <div class="milestone__progress">
                    <div class="milestone__progress-bar" :style="{ width: Math.min((progress.count * 100) / milestone.target, 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </transition>
    <div id="game-frame" class="game" :class="{ 'no-ratio': noMobileRatio, 'no-ratio-desktop': noDesktopRatio }">
      <!-- <div v-if="isMobile && rules" @touchstart="preventNativeGesture($event)" v-touch:swipe="rulesMobile" class="swipe swipe--rules"></div> -->
      <!-- <div v-if="isMobile && userProgress" @touchstart="preventNativeGesture($event)" v-touch:swipe="milestonesMobile" class="swipe swipe--milestones"></div> -->
      <iframe id="iframe" v-if="location" :src="canLoadGame ? location : 'about:blank'" ref="iframe"></iframe>
      <!-- <transition name="slide-fade">
        <div v-if="showRulesMobile && rules" v-touch:swipe="closeRulesMobile" class="slide slide--rules">
          <div class="rm-col rm-col--rules">
            <p class="rm-col__title">Game rules</p>
            <div v-html="rules"></div>
          </div>
        </div>
      </transition>
      <transition name="slide-fade-alt">
        <div v-if="showMilestonesMobile && userProgress" v-touch:swipe="closeMilestonesMobile" class="slide slide--milestones">
          <div class="rm-col rm-col--milestones">
            <p class="rm-col__title">Milestones</p>
            <div class="milestones-list">
              <div class="milestones" v-for="progress in userProgress" :key="progress.event">
                <p class="milestones--label">{{ progress.event.match(/[A-Z][a-z]+/g).join(' ') }}</p>
                <div class="milestone" v-for="milestone in progress.milestones" :key="milestone.description" :class="{ complete: progress.count >= milestone.target }">
                  <div class="milestone__label">{{ milestone.description}}</div>
                  <div class="milestone__progress">
                    <div class="milestone__progress-bar" :style="{ width: Math.min((progress.count * 100) / milestone.target, 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition> -->
      <template v-if="!spinning">
        <transition name="fade">
          <!-- TIME UP -->
          <div v-if="finished" class="finished-overlay">
            <Modal
              v-model="finished"
              title="Tournament Finished"
              class="modal--finished"
              mode="simple"
              :btn-action="goLobby"
              btn-text="Play Another Game"
              btn-variant="rounded-blue"
            >
              <template v-slot:body>
                <p>Time has got the better of us and this tournament has finished. Don’t worry the next one is just round the corner, make sure you join and good luck!</p>
              </template>
            </Modal>
          </div>

          <!-- GAME OVER - TRY AGAIN -->
          <template v-else-if="entryComplete">
            <div v-if="allocationsRemaining > 0 || allocationsRemaining === undefined" class="finished-overlay">
              <Modal
                :value="true"
                title="Play again?"
                class="modal--finished"
                mode="simple"
              >
                <template v-slot:body>
                    <template v-if="allocationsRemaining !== undefined && allocationsRemaining > 0">
                      <p>Well played! You have {{allocationsRemaining}} more chance{{allocationsRemaining !== 1 ? 's' : ''}} to beat your score.<br /> The higher you get the more likely you'll win the top prize!</p>
                    </template>
                    <template v-else>
                      <p>Well played! Keep going to try to beat your score, the higher you get the more likely you'll win the top prize!</p>
                    </template>
                    <img class="enter__option-image" svg-inline src="@/assets/ticket-icon.svg" alt="Tickets">
                </template>
                <template v-slot:buttons>
                  <Button variant="rounded-blue" @clicked="tryAgain">
                    <template v-slot:text>
                      <span>
                        Play again
                        <template v-if="hasEntryCost">
                          for
                          <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">
                          {{entryCost}}
                        </template>
                      </span>
                    </template>
                  </Button>
                  <router-link class="enter__click-full" :to="{ name: 'Lobby' }">Back to lobby</router-link>
                </template>
              </Modal>
            </div>

            <!-- GAME OVER - NO CHANCES LEFT -->
            <div v-else-if="allocationsRemaining === 0" class="finished-overlay">
              <Modal
                :value="true"
                title="No More Chances Left"
                class="modal--finished"
                mode="simple"
                :btn-action="goLobby"
                btn-text="Play Another Game"
                btn-variant="rounded-blue"
              >
                <template v-slot:body>
                  <p>Wow, looks like you've used all your chances! Why not stick around and chat to other members whilst waiting for the next tournament to begin. Good luck!</p>
                </template>
              </Modal>
            </div>
          </template>
        </transition>
      </template>
    </div>
  </div>
</template>

<script>
import Modal from '@/components/global/Modal.vue';
import Button from '@/components/global/Button.vue';
import EventBus from '@/helpers/event-bus';

export default {
  name: 'GameArea',
  data() {
    return {
      showRules: false,
      showRulesMobile: false,
      showMilestonesMobile: false,
      isFullScreen: false,
      noMobileRatio: false,
      noDesktopRatio: false,
      playerPositionRead: false,
      showNewDesktopControls: true,
    };
  },
  props: [
    'location',
    'isMobile',
    'isMobileSmall',
    'rules',
    'userProgress',
    'ratioMobile',
    'ratioDesktop',
    'chatActive',
    'leaderboardExists',
    'playerLoaded',
    'chatChannelExists',
    'leaderboardMode',
    'spinning',
    'finished',
    'allocations',
    'allocationsComplete',
    'allocationsRemaining',
    'entryComplete',
    'entryCost',
    'tournamentMinLevel',
    'userLevel',
    'executeGameCommand',
    'enterGame',
  ],
  components: {
    Modal,
    Button,
  },
  created() {
    EventBus.$on('tryAgain', this.tryAgain);
  },
  methods: {
    // prevent native gestures on mobile devices (go to the previous/next page)
    preventNativeGesture(event) {
      let i;
      for (i = 0; i < event.changedTouches.length; i += 1) {
        if (event.changedTouches[i].pageX > 15 && event.changedTouches[i].pageX < window.innerWidth - 15) return;
        event.preventDefault();
      }
    },
    // not too DRY but necessary
    rulesMobile() {
      this.showRulesMobile = true;
    },
    milestonesMobile() {
      this.showMilestonesMobile = true;
    },
    closeRulesMobile() {
      this.showRulesMobile = false;
    },
    closeMilestonesMobile() {
      this.showMilestonesMobile = false;
    },
    // correctly size the iframe and its wrapper
    frameSize() {
      const iframe = this.$el.querySelector('#iframe');
      const gameFrame = this.$el.querySelector('#game-frame');
      if (iframe) {
        let iframeRatio;
        const ratioDesktop = this.ratioDesktop !== undefined ? this.ratioDesktop : false;
        const ratioMobile = this.ratioMobile !== undefined ? this.ratioMobile : false;
        if (this.isMobile) {
          if (ratioMobile) {
            iframeRatio = (100 / ratioMobile).toFixed(2);
          } else {
            let adjustHeightTop;
            // get either the window's inner width or the max-width of 1024px
            const adjustInnerWidth = window.innerWidth >= 1024 ? 1024 : window.innerWidth;
            if (this.leaderboardExists === true && this.playerLoaded) {
              // take leaderboard initial height into consideration
              adjustHeightTop = 90;
            } else {
              adjustHeightTop = 0;
            }
            // adjust ratio
            const ratioFromDimensions = ((window.innerHeight - adjustHeightTop) / adjustInnerWidth) * 100;
            iframeRatio = ratioFromDimensions.toFixed(2);
            this.noMobileRatio = true;
          }
        } else if (ratioDesktop) {
          iframeRatio = (100 / ratioDesktop).toFixed(2);
        } else {
          iframeRatio = 0;
          this.noDesktopRatio = true;
        }
        // set corrent padding on the iframe wrapper - 2 decimal points is enough
        gameFrame.style = `padding-bottom: ${iframeRatio}%`;
        // add 'ready' class to the iframe to take up 100% of available space
        iframe.classList.add('ready');
      }
    },
    // go full screen
    goFullScreen() {
      this.isFullScreen = !this.isFullScreen;
      this.toggleFullScreenClasses();
    },
    // emit wentFullScreen Event to the parent to toggle appropriate classes
    toggleFullScreenClasses() {
      this.$emit('wentFullScreen');
    },
    goLobby() {
      this.$router.push({ name: 'Lobby' });
    },
    goUpgrade() {
      this.$router.push({ name: 'Upgrade' });
    },
    async tryAgain() {
      this.$emit('update:entryComplete', false);

      let needReload = null;
      if (this.enterGame) {
        needReload = await this.enterGame(true);
      }

      if (needReload && !this.executeGameCommand('TRY_AGAIN')) {
        this.reloadGame();
      }
    },
    reloadGame() {
      this.$refs.iframe.contentWindow.location = this.location;
    },
  },
  computed: {
    canLoadGame() {
      if (this.spinning) {
        return true;
      }
      if (this.finished) {
        return false;
      }
      return true;
    },
    hasEntryCost() {
      return this.entryCost && this.allocations === this.allocationsComplete;
    },
  },
  mounted() {
    // check if iframe exists and run the sizing method
    window.addEventListener('resize', this.frameSize);
    this.frameSize();
  },
  watch: {
    leaderboardExists() {
      this.frameSize();
    },
    chatChannelExists() {
      this.frameSize();
    },
    playerLoaded() {
      // watch player position and resize frame once after the player position is initially received
      if (!this.playerPositionRead) {
        this.playerPositionRead = true;
        this.frameSize();
      }
    },
  },
  beforeDestroy() {
    EventBus.$off('tryAgain');
    this.isFullScreen = false;
    if (this.isFullScreen === true) {
      this.toggleFullScreenClasses();
    }
  },
  destroyed() {
    // remove resize event listener
    window.removeEventListener('resize', this.frameSize);
  },
};
</script>

<style scoped lang="scss">
  .game-area {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .show-info {
    position: absolute;
    left: 1rem;
    top: 1rem;
    cursor: pointer;
    border-radius: 50%;
    z-index: 2;
    &:hover {
      .show-info__icon {
        fill: $kimberly;
      }
    }
  }
  .show-info__icon {
    width: 20px;
    height: 20px;
    display: block;
    fill: #fff;
    transition: 0.2s ease-in-out fill;
  }
  .game-rules {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(16, 16, 24, 0.95);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .rm-col__title {
    font-size: 20px;
    color: #fff;
    font-weight: 700;
    margin: 0;
  }
  .rules-milestones {
    display: flex;
    width: 1000px;
    max-width: 100%;
    padding: 2rem;
  }
  .rm-col {
    flex: 1;
    &:first-child {
      margin-right: 4rem;
    }
    &:last-child {
      margin-left: 4rem;
    }
    /deep/ ul {
      font-weight: 500;
      color: $emerald;
      font-size: 12px;
      line-height: 1.5;
      margin-top: 1.5rem;
      li {
        &:not(:last-child) {
          margin-bottom: 1rem;
        }
      }
    }
  }
  .rule--bad {
    color: $red;
  }
  .milestones-list {
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    margin-top: 1.5rem;
  }
  .milestones--label {
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .milestone__progress {
    background-color: $navy;
  }
  .milestone__progress-bar {
    height: 100%;
    height: 2px;
    min-width: 1px;
    transition: width 0.5s ease-in-out;
  }
  .milestones {
    .milestone__progress-bar {
      background: $orange-gradient-horizontal;
    }

    &:nth-child(even) {
      .milestone__progress-bar {
        background: $blue-gradient-horizontal;
      }
    }
  }
  .milestone {
    &.complete {
      .milestone__progress-bar {
        background: $green-gradient-horizontal;
      }
    }
  }
  .milestone__label,
  .milestone:not(:last-child) {
    margin-bottom: .5rem;
  }
  .milestones:not(:last-child) {
    margin-bottom: 1.5rem;
  }
  .go-full-screen {
    position: absolute;
    right: 1rem;
    top: 1rem;
    cursor: pointer;
    &:hover {
      .full-screen {
        fill: $kimberly;
      }
    }
  }
  .full-screen {
    width: 20px;
    height: 20px;
    fill: #fff;
    display: block;
    transition: 0.2s ease-in-out fill;
  }
  .full-width {
    .game-area {
      padding: 5rem;
    }
  }
  .game {
    width: 100%;
    height: 0;
    position: relative;
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      &.ready {
        width: 100%;
        height: 100%;
      }
    }
  }

  .modal--finished {
    & .enter__option-image {
      filter: drop-shadow(0 0 15px rgba(237, 73, 195, 0.4));
      margin: 20px 0;
    }

    & .ticket-icon {
      height: initial;
      margin-bottom: -2px;
      margin-right: -3px;
      path {
        fill: #7CFF84;
      }
    }

    & .enter__click-full {
      font-size: 12px;
      color: #fff;
      font-weight: normal;
      cursor: pointer;
      margin-top: 1rem;
      margin-bottom: 2rem;
      display: block;
      text-decoration: none;
      &:hover {
        opacity: 1;
      }
    }

    & .enter__disclaimer {
      text-align: center;
      font-size: 12px;
      font-weight: normal;
      // color: #7487AD;
    }
  }

  @media (min-width: 576px) {
    .premium-button {
      font-size: 20px;
    }
  }

  @media (min-width: 1280px) {
    .game-area {
      padding: 1rem;
      &.no-ratio-desktop {
        padding-top: 3.25rem;
      }
    }
    .game.no-ratio-desktop {
      height: 100%;
    }
  }
  @media (max-width: 1279px) {
    .game-area {
      align-items: flex-start;
    }
    .game iframe {
      display: block;
      width: 100%;
      height: 100%;
    }
    .swipe {
      position: absolute;
      top: 50%;
      width: 25px;
      height: 35vh;
      transform: translateY(-50%);
      z-index: 999;
      &.swipe--rules {
        left: 0;
      }
      &.swipe--milestones {
        right: 0;
      }
    }
    .slide-fade-enter-active {
      transition: all .5s ease;
    }
    .slide-fade-leave-active {
      transition: all .5s ease;
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
      transform: translateX(-100%);
      opacity: 0;
    }
    .slide-fade-alt-enter-active {
      transition: all .5s ease;
    }
    .slide-fade-alt-leave-active {
      transition: all .5s ease;
    }
    .slide-fade-alt-enter, .slide-fade-alt-leave-to
    /* .slide-fade-alt-leave-active below version 2.1.8 */ {
      transform: translateX(100%);
      opacity: 0;
    }
    .slide {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.90);
      z-index: 9999;
      padding: 2rem;
    }
    .slide--rules {
      left: 0;
    }
    .slide--milestones {
      right: 0;
    }
    .slide .rm-col {
      margin: 0 !important;
      transition: 0.1s ease-in-out padding-top;
    }
    .rm-col {
      /deep/ ul {
        padding-left: 1rem;
      }
    }
  }
</style>
