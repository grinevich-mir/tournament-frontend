<template>
  <div class="auth-layout">
    <div class="auth__header">
      <img @click="$router.push({ name: $store.state.auth.userData ? 'Lobby' : 'Home' })" svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
      <template v-if="!$store.state.auth.user">
        <router-link v-if="$route.name === 'Register'" :to="{ name: 'Login' }" class="auth__link">Sign in</router-link>
        <router-link v-else :to="{ name: 'Register' }" class="auth__link">Sign up</router-link>
      </template>
    </div>

    <div class="auth__content" :class="$route.name.toLowerCase()">
      <slot />
    </div>

    <div class="auth__footer">
      <p>Have any questions? <a href="mailto:support@tournament.com">Contact us</a>.</p>
      <div class="auth__footer-nav">
        <!-- <router-link class="auth__footer-link" :to="{ name: 'FAQ' }">FAQ</router-link> -->
        <router-link class="auth__footer-link" :to="{ name: 'TermsConditions' }">Terms and conditions</router-link>
        <router-link class="auth__footer-link" :to="{ name: 'CookiePolicy' }">Cookie policy</router-link>
        <!-- <router-link class="auth__footer-link" :to="{ name: 'GameRules' }">Game Rules</router-link> -->
        <router-link class="auth__footer-link" :to="{ name: 'PrivacyPolicy' }">Privacy policy</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
};
</script>

<style scoped lang="scss">
  .auth-layout {
    background-color: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    & .auth__header {
      padding: 2rem 4rem;
      border-bottom: 1px solid #CCC;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      & .site-logo {
        display: block;
        cursor: pointer;
        width: 300px;
        max-width: 100%;

        & path:first-child {
          fill: #000;
        }
      }

      & .auth__link {
        text-decoration: none;
        color: #000;

        &:hover {
          text-decoration: underline;
          // font-weight: bold;
        }
      }
    }

    & .auth__content {
      width: 100%;
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem 0;

      background-image: url('~@/assets/auth-bg-desktop.svg');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 0 -70px;
    }

    & a {
      color: #4E4E4E;
      text-decoration: none;

      &:hover {
        color: #333;
        text-decoration: underline;
      }
    }

    & .auth__footer {
      background-color: #F3F3F3;
      border-top: 1px solid #EAEAEA;
      width: 100%;
      padding: 2rem 4rem;
      color: #4E4E4E;

      & .auth__footer-nav {
        margin-top: 2rem;
        display: flex;
        flex-wrap: wrap;
        line-height: 1.5;
        justify-content: space-between;
        max-width: 100%;
        max-width: 600px;

        & .auth__footer-link {
          color: #757575;
          font-size: 14px;
          // margin-right: 1rem;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  @media (max-width: 767px) {
    .auth-layout {
      & .auth__header {
        border-bottom: none;
        padding: 2rem;
        padding-top: 1.5rem;

        & .site-logo {
          max-width: 166px;
        }
      }
      & .auth__content {
        padding: 1rem;
        background-size: 130%;

        &.login {
          // background-image: url('~@/assets/login-bg-mobile.svg');
          background-image: none;
          background-position: -35px 0;
        }
        &.register {
          // background-image: url('~@/assets/register-bg-mobile.svg');
          background-image: none;
          background-position: -35px -60px;
        }
      }
      & .auth__footer {
        padding: 2rem;
      }
    }

    .auth__footer-nav {
      flex-direction: column;
    }
  }
</style>
