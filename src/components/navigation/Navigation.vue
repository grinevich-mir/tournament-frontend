<template>
  <div class="navigation" :class="navVariant">
    <div class="navigation__wrapper">
      <ul class="navigation__main">
        <li class="navigation__item">
          <router-link @click.native="closeMobileNav" class="navigation__link navigation__link--home" to="/lobby" exact>
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/home.svg" alt="home-icon" />
            Lobby
          </router-link>
        </li>
        <li v-if="false" class="navigation__item">
          <router-link @click.native="closeMobileNav" class="navigation__link navigation__link--about" :to="{ name: 'AboutUs' }" exact>
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/leaderboard.svg" alt="history-icon" />
            About
          </router-link>
        </li>
        <li class="navigation__item">
          <router-link @click.native="closeMobileNav" class="navigation__link navigation__link--winners" :to="{ name: 'Winners' }" exact>
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/recent_winners.svg" alt="leaderboard-icon" />
            Winners
          </router-link>
        </li>
        <li class="navigation__item">
          <router-link @click.native="closeMobileNav" class="navigation__link navigation__link--notifications" to="/notifications" exact>
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/notifications.svg" alt="notifications-icon" />
            Notifications<span class="notifications-count" :class="{ 'mobile-view': !navVariant }" v-if="totalUnreadCount">{{ totalUnreadCount }}</span>
          </router-link>
        </li>
        <li class="navigation__item">
          <router-link @click.native="closeMobileNav" class="navigation__link navigation__link--profile" to="/profile" exact>
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/profile.svg" alt="profile-icon" />
            Profile
          </router-link>
        </li>
        <li class="navigation__item">
          <router-link @click.native="closeMobileNav" class="navigation__link navigation__link--referrals" to="/referrals" exact>
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/players.svg" alt="profile-icon" />
            Referrals
          </router-link>
        </li>
        <li class="navigation__item">
          <div @click="startTour" class="navigation__link navigation__link--home">
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/question-mark.svg" alt="home-icon" />
            Tutorial
          </div>
        </li>
        <li class="navigation__item">
          <a class="navigation__link navigation__link--logout" @click.prevent="logout">
            <img v-if="navVariant" svg-inline class="navigation__icon" src="@/assets/logout.svg" alt="log out" />
            Log out
          </a>
        </li>
        <li class="navigation__item">
          <Button v-if="isMobile" class="diamonds-cta" @clicked="openStore" large text="Buy Tickets" variant="rounded-blue"/>
        </li>
      </ul>
      <div class="navigation__site-language">
        <a v-if="false" class="button-lang"><img src="@/assets/uk-flag.png" alt="english lang"></a>
        <a v-if="false" class="button-lang"><img src="@/assets/de-flag.png" alt="germany lang"></a>
        <a v-if="false" class="button-lang"><img src="@/assets/es-flag.png" alt="spainish lang"></a>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// accepts variant prop : 'desktop'
import { AmplifyEventBus } from 'aws-amplify-vue';
// import { Hub } from 'aws-amplify';
import EventBus from '@/helpers/event-bus';
import Button from '@/components/global/Button.vue';

export default {
  name: 'Navigation',
  props: ['variant'],
  components: {
    Button,
  },
  computed: {
    navVariant() {
      return this.variant ? `navigation--${this.variant}` : '';
    },
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    unclaimedGiftCount() {
      return this.$store.getters.unclaimedGiftCount;
    },
    unreadNotificationCount() {
      return this.$store.getters.unreadNotificationCount;
    },
    totalUnreadCount() {
      return this.$store.getters.unclaimedGiftCount + this.$store.getters.unreadNotificationCount;
    },
  },
  methods: {
    startTour() {
      this.closeMobileNav();
      if (this.$route.name !== 'Lobby') {
        this.$router.push({ name: 'Lobby', query: { startTour: true } });
      } else {
        this.$tours.onboarding.start();
      }
      // EventBus.$emit('startTour');
    },
    openStore() {
      this.closeMobileNav();
      EventBus.$emit('showTicketStore', true, null);
    },
    closeMobileNav() {
      // if (this.variant !== 'desktop') EventBus.$emit('closeMobileNav');
      EventBus.$emit('closeMobileNav');
    },
    logout() {
      this.$Amplify.Auth.signOut()
        .then(() => AmplifyEventBus.$emit('authState', 'signedOut'))
        .then(() => {
          this.$store.dispatch('logout');
          EventBus.$emit('closeTicketStore');
        })
        // .then(() => Hub.dispatch('authState', { event: 'signedOut' }))
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped lang="scss">
  .navigation__main {
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: center;
  }
  .navigation__item {
    &:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
  .navigation__link {
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    position: relative;
    transition: .2s ease-in-out color;
    cursor: pointer;
    &.router-link-active {
      color: $kimberly;
      .navigation__icon,
      .navigation__icon path {
        fill: $kimberly !important;
      }
    }
    &:hover {
      color: $kimberly;
      .navigation__icon,
      .navigation__icon path {
        fill: $kimberly !important;
      }
    }

    &.navigation__link--profile svg path {
      fill: #fff;
    }
  }
  .navigation__icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    fill: #fff;
    transition: .2s ease-in-out fill;
    width: 20px;
  }
  .navigation--desktop {
    .navigation__main {
      text-align: left;
    }
    .navigation__link {
      text-transform: initial;
      padding-left: 38px;
      white-space: nowrap;
    }
    .navigation__site-language {
      justify-content: flex-start;
    }
    .button-lang:first-child {
      margin-left: 0;
    }
  }
  .navigation__site-language {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4rem;
    img {
      display: block;
      width: 22px;
    }
  }
  .notifications-count {
    position: absolute;
    z-index: 1;
    color: #000;
    font-size: 9px;
    font-weight: 800;
    background: #fbb13e;
    width: 12px;
    height: 12px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    top: -4px;
    left: 12px;

    &.mobile-view {
      position: absolute;
      right: -32px;
      left: unset;
      top: 6px;
      font-size: 14px;
      width: 20px;
      height: 20px;
    }
  }
  .button-lang {
    margin: 0 .5rem;
    cursor: pointer;
    border-radius: 50%;
    transition: .2s ease-in-out all;
    &:hover {
      box-shadow: 0px 0px 0px 3px $gradient-light-blue;
    }
  }
  // .diamonds-cta {
  //   position: absolute;
  //   bottom: 4rem;
  //   left: 50%;
  //   transform: translate(-50%, 0);
  // }
  @media (min-width: 1280px) {
    .navigation__item--only-mobile {
      display: none;
    }
    .navigation__site-language {
      display: none;
    }
  }
  @media (max-width: 1599px) {
    .navigation--desktop {
      .navigation__item {
        margin-bottom: 1.25rem;
      }
      .navigation__link {
        font-size: 12px;
        padding-left: 28px;
      }
      .navigation__icon {
        width: 20px;
      }
    }
  }
</style>
