<template>
  <div class="play-area" :class="{ 'play-area--mobile': isMobileSmall, 'has-bg': !readyToJoin }">
    <div class="panel" :class="{ 'is-full-screen': gameFullScreen }">
      <div class="panel__col col-left" :class="{ 'hidden': gameFullScreen }">
        <UserControls/>
      </div>
      <div class="panel__col col-middle" :class="{ 'has-lb': leaderboard && playerLoaded && readyToJoin, 'has-jackpots': playerLoaded && readyToJoin && jackpots.length, 'full-width': gameFullScreen }">
        <ControlStrip
          v-if="entryData.location && gameData !== null && readyToJoin && !isMobile"
          class="control-strip--desktop"
          :soundEnabled="soundEnabled"
          :tournament="gameData"
          @soundControl="handleSoundControl"
          :showSoundControl="gameData.game.metadata && gameData.game.metadata.externalControlSupport && gameReady"
        />
        <transition-group name="fade">
          <PrizesModal
            v-if="!entryData.location && gameData !== null && showPrizes && (jackpots.length !== 0 || Object.keys(prizes).length !== 0)"
            key="prizesmodal"
            v-model="show"
            :gameData="gameData"
            :prizes="prizes"
            :jackpots="jackpots"
          />
          <GameArea
            v-else-if="entryData.location && gameData !== null && readyToJoin"
            :readyToJoin="readyToJoin"
            :leaderboardExists="leaderboardExists"
            :playerLoaded="playerLoaded"
            :leaderboardMode="leaderboardMode"
            :chatActive="showFeed"
            @wentFullScreen="gameFullScreen = !gameFullScreen"
            :userProgress="userProgress"
            :ratioMobile="gameData.game.aspectRatioMobile"
            :ratioDesktop="gameData.game.aspectRatioDesktop"
            :rules="gameData.rules"
            :isMobile="isMobile"
            :isMobileSmall="isMobileSmall"
            :location="entryData.location"
            :chatChannelExists="chatChannelExists"
            :spinning="spinning"
            :finished="started && ended && (this.gameData.type === 'Slot' || gameData.state > 4)"
            :allocations="allocations"
            :allocationsComplete="allocationsComplete"
            :allocationsRemaining="allocationsRemaining"
            :entryComplete.sync="entryComplete"
            :entryCost="entryCost"
            :tournamentMinLevel="gameData.minLevel"
            :userLevel="userLevel"
            :executeGameCommand="executeGameCommand"
            :enterGame="enterGame"
            key="gamearea"
          />
          <WaitingRoom
            v-else
            key="waiting-room"
            :gameData="gameData"
            :started="started"
            :ended="ended"
            :preStartTime="preStartTime"
            :readyToJoin="readyToJoin"
          />
        </transition-group>
      </div>
      <div class="panel__col col-right" :class="{ 'hidden': gameFullScreen }">
        <ControlStrip
          v-if="entryData.location && gameData !== null && readyToJoin && isMobile"
          class="control-strip--mobile"
          :soundEnabled="soundEnabled"
          :tournament="gameData"
          @soundControl="handleSoundControl"
          :showSoundControl="gameData.game.metadata && gameData.game.metadata.externalControlSupport && gameReady"
        />
        <div v-if="jackpots.length && readyToJoin" class="thumbnail-jackpot">
          <div class="tn-jackpot-single" v-for="(jackpot, i) in jackpots" :key="`tn-jackpot-${i}`" :class="[{ 'active': showJackpotIndex === i || jackpots.length === 1 }, jackpot.label.toLowerCase()]">
            <div class="tn-jackpot-single-inner">
              <div class="tn-jp-col tn-jp-col--left"></div>
              <div class="tn-jp-col tn-jp-col--middle">{{ jackpot.label }} Prize <strong>{{ formatMoney(jackpot.balance, 'USD', true) }}</strong></div>
              <div class="tn-jp-col tn-jp-col--right">{{ jackpot.threshold }}</div>
            </div>
          </div>
        </div>
        <div class="game-lb-chat">
          <Leaderboard
          v-if="leaderboard && readyToJoin"
          :leaderboard="leaderboard"
          :playerPosition="playerPosition"
          :playerLoaded="playerLoaded"
          :switchingModes="switchingModes"
          :leaderboardMode="leaderboardMode"
          :isMobile="isMobile"
          :prizes="prizes"
          @swiped="switchLeaderBoardMode"
          @full-board="resizeOverlay"/>
          <Chat v-if="'chatChannel' in entryData && !isMobile" :channel="entryData.chatChannel" :gameOver="gameOver" />
        </div>
      </div>
      <div v-if="isMobile" id="mobile-chat" class="mobile-chat" :class="{ active : showFeed }">
        <transition name="fade">
          <Chat v-if="'chatChannel' in entryData" :channel="entryData.chatChannel" :isMobileSmall="isMobileSmall" :isMobile="isMobile" :gameOver="gameOver" :chatIsActive="showFeed" />
        </transition>
      </div>
      <transition name="fade">
        <div v-if="isMobile && chatChannelExists && !gameOver" class="mobile-chat-toggle">
          <img @click="toggleFeed(true)" v-if="!showFeed" class="chat__bubble" svg-inline src="@/assets/chat.svg" alt="chat" />
          <img @click="toggleFeed(false)" svg-inline src="@/assets/chevron.svg" alt="toggle chat" :class="{ 'chat_arrow': true, 'chat__arrow-up': !showFeed }" />
        </div>
      </transition>
      <VipModal v-if="$store.state.vip.showVip && $store.state.vip.vipActive" />
    </div>
  </div>
</template>

<script>
import UserControls from '@/components/panel/UserControls.vue';
import Leaderboard from '@/components/panel/Leaderboard.vue';
import GameArea from '@/components/panel/GameArea.vue';
import Chat from '@/components/panel/Chat.vue';
import WaitingRoom from '@/components/panel/WaitingRoom.vue';
import PrizesModal from '@/components/panel/PrizesModal.vue';
import ControlStrip from '@/components/navigation/ControlStrip.vue';
import VipModal from '@/components/global/VipModal.vue';
import EventBus from '@/helpers/event-bus';

export default {
  name: 'Play',
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  components: {
    UserControls,
    Leaderboard,
    GameArea,
    Chat,
    ControlStrip,
    VipModal,
    WaitingRoom,
    PrizesModal,
  },
  data() {
    return {
      show: true,
      leaderboard: null,
      userProgress: false,
      gameData: null,
      entryData: {
        location: false,
      },
      enteredGame: false,
      leaderboardIntervalSet: false,
      readyToJoin: false,
      timeLeft: 0,
      gameTimeIntervalSet: false,
      gameURL: null,
      leaderboardMode: 'around',
      playerLoaded: false,
      switchingModes: false,
      soundEnabled: false,
      gameReady: false,
      allocations: 0,
      allocationsComplete: 0,
      entryComplete: false,
      entryCost: 0,
      maxEntryAllocations: 0,
      onNextSpinComplete: undefined,
      roundCompleteTimer: undefined,
      receiveMessage: (event) => {
        // console.log(event);

        if (!event.data || typeof event.data !== 'string') {
          return;
        }

        const eventParts = event.data.split(/:(.+)/);
        const eventName = eventParts[0];
        // const eventData = eventParts.length > 1 ? JSON.parse(eventParts[1]) : undefined;

        switch (eventName) {
          case 'READY':
            this.gameReady = true;
            break;

          case 'CLOSE':
            this.$router.push({ name: 'Lobby' }).catch(() => {});
            break;

          case 'ROUND_START':
            if (this.entryComplete) return;
            this.spinning = true;
            if (this.gameData.leaderboardMode === 'Visible') {
              this.stopLeaderboardPolling();
            }
            if (this.roundCompleteTimer) {
              clearTimeout(this.roundCompleteTimer);
              this.roundCompleteTimer = undefined;
            }
            this.roundCompleteTimer = setTimeout(() => this.onRoundComplete(), 30000);
            break;

          case 'ROUND_COMPLETE':
            this.onRoundComplete();
            break;

          case 'SOUND_ENABLED':
            this.soundEnabled = true;
            console.log('Game enabled sound');
            break;

          case 'SOUND_DISABLED':
            this.soundEnabled = false;
            console.log('Game disabled sound');
            break;

          default:
            break;
        }
      },
      showFeed: true,
      polling: null,
      pollingLeaderboard: null,
      pollingGameTime: null,
      gameFullScreen: false,
      gameOver: false,
      showPrizes: process.env.VUE_APP_PRIZES_MODAL === 'true',
      modalShowJackpots: true,
      // jackpots: [],
      showJackpotIndex: 0,
      jackpotIntervalPolling: null,
      spinning: false,
      preStartTime: 1,
      entryUpdateTimer: null,
    };
  },
  computed: {
    ended() {
      if (!this.gameData) return null;
      return this.$dayjs(this.gameData.startTime).isAfter();
      // return this.$dayjs().utcOffset(0).format() >= this.gameData.endTime;
    },
    started() {
      if (!this.gameData) return null;
      return this.$dayjs(this.gameData.startTime).isSameOrBefore();
      // return this.$dayjs().utcOffset(0).format() <= this.gameData.startTime;
    },
    diamondBalance() {
      return this.$store.getters.diamondBalance;
    },
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    // check if chatChannel exists
    chatChannelExists() {
      return this.entryData.chatChannel !== undefined;
    },
    // check if leaderboard exist for the game
    leaderboardExists() {
      return this.leaderboard !== null;
    },
    // check player position
    playerPosition() {
      return this.leaderboard !== null ? this.leaderboard.entries.findIndex((obj) => obj.isPlayer) : -1;
    },
    // set the badge color based on the received prop
    badgeColorVariant() {
      return this.gameData.type ? this.gameData.type.toLowerCase() : '';
    },
    // set the badge text based on the received prop
    badgeTextVariant() {
      return this.gameData.type === 'HiLo' ? 'Hi-Lo' : this.gameData.type;
    },
    // check if game is for VIP memmbers
    vipGame() {
      return this.gameData.minLevel > 0;
    },
    prizes() {
      const prizesList = {};
      if (this.gameData && typeof this.gameData.prizes !== 'undefined' && this.gameData.prizes) {
        Object.values(this.gameData.prizes).forEach((prize) => {
          if (prize.type === 'Cash' || prize.type === 'Tangible') {
            for (let i = prize.startRank; i <= prize.endRank; i += 1) {
              prizesList[i] = {
                name: prize.name,
                shortName: prize.shortName,
                amount: prize.amount,
                currencyCode: prize.currencyCode,
              };
            }
          }
        });
      }
      return prizesList;
    },
    jackpots() {
      const jackpots = [];
      if (this.gameData && typeof this.gameData.jackpotTriggers !== 'undefined' && this.gameData.jackpotTriggers) {
        this.gameData.jackpotTriggers.forEach((jackpotTrigger) => {
          if (jackpotTrigger.enabled) {
            const lookForJackpot = this.$store.getters.getJackpotById(jackpotTrigger.jackpotId);
            if (lookForJackpot) {
              lookForJackpot.threshold = jackpotTrigger.threshold;
              jackpots.push(lookForJackpot);
            }
          }
        });
      }
      return jackpots;
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
    allocationsRemaining() {
      if (!this.gameData || !this.gameData.maxEntryAllocations) {
        return undefined;
      }

      return this.gameData.maxEntryAllocations - this.allocationsComplete;
    },
    hasEntryCost() {
      return this.entryCost && (!this.gameData.playerJoined || this.allocations === this.allocationsComplete);
    },
    isOutOfChances() {
      return this.gameData.playerCompleted && this.gameData.playerJoined === true;
    },
  },
  watch: {
    playerPosition() {
      this.playerLoaded = true;
    },
  },
  methods: {
    switchLeaderBoardMode(direction) {
      if (direction === 'left' || direction === 'right' || this.leaderboard.entryCount <= 7 || (this.leaderboard.entries[0].rank === 1 && (this.playerPosition >= 0 && this.playerPosition <= 3)) || (direction === 'bottom' && this.leaderboardMode === 'top') || (direction === 'top' && this.leaderboardMode === 'around')) return; // eslint-disable-line
      // toggle loader when switching between modes
      this.switchingModes = true;
      // chceck swipe direction
      if (direction === 'bottom') {
        // set the mode to show top 7 entries
        this.leaderboardMode = 'top';
      } else if (direction === 'top') {
        // set the mode back to show entries around the player
        this.leaderboardMode = 'around';
      }
      // load new leaderboard data
      this.loadLeaderboardData(this.gameData.leaderboardId, this.leaderboardMode, true);
    },
    handleSoundControl() {
      if (this.soundEnabled) {
        this.executeGameCommand('DISABLE_SOUND', true);
      } else {
        this.executeGameCommand('ENABLE_SOUND', true);
      }
    },
    executeGameCommand(command, skipCheck) {
      if (!skipCheck) {
        if (!this.gameData.game.metadata || !this.gameData.game.metadata.commands || this.gameData.game.metadata.commands.length === 0) {
          return false;
        }

        if (!this.gameData.game.metadata.commands.includes(command)) {
          return false;
        }
      }

      const iframe = this.$el.querySelector('#iframe');
      iframe.contentWindow.postMessage(command, '*');
      return true;
    },
    // resize overlay in GameArea
    resizeOverlay() {
      const middleCol = document.querySelector('.col-middle');
      middleCol.classList.toggle('condensed');
    },
    // get leaderboard data
    loadLeaderboardData(leaderboardId, leaderboardMode = 'around', manualCall = false) {
      const leaderboardModeUrl = leaderboardMode === 'around' ? 'around?count=3' : '?take=7';
      this.$api
        .get(`/leaderboard/${leaderboardId}/${leaderboardModeUrl}`)
        .then((response) => response.data)
        .then((leaderboard) => {
          if (leaderboard.entries.length > 1) {
            // init a passedPlayer variable which checks if a leaderboard entry went passed current player
            let passedPlayer = false;
            // go through each leaderboard entry
            leaderboard.entries.forEach((element, index) => {
              // make every entry not visible by defayult (current player will always be visible regardless - special css class added)
              if (typeof element.isVisible === 'undefined') {
                element.isVisible = false;
              }
              // check if current iteration is after the current player
              if (passedPlayer) {
                // Make the entry following the current player visible
                element.isVisible = true;
                // Changed passedPlayer variable back to false in order to stop making every next entry visible
                passedPlayer = false;
              }
              // if current iteration is current player change the passedPlayer variable to true
              if (element.isPlayer) {
                passedPlayer = true;
              }
              // check if current iteration is current player but is not first rank and make one entry before visible
              if (element.isPlayer && index > 0) {
                leaderboard.entries[index - 1].isVisible = true;
              }
              // check if there are more than 2 entries and check if the player is in last position
              if (leaderboard.entries.length > 2 && (element.isPlayer && index === leaderboard.entries.length - 1)) {
                leaderboard.entries[index - 2].isVisible = true;
              }
              // check if there are more than 2 entries and check if the player is first position
              if ((element.isPlayer && index === 0) && leaderboard.entries.length > 2) {
                leaderboard.entries[index + 2].isVisible = true;
              }
            });
          }
          this.leaderboard = leaderboard;
          // if the call was not made by mode switching
          if (!manualCall) return;
          this.switchingModes = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // get user progress
    checkUserProgress(leaderboardId) {
      this.$api
        .get(`/leaderboard/${leaderboardId}/progress`)
        .then((response) => response.data)
        .then((leaderboardProgress) => {
          this.userProgress = leaderboardProgress;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    jackpotInterval() {
      if (this.jackpots.length && this.showJackpotIndex >= this.jackpots.length - 1) {
        this.showJackpotIndex = 0;
      } else if (this.jackpots.length) {
        this.showJackpotIndex += 1;
      }
    },
    fetchGameData() {
      return this.$api
        .get(`/tournament/${this.id}`)
        .then((response) => response.data)
        .then((gameData) => {
          this.gameData = gameData;

          this.entryCost = this.gameData.playerEntryCost;

          switch (this.gameData.type) {
            default:
              break;

            case 'Bingo':
              this.preStartTime = 60;
              break;

            case 'HiLo':
              this.preStartTime = 30;
              break;
          }

          // check game state each time we fetch game data
          if (gameData.state > 4) {
            this.gameOver = true;
            this.stopPolling();
          } else if (gameData.state > 2 && gameData.endTime && !this.ended) {
            this.stopPolling();
          }
          // update timeleft and cut off time for current game
          if (!this.gameTimeIntervalSet) {
            // this.pollingGameTime = setInterval(() => {
            //   this.updatetimeLeft();
            // }, 1000);
            this.gameTimeIntervalSet = true;
          }
          // TODO check if user should be able to enter the game
          if (!this.enteredGame) {
            this.enteredGame = true;
            if (gameData.state > 4) {
              this.$router.push({ name: 'Lobby' }).catch(() => {});
              return;
            }
            // this.enterGame();
            // console.log('test');
            if (this.showPrizes) {
              if (this.gameData.leaderboardProgress) {
                this.checkUserProgress(this.gameData.leaderboardId);
              }
              // check if game has a visible leaderboard
              if (this.gameData.leaderboardMode === 'Visible' && !this.leaderboardIntervalSet) {
                this.startLeaderboardPolling();
                this.loadLeaderboardData(this.gameData.leaderboardId);
              }
            } else {
              this.enterGame();
            }
          }
        });
    },
    async enterGame(tryAgain = false) {
      // case joined && tryAgain : BALANCE CHECK
      // case !joined && !tryAgain : BALANCE CHECK
      // case joined && !tryAgain : GO
      if ((this.gameData.playerJoined && tryAgain) || (!this.gameData.playerJoined && !tryAgain)) {
        if (this.gameData.playerEntryCost && this.gameData.playerEntryCost > this.diamondBalance) {
          EventBus.$emit('showTicketStore', false, this.gameData.playerEntryCost, tryAgain);
          return false;
        }
      }

      // jackpot interval
      if (typeof this.gameData.jackpotTriggers !== 'undefined' && this.gameData.jackpotTriggers.length) {
        clearInterval(this.jackpotIntervalPolling);
        this.jackpotIntervalPolling = setInterval(() => {
          this.jackpotInterval();
        }, 6000);
      }
      const saveShowPrizes = this.showPrizes;
      this.showPrizes = false;
      return this.$api
        .post(`/tournament/${this.id}/entry`)
        .then((response) => response.data)
        .then((entryData) => {
          this.entryData = entryData;
          if (!saveShowPrizes) {
            if (this.gameData.leaderboardProgress) {
              this.checkUserProgress(this.gameData.leaderboardId);
            }
            // check if game has a visible leaderboard
            if (this.gameData.leaderboardMode === 'Visible' && !this.leaderboardIntervalSet) {
              this.startLeaderboardPolling();
              this.loadLeaderboardData(this.gameData.leaderboardId);
            }
          }

          // if (this.gameData.playerEntryCost) {
          //   this.$store.dispatch('loadWallet');
          // }

          this.fetchGameData();
          return true;
        })
        .catch((error) => {
          if (error.message.includes('403')) {
            this.$router.push({ name: 'Lobby' }).catch(() => {});
          }

          if (error.response && error.response.data && error.response.data.name && error.response.data.name === 'InsufficientFunds') {
            // eslint-disable-next-line no-alert, no-restricted-globals
            console.log('Insufficient tickets for entry.');
            EventBus.$emit('showTicketStore');
            // this.$router.push({ name: 'Lobby' }).catch(() => {});
          }
          return false;
        });
    },
    // Adjust the play area size after interacting with chat. Also counters native safari browser navigation
    playAreaAdjuster() {
      // grab play-area
      const playArea = document.querySelector('.play-area');
      const windowInnerHeight = window.innerHeight;
      playArea.style.height = `${windowInnerHeight}px`;
    },
    startLeaderboardPolling() {
      clearInterval(this.pollingLeaderboard);
      // call a method to get leaderboard data and pass the leaderboardId
      // limit the api call to every 5 seconds
      this.pollingLeaderboard = setInterval(() => {
        this.loadLeaderboardData(this.gameData.leaderboardId, this.leaderboardMode);

        if (this.gameData.leaderboardProgress) {
          this.checkUserProgress(this.gameData.leaderboardId);
        }
      }, 5000);
      this.leaderboardIntervalSet = true;
    },
    stopLeaderboardPolling() {
      clearInterval(this.pollingLeaderboard);
      this.leaderboardIntervalSet = false;
    },
    startPolling(interval) {
      clearInterval(this.polling);
      this.polling = undefined;
      this.fetchGameData();
      this.polling = setInterval(() => {
        this.fetchGameData();
      }, interval || 5000);
    },
    stopPolling() {
      clearInterval(this.polling);
      this.polling = undefined;
    },
    toggleFeed(focusInput = false) {
      this.showFeed = !this.showFeed;
      if (focusInput) EventBus.$emit('focusInput');
      // if (this.$store.state.vip.vipActive && this.$store.state.vip.showVip && this.$store.state.vip.onlyVipCanChat && this.userLevel <= 1) { // && sessionStorage && !sessionStorage.sawModal
      //   document.body.classList.add('vip-modal-opened');
      //   // sessionStorage.sawModal = true;
      //   return;
      // }
      // if (!this.showFeed) {
      //   this.showFeed = true;
      // }
    },
    handleEntryUpdate(data) {
      clearTimeout(this.entryUpdateTimer);

      if (!this.spinning) {
        this.entryUpdateTimer = setTimeout(() => {
          this.entryComplete = data.complete;
          this.allocations = data.allocations;
          this.allocationsComplete = data.allocationsComplete;
        }, 3000);
        return;
      }

      this.onNextSpinComplete = () => {
        this.entryComplete = data.complete;
        this.allocations = data.allocations;
        this.allocationsComplete = data.allocationsComplete;
      };
    },
    onRoundComplete() {
      if (this.roundCompleteTimer) {
        clearTimeout(this.roundCompleteTimer);
        this.roundCompleteTimer = undefined;
      }

      if (!this.spinning) {
        return;
      }

      this.spinning = false;

      if (typeof this.onNextSpinComplete === 'function') {
        this.onNextSpinComplete();
        this.onNextSpinComplete = undefined;
      }

      if (this.gameData.leaderboardMode === 'Visible') {
        setTimeout(() => {
          this.loadLeaderboardData(this.gameData.leaderboardId, this.leaderboardMode);
          if (this.gameData.leaderboardProgress) {
            this.checkUserProgress(this.gameData.leaderboardId);
          }
          this.startLeaderboardPolling();
        }, Math.floor(Math.random() * 1000));
      }
    },
  },
  mounted() {
    if (this.isMobile) {
      // dispatch only if mobile
      window.addEventListener('resize', this.playAreaAdjuster);
      this.playAreaAdjuster();
    }
  },
  beforeCreate() {
    EventBus.$on('tournamentEntryUpdate', (data) => {
      if (data.tournamentId !== this.id) {
        return;
      }
      this.handleEntryUpdate(data);
    });
  },
  async created() {
    if (!this.id) {
      // throw an error and shit - no game ID provided LOL
      return;
    }
    // fetch game data before entering the game in order to determine if the user should be allowed to join
    this.startPolling();
    window.addEventListener('message', this.receiveMessage);
    EventBus.$on('readyToJoin', (readyToJoin) => {
      this.readyToJoin = readyToJoin;
    });
    EventBus.$on('waitroomChatActive', (waitroomChatActive) => {
      this.waitroomChatActive = waitroomChatActive;
    });
    EventBus.$on('enterGame', () => {
      this.enterGame();
    });
    EventBus.$on('startPolling', (interval) => {
      this.startPolling(interval);
    });
  },
  beforeDestroy() {
    EventBus.$off('tournamentEntryUpdated');
    EventBus.$off('readyToJoin');
    EventBus.$off('waitroomChatActive');
    EventBus.$off('enterGame');
    EventBus.$off('startPolling');
    document.body.classList.remove('vip-modal-opened');
    clearInterval(this.polling);
    this.stopLeaderboardPolling();
    clearInterval(this.pollingGameTime);
    window.removeEventListener('message', this.receiveMessage);
    if (this.jackpotIntervalPolling) {
      clearInterval(this.jackpotIntervalPolling);
    }
    clearTimeout(this.roundCompleteTimer);
    clearTimeout(this.entryUpdateTimer);
  },
  destroyed() {
    window.removeEventListener('resize', this.playAreaAdjuster);
  },
};
</script>

<style scoped lang="scss">
  .game-lb-chat {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .panel__col {
    &.hidden {
      display: none;
    }
    &.full-width {
      grid-column: span 48;
    }
  }
  .col-right {
    background-color: $navy;
    z-index: 0;
  }
  .col-middle {
    position: relative;
    z-index: 1;
  }
  @media (min-width: 1280px) {
    .mobile-chat {
      display: none;
    }
  }
  @media (max-width: 1439px) {
    .col-middle {
      grid-column: span 31; // + 1
    }
    .col-right {
      grid-column: span 10; // 0
    }
  }
  @media (max-width: 1279px) {
    .play-area {
      height: 100vh;
      display: flex;
      // height: -webkit-fill-available;
      overflow: hidden;
    }
    .panel {
      display: flex;
      flex-direction: column;
      position: relative;
      min-height: 100%;
      width: 100%;
    }
    .mobile-nav {
      order: 1;
    }
    .col-right {
      order: 2;
      z-index: 1 !important;
    }
    .col-left {
      display: none;
    }
    .col-middle {
      order: 3;
      flex: 1;
      padding: 0;
      &.condensed {
        /deep/ .rm-col {
          // temorarily fixed padding
          padding-top: 126px;
        }
      }
    }
    .game-lb-chat {
      height: unset;
    }
    .col-right {
      position: absolute;
      top: 0;
      width: 100%;
      left: 0;
      z-index: 1;
    }
    .mobile-chat {
      visibility: hidden;
      order: 4;
      z-index: 1;
      position: fixed;
      bottom: 0;
      // width: 1024px;
      max-width: 100%;
      left: 0;
      right: 0;
      overflow: hidden;
      transition: 0.2s ease-in-out opacity;
      /deep/ .chat__feed {
        padding-bottom: 5px;
      }
      /deep/ .chat__feed-wrapper {
        max-height: 122px;
      }
      /deep/ .chat {
          mask-image: linear-gradient(transparent 0, rgba(0, 0, 0, 1.0) 15px);
          background: linear-gradient(to bottom, rgba(0,0,0,0) ,rgba(0,0,0,0.7) 50%, rgba(0,0,0,1) 100%);
          height: 122px;
          justify-content: flex-end;
      }
      /deep/ .chevron-icon {
        transform: rotate(180deg);
      }
      /deep/ .entry:last-child,
      /deep/ .entry:nth-last-child(2) {
        padding-right: 3rem;
      }
      /deep/ .chat__input {
        overflow: hidden;
        border: none;
      }
      &.active {
        display: block;
        visibility: visible;
        /deep/ .chat {
          position: relative;
        }
        /deep/ .chat__input {
          max-height: 1000px;
          visibility: visible;
          opacity: 1;
          padding: 0rem 3rem .5rem .5rem;
          margin-top: -4px;
        }
        // /deep/ .chat__feed-wrapper {
        //   max-height: 77px;
        // }
      }
    }
    .play-area.has-bg {
      /deep/ .chat {
        background-color: transparent;
        height: 200px;
      }
      /deep/ .chat__feed-wrapper {
        max-height: 200px;
      }

      .mobile-chat.active {
        /deep/ .chat__feed-wrapper {
          max-height: 155px;
        }
      }
    }
    .col-middle {
      padding-top: 27px;
      &.has-lb {
        padding-top: 110px;
      }
      &.has-lb.has-jackpots {
        padding-top: 130px;
      }
    }
    .mobile-chat-toggle {
      position: fixed;
      right: .8rem;
      bottom: .5rem;
      z-index: 1;
      line-height: 1;
      font-size: 27px;

      svg {
        width: 20px;
        height: 20px;
        transition: transform 0.2s;

        path {
          fill: #fff;
        }
      }

      .chat__bubble {
        margin-right: 1rem;
      }

      .chat__arrow-up {
        transform: rotate(180deg);
      }
    }
    // .waitroom-close {
    //   margin-top: -27px;
    // }
  }
  @media (max-width: 767px) {
    .mobile-chat,
    .col-right {
      width: 100%;
    }
    .mobile-chat {
      width: 100%;
    }
  }
  img.coin {
    position: absolute;
  }
  img.coin.coin-1 {
    bottom: 98%;
    left: 50%;
    transform: translateX(-30%);
  }
  img.coin.coin-2 {
    top: 90%;
    left: 80%;
    z-index: 999999;
  }
  // lb Jackpots
  .thumbnail-jackpot {
    position: relative;
    z-index: 9;
  }
  .tn-jackpot-single {
    max-height: 0px;
    opacity: 0;
    transition: 0.4s all ease-in-out;
    position: absolute;
    left: 0;
    right: 0;
    top: 15px;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.75);
    border-top: 1px solid #2e6eff;
    border-bottom: 1px solid #2e6eff;
    font-size: 11px;
    padding: 6px 1rem;
    text-align: center;
    color: #fff;
    &.active::before,
    &.active::after {
      position: absolute;
      content: '';
      width: 150px;
      height: 3px;
      background: #fff;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
      background: radial-gradient(circle, #87bfff 0%, rgba(255, 255, 255, 0) 100%);
      filter: blur(2px);
      mix-blend-mode: hard-light;
    }
    &::before {
      top: -3px;
    }
    &::after {
      bottom: -3px;
    }
    &.mega {
      background: $gold-gradient-diagonal;
      border-color: $gradient-gold;
      color: #000;
      &.active::before,
      &.active::after {
        background: radial-gradient(circle, $gradient-gold 0%, rgba(255, 255, 255, 0) 100%);
      }
    }
    &.maxi {
      background: $silver-gradient-diagonal-double;
      border-color: #A9A9A9;
      color: #000;
      &.active::before,
      &.active::after {
        background: radial-gradient(circle, #fff 0%, rgba(255, 255, 255, 0) 100%);
      }
    }
    &.mini {
      background: $orange-gradient-diagonal-double;
      border-color: #9b623c;
      color: #000;
      &.active::before,
      &.active::after {
        background: radial-gradient(circle, #fff 0%, rgba(255, 255, 255, 0) 100%);
      }
    }
  }
  .tn-jackpot-single.active .tn-jackpot-single-inner {
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      mix-blend-mode: hard-light;
      background: linear-gradient(90deg, rgba(246,218,184,0) 0%, #87bfff 50%, rgba(246,218,184,0) 100%);
    }
    &::before {
      top: -2px;
    }
    &::after {
      bottom: -2px;
    }
  }
  .tn-jackpot-single.active.mega .tn-jackpot-single-inner {
    &::before,
    &::after {
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, #FBB13E 50%, rgba(255,255,255,0) 100%);
    }
  }
  .tn-jackpot-single.active.maxi .tn-jackpot-single-inner {
    &::before,
    &::after {
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, #fff 50%, rgba(255,255,255,0) 100%);
    }
  }
  .tn-jackpot-single.active.mini .tn-jackpot-single-inner {
    &::before,
    &::after {
      background: linear-gradient(90deg, rgba(255,0,0,0) 0%, #ff9e83 50%, rgba(255,0,0,0) 100%);
    }
  }
  .tn-jackpot-single.active {
    max-height: 100px;
    opacity: 1;
    top: 0;
    left: 0;
  }
  .thumbnail-jackpot {
    height: 20px;
  }
  .tn-jackpot-single strong {
    margin-left: 5px;
  }
  .tn-jackpot-single-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }
  .tn-jp-col {
    flex: 1;
  }
  .tn-jp-col.tn-jp-col--middle {
    white-space: nowrap;
  }
  .tn-jp-col.tn-jp-col--right {
    text-align: right;
    font-weight: 600;
  }
</style>
