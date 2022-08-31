<template>
  <div id="app">
    <div class="rotate-device" v-if="$route.name === 'Play'">
      <img svg-inline class="icon-rotate" src="@/assets/rotation.svg" alt="Please rotate your device." />
      <p>Please rotate your device.</p>
    </div>
    <component :is="layout">
      <router-view @tap-winner="pushLastWinsMobile"/>
    </component>
    <CompleteRegModal v-if="showCompleteRegModal" @completed="hideCompleteRegModal"/>
    <Modal
      v-model="show"
      :title="notificationTitle"
      btn-text="Continue"
      btn-variant="rounded-orange"
      :btn-action="closeModal"
      :mode="notificationMode"
      :show-confetti="showConfetti"
      close-button
    >
      <template v-slot:body v-if="notification && notification.data">
        <template v-if="winAmount">
          <p v-if="isDiamondPrize" class="win-amount">
            <img svg-inline class="ticket-icon icon" src="@/assets/ticket-icon.svg" alt="Tickets">
            {{winAmount}}
          </p>
          <p v-else class="win-amount">{{winAmount}}</p>
        </template>
        <p>{{notification.data.jackpotName || notification.data.tournamentName}}</p>
        <p v-if="showConfetti">
          Congratulations, you just won a tournament on {{ notification.data.tournamentName }}.
          <br>
          Well played and don't forget tournaments are running 24 hours a day for your enjoyment.
        </p>
        <br>
      </template>
    </Modal>
    <TicketStore />
  </div>
</template>

<script>
import CompleteRegModal from '@/components/auth/CompleteRegModal.vue';
import Modal from '@/components/global/Modal.vue';
import EventBus from '@/helpers/event-bus';
import TicketStore from '@/components/ticket-store/TicketStore.vue';

const DEFAULT_LAYOUT = 'blank';
export default {
  name: 'Tournament',
  components: {
    CompleteRegModal,
    Modal,
    TicketStore,
  },
  data() {
    return {
      show: false,
      notification: null,
      notificationTypes: {
        TournamentWin: {
          title: 'You won!',
          // description: 'Donec nec justo eget felis facilisis fermentum, aliquam porttitor.',
        },
        TournamentJackpotWin: {
          title: 'You hit the Mega Prize!',
          // description: 'Donec nec justo eget felis facilisis fermentum, aliquam porttitor.',
        },
        ScheduledLeaderboardWin: {
          title: 'You won!',
          // description: 'Donec nec justo eget felis facilisis fermentum, aliquam porttitor.',
        },
      },
      steps: [],
      showIntroModal: true,
    };
  },
  computed: {
    layout() {
      return `${(this.$route.meta.layout || DEFAULT_LAYOUT)}-layout`;
    },
    showCompleteRegModal() {
      return this.$store.state.auth.showCompleteRegModal;
    },
    notificationTitle() {
      if (this.notification === null) return null;
      return this.notificationTypes[this.notification.type].title;
    },
    winAmount() {
      if (!this.notification || !this.notification.data) return 0;
      if (!this.notification.data.prizeTotal && this.notification.data.prizes.length) {
        return this.notification.data.prizes[0].name;
      }
      if (this.notification.data.prizeTotal) {
        if (this.notification.data.prizeTotal.currencyCode === 'DIA') return this.notification.data.prizeTotal.amount;
        return this.formatMoney(this.notification.data.prizeTotal.amount, this.notification.data.prizeTotal.currencyCode);
      }
      if (this.notification.data.currencyCode === 'DIA') return this.notification.data.amount;
      return `$${this.notification.data.amount}`;
    },
    isDiamondPrize() {
      if (!this.notification || !this.notification.data) return false;
      if (this.notification.data.prizeTotal) return this.notification.data.prizeTotal.currencyCode === 'DIA';
      return this.notification.data.currencyCode === 'DIA';
    },
    isTangiblePrize() {
      if (!this.notification || !this.notification.data) return false;
      return !this.notification.data.prizeTotal && this.notification.data.prizes.length;
    },
    notificationMode() {
      // @TODO: update this with more types if more types need to be handled here
      if (!this.notification) return 'simple';
      if (this.notification.type === 'TournamentJackpotWin') {
        return 'jackpot';
      }
      return 'simple';
    },
    showConfetti() {
      if (!this.notification) return null;
      return Object.keys(this.notificationTypes).includes(this.notification.type);
    },
  },
  beforeCreate() {
    EventBus.$on('notification', (message) => {
      this.notification = message.payload;
      // EventBus.$emit('closeTicketStore');
      this.show = true;
    });
  },
  created() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  mounted() {
    setTimeout(this.checkIfMobile, 100);
  },
  beforeDestroy() {
    EventBus.$off('notification');
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {
    hideCompleteRegModal() {
      this.$store.dispatch('showCompleteRegModal', false);
    },
    pushLastWinsMobile() {
      // check if mobile
      if (window.innerWidth > 1279) return;
      // if mobile push to 'Last Wins'
      this.$router.push({ name: 'LastWins' });
    },
    closeModal() {
      this.$store.dispatch('markAsRead', this.notification)
        .finally(this.show = false);
    },
    // check screen vieport width
    checkIfMobile() {
      if (window.innerWidth <= 1279 && window.innerWidth >= 768) {
        this.$store.dispatch('setIsMobile', true);
        this.$store.dispatch('setIsMobileSmall', false);
        // Vue.prototype.isMobile = true;
        // Vue.prototype.isMobileSmall = false;
      } else if (window.innerWidth <= 767) {
        this.$store.dispatch('setIsMobile', true);
        this.$store.dispatch('setIsMobileSmall', true);
        // Vue.prototype.isMobile = true;
        // Vue.prototype.isMobileSmall = true;
      } else {
        this.$store.dispatch('setIsMobile', false);
        this.$store.dispatch('setIsMobileSmall', false);
        // Vue.prototype.isMobile = false;
        // Vue.prototype.isMobileSmall = false;
      }
    },
  },
};
</script>

<style lang="scss">
  @import 'assets/flags/freakflags.css';

  body {
    margin: 0;
  }
  .rotate-device {
    display: none;
  }
  svg.icon-rotate {
    fill: #fff;
    width: 100px;
    margin-bottom: 1rem;
  }
  .rotate-device>p:last-child {
    margin-bottom: 0;
  }

  .win-amount {
    font-size: 40px;
    font-weight: bold;
    /* text-shadow: 0px 0px 3px #FD8E40; */
    background: -webkit-linear-gradient(#FF6C44, #FBB13E);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    // & .ticket-icon {
    //   width: ;
    // }
  }

  /* Hides the reCAPTCHA on every page */
  .grecaptcha-badge {
    opacity: 0;
    &.visible {
      opacity: 1 !important;
    }
  }

  @media screen and (max-device-width: 927px) and (orientation: landscape) and (min-aspect-ratio: 13/9) {
    // html, body {
    //   overflow: hidden;
    // }
    .rotate-device {
      display: block;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: #1d1d30;
      z-index: 10000000000;
      color: #fff;
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
  }
  @media (max-width: 767px) {
    .intro-modal .modal-inner-scroll .body {
      max-width: 100%;
    }
  }
</style>
