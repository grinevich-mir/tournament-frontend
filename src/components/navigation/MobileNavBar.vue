<template>
  <div class="mobile-nav__wrapper" :class="{ 'is-active' : activeMenu  }">
    <div class="mobile-nav__top">
      <div class="mobile-nav__burger">
        <div class="hamburger hamburger--slider" :class="{ 'is-active' : activeMenu  }" @click="activateMenu">
          <div class="hamburger-box">
            <div v-if="totalUnreadCount" class="notifications">
              <div class="notifications-count">
                {{ totalUnreadCount }}
              </div>
            </div>
            <div class="hamburger-inner"></div>
          </div>
        </div>
      </div>
      <div class="mobile-nav__logo"> <!-- :class="{ 'has-badge' : userLevel > 0 }" -->
        <img @click="goLobby" svg-inline src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
      </div>
      <transition name="fade">
        <div v-if="displayName && walletBalance !== false" class="mobile-nav__user-info">
          <!-- <div class="mobile-nav__username" @click="goProfile" :class="{ masked: displayName.length > 10 }">{{ displayName }}</div> -->
          <div class="mobile-nav__user-balance" @click="goProfile">{{ walletBalance }}</div>
          <div class="mobile-nav__user-balance diamonds" @click="openStore">
            <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">{{ diamondBalance }}
          </div>
        </div>
      </transition>
    </div>
    <Navigation/>
  </div>
</template>

<script>
import Navigation from '@/components/navigation/Navigation.vue';
// import Badge from '@/components/global/Badge.vue';
import EventBus from '@/helpers/event-bus';

export default {
  name: 'MobileNavBar',
  data() {
    return {
      activeMenu: false,
    };
  },
  components: {
    Navigation,
    // Badge,
  },
  beforeCreate() {
    EventBus.$on('closeMobileNav', () => {
      this.activeMenu = false;
      document.body.classList.remove('no-scroll');
    });
  },
  beforeDestroy() {
    EventBus.$off('closeMobileNav');
  },
  computed: {
    // get all user data
    userData() {
      return this.$store.state.auth.userData;
    },
    // get user display name
    displayName() {
      return this.userData !== null ? this.userData.displayName : '';
    },
    // get user wallet
    wallet() {
      return this.$store.state.banking.wallet;
    },
    // get user wallet balance from wallet
    walletBalance() {
      return this.$store.getters.walletBalance;
    },
    diamondBalance() {
      return this.$store.getters.diamondBalance;
    },
    totalUnreadCount() {
      return this.$store.getters.unclaimedGiftCount + this.$store.getters.unreadNotificationCount;
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
  },
  methods: {
    goProfile() {
      if (this.$route.name === 'Profile') return;
      this.$router.push({ name: 'Profile' });
    },
    activateMenu() {
      this.activeMenu = !this.activeMenu;
      document.body.classList.toggle('no-scroll');
      EventBus.$emit('closeTicketStore');
    },
    goLobby() {
      if (this.$route.name === 'Lobby') return;
      this.$router.push({ name: 'Lobby' });
    },
    openStore() {
      EventBus.$emit('toggleTicketStore', true, null);
    },
  },
};
</script>

<style scoped lang="scss">
  .mobile-nav__user-balance.diamonds {
    cursor: pointer;
    color: #7CFF84;

    & .ticket-icon {
      height: auto;
      margin-bottom: -2px;
      margin-right: 1px;
        & path {
          fill: #7CFF84;
        }
    }
  }

  @media (min-width: 768px) {
    .mobile-nav__user-info {
      display: none;
    }
  }
  @media (max-width: 767px) and (max-height: 530px) {
    .is-active {
      overflow: scroll;
      height: 100vh;
    }
  }
</style>
