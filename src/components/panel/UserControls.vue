<template>
  <div class="user-controls" :class="{ 'no-promo': !$store.state.vip.showVip && isMobile, 'pt-0-m' : !$store.state.vip.showVipTimer && $store.state.vip.showVip }">
    <div class="user-controls__logo">
      <img class="panel-site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" @click="goLobby" />
    </div>
    <transition name="collapse">
      <div v-if="displayName && !isMobileSmall" class="user-controls__info-box">
        <router-link v-if="$route.matched.some(({ name }) => name !== 'Profile')" :to="{ name: 'Profile' }" class="user-info__go-profile"><img svg-inline class="edit-profile" src="@/assets/edit-profile.svg" alt="edit-profile" /></router-link>
        <UserInfo :isMobile="isMobile" :fromUserControls="true" :avatar="userAvatar" :displayName="displayName" :balance="walletBalance" :diamonds="diamondBalance" />
      </div>
    </transition>
    <div v-if="!isMobileSmall" class="user-controls__navigation" :class="{ 'no-username': !displayName }">
      <Navigation variant="desktop"/>
    </div>
    <div class="user-controls__bottom">
      <div v-if="!isMobile" class="user_controls__vip-cta v-step-6">
        <Button @clicked="openStore" text="Buy Tickets" variant="rounded-blue"/>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import UserInfo from '@/components/panel/UserInfo.vue';
import Navigation from '@/components/navigation/Navigation.vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'UserControls',
  components: {
    UserInfo,
    Navigation,
    Button,
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    // get all user data
    userData() {
      return this.$store.state.auth.userData;
    },
    // get user avatar
    userAvatar() {
      return this.userData !== null ? this.userData.avatarUrl : '';
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
    userLevel() {
      return this.$store.getters.userLevel;
    },
    canUpgradeToVip() {
      return this.$store.getters.canUpgradeToVip;
    },
  },
  methods: {
    openStore() {
      EventBus.$emit('toggleTicketStore', true, null);
    },
    goLobby() {
      if (this.$route.name === 'Lobby') return;
      this.$router.push({ name: 'Lobby' });
    },
  },
};
</script>

<style scoped lang="scss">
  .user-controls {
    height: 100%;
    padding: 2rem 1rem;
    background-color: $navy;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .user-controls__logo {
    width: 170px;
    margin: 0 auto;
    max-width: 100%;
    position: relative;
  }
  .user-controls__logo .badge {
    font-size: 10px;
    margin-left: auto;
    display: block;
    width: 90px;
    text-align: center;
    margin-right: auto;
    margin-top: .7rem;
    margin-bottom: -1rem;
  }
  .panel-site-logo {
    display: block;
    cursor: pointer;
  }
  .user-controls__info-box {
    margin: 2rem 0 1rem;
    background-color: $light-navy;
    padding: 3rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 8px;
  }
  .user-controls__navigation {
    background-color: $light-navy;
    padding: 2rem 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    &.no-username {
      margin-top: 2rem;
    }
  }
  .user-info__go-profile {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  .edit-profile {
    display: block;
    width: 15px;
  }
  .user-controls__bottom {
    margin-top: auto;
    position: sticky;
    bottom: 1rem;
    left: 0;
  }
  .user_controls__vip-cta {
    margin-top: 1rem;
    text-align: center;
  }
  @media (max-width: 1439px) {
    .user-controls__info-box {
      padding: 1rem;
    }
    /deep/ .navigation__site-language {
      margin-top: 2rem;
    }
    .user-controls__navigation {
      padding: 1rem;
    }
    /deep/ .navigation__item:not(:last-child) {
      margin-bottom: 1.5rem;
    }
  }
  @media (min-width: 1280px) {
    .user_controls__vip-cta {
      display: flex;
    }
  }
  @media (max-width: 1279px) {
    .user-controls__logo,
    .user-controls__navigation {
      display: none;
    }
    .user-controls {
      padding: 1rem;
      &.no-promo {
        padding-bottom: 0;
        .user-controls__bottom {
          display: none;
        }
      }
    }
    .user-controls__info-box {
      margin-top: 0;
    }
    .user-controls.pt-0-m {
      padding-top: 0;
    }
  }
  @media (max-width: 767px) {
    .user_controls__vip-cta {
      display: flex;
    }
    .user-controls {
      display: none !important;
      padding-bottom: 0;
      &.hide-mobile {
        display: none;
      }
      &.no-promo {
        padding: 0;
      }
    }
    .user-controls,
    .user-controls__info-box {
      background-color: transparent;
    }
    .user-controls__info-box {
      margin-bottom: 0;
    }
  }
</style>
