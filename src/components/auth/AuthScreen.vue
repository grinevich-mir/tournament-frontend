<template>
  <div class="auth__inner-col">
    <div class="logo">
      <img @click="$router.push({ name: 'Home' })" svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
    </div>
    <div class="auth__content">
      <LoginForm v-if="currentRoute === 'LoginOld'" />
      <RegForm v-else />
    </div>
    <div v-if="currentRoute === 'LoginOld'" class="help">
      Don't have an account? <router-link :to="{ name: 'Register' }">Sign Up</router-link>
    </div>
    <div v-else class="help">
      Already a member? <router-link :to="{ name: 'Login' }">Log In</router-link>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue';
import RegForm from '@/components/auth/RegForm.vue';

export default {
  name: 'AuthScreen',
  components: {
    LoginForm,
    RegForm,
  },
  props: ['currentRoute'],
};
</script>

<style lang="scss">
  // important styles just for auth forms
  @import '~@/scss/forms.scss';
  // auth page styles
  .auth {
    background-image: url('~@/assets/tournament-bg-desktop.jpg');
    background-repeat: no-repeat;
    background-size: 35% 100%;
    background-position: right;
  }
  .site-logo {
    display: block;
    cursor: pointer;
    width: 400px;
    max-width: 100%;
  }
  .auth__flex {
    display: flex;
  }
  .auth__inner-col {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    width: 400px;
  }
  .auth__content {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
  .t-form-wrapper {
    padding-top: 1rem;
  }
  .help {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    width: 400px;
    a {
      color: $kimberly;
      text-decoration: none;
    }
  }
  @media (max-width: 1599px) {
    .site-logo {
      width: 300px;
      max-width: 100%;
      margin: 0 auto;
    }
  }
  @media (max-width: 1024px) {
    .auth {
      background-image: url('~@/assets/t-bg-mobile.jpg');
      background-position: center;
      background-size: cover;
    }
    .regular-content__content {
      display: flex;
      justify-content: center;
    }
    .auth__flex {
      justify-content: center;
    }
  }
  @media (max-width: 767px) {
    .site-logo {
      width: 175px;
    }
    .auth__inner-col {
      width: 100%;
      padding: 1rem;
    }
    .t-form__sup-link {
      margin-top: 1.5rem;
      font-size: 14px;
    }
    .t-form__input,
    .t-form__input-label {
      font-size: 14px;
    }
    .help {
      width: auto;
      font-size: 14px;
    }
    .button--social {
      padding: .75rem;
      font-size: 14px;
    }
    .form-social-logo {
      height: 20px;
    }
    .t-form__row.thick-button {
      .button {
        padding: .75rem;
        font-size: 14px;
      }
    }
    .t-form__row:not(:last-child) {
      margin-bottom: 1.5rem;
    }
    .status-check {
      font-size: 12px;
    }
    .auth__flex {
      min-height: 100vh;
      min-height: -webkit-fill-available;
      background: linear-gradient(180deg, rgba(16,16,24,0) 0%, rgba(16,16,24,0) 90%, rgba(16,16,24,1) 100%);
    }
    .auth__inner-col {
      min-height: 100%;
      padding: 0;
    }
    .t-form-wrapper {
      margin: 0 auto;
    }
  }
</style>
