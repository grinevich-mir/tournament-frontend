<template>
  <div class="affiliates-layout">
    <div class="affiliates__header mobile-nav__top">

      <div class="mobile-nav__burger">
        <div class="hamburger hamburger--slider" :class="{ 'is-active' : activeMenu  }" @click="activateMenu">
          <div class="hamburger-box">
            <div class="hamburger-inner"></div>
          </div>
        </div>
      </div>

      <img @click="$router.push({ name: 'Home' })" svg-inline src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />

      <template v-if="!isMobile">
        <div class="affiliates__nav">
          <router-link :to="{ name: 'AffiliatesHome' }">Affiliates Home</router-link>
          <router-link :to="{ name: 'AffiliatesCommission' }">Commission</router-link>
          <router-link :to="{ name: 'AffiliatesFAQ' }">FAQ</router-link>
          <router-link :to="{ name: 'AffiliatesContact' }">Contact</router-link>
          <router-link :to="{ name: 'AffiliatesTerms' }">Terms</router-link>
        </div>

        <div class="affiliates__actions">
          <a class="affiliates__link login" href="https://affiliates.tournament.com/login.asp">Login</a>
          <a class="affiliates__link register" href="https://affiliates.tournament.com/registration.asp">Sign up</a>
        </div>
      </template>
    </div>

    <div class="affiliates__mobile-nav" v-if="activeMenu">
      <router-link @click.native="activateMenu" class="affiliates__nav-link" :to="{ name: 'AffiliatesHome' }" exact>Affiliates Home</router-link>
      <router-link @click.native="activateMenu" class="affiliates__nav-link" :to="{ name: 'AffiliatesCommission' }" exact>Commission</router-link>
      <router-link @click.native="activateMenu" class="affiliates__nav-link" :to="{ name: 'AffiliatesFAQ' }" exact>FAQ</router-link>
      <router-link @click.native="activateMenu" class="affiliates__nav-link" :to="{ name: 'AffiliatesContact' }" exact>Contact</router-link>
      <router-link @click.native="activateMenu" class="affiliates__nav-link" :to="{ name: 'AffiliatesTerms' }" exact>Terms</router-link>
      <hr>
      <router-link @click.native="activateMenu" class="affiliates__nav-link" :to="{ name: 'Home' }" exact>Back to Tournament</router-link>
    </div>

    <div class="affiliates__content">
      <slot />
    </div>

    <div class="affiliates__footer">
      <div class="container">
        <Footer/>
        <Copyright/>
      </div>
    </div>
  </div>
</template>

<script>
import Footer from '@/components/global/Footer.vue';
import Copyright from '@/components/global/Copyright.vue';

export default {
  name: 'AffiliatessLayout',
  components: {
    Footer,
    Copyright,
  },
  data() {
    return {
      activeMenu: false,
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
  },
  methods: {
    activateMenu() {
      this.activeMenu = !this.activeMenu;
      document.body.classList.toggle('no-scroll');
    },
  },
};
</script>

<style lang="scss" scoped>
  .affiliates-layout {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-height: 100vh;
    color: #fff;

    & .affiliates__header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 2rem;

      & svg {
        cursor: pointer;
        width: 240px;
      }

      & .affiliates__nav {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 500px;

        & .router-link-exact-active {
          text-decoration: none;
        }
      }

      & .affiliates__link {
        padding: 8px 14px;
        border-radius: 50px;
        font-size: 10px;
        color: #fff;
        font-weight: 600;
        letter-spacing: 1.7px;
        text-decoration: none;
        text-transform: uppercase;

        &.login {
          background: transparent;
          border: 2px solid $blue;
        }

        &.register {
          background-color: $blue;
          border: 2px solid $blue;
          margin-left: 15px;
        }
      }
    }

    & .affiliates__mobile-nav {
      height: 100vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 4rem 0;

      & .affiliates__nav-link {
        color: #fff;
        margin: 1rem 0;
        text-transform: uppercase;
        font-weight: 600;
        font-size: 26px;
        text-decoration: none;
        cursor: pointer;
        transition: .2s ease-in-out color;

        &.router-link-exact-active {
          color: $kimberly;
        }

        &:hover {
          color: $kimberly;
        }
      }

      & hr {
        margin-top: 4rem;
      }
    }

    & .affiliates__content {
      padding: 2rem;
      max-width: 980px;
    }

    & .affiliates__footer {
      margin: 6rem 0 2rem;
      width: 100%;

      .copyright {
        margin: 2rem 0;
      }
    }
  }

  @media (max-width: 1023px) {
    .affiliates-layout {
      & .affiliates__header {
        justify-content: center;
      }
    }
  }

  @media (max-width: 575px) {
    .affiliates-layout {
      & .affiliates__header {
        justify-content: flex-end;
      }
    }
  }

  @media (max-width: 350px) {
    .affiliates-layout .affiliates__header svg {
      width: 200px;
    }
  }
</style>
