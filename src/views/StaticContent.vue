<template>
  <div class="regular-content">
    <div class="container">
      <div class="regular-content__flex">
        <div class="regular-content__inner-col">
          <div class="logo">
            <img @click="$router.push({ name: 'Home' })" svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
          </div>
          <div class="regular-content__content content">
            <Terms v-if="this.$route.name === 'TermsConditions'"/>
            <Contact v-if="this.$route.name === 'Contact'"/>
            <CookiePolicy v-if="this.$route.name === 'CookiePolicy'"/>
            <PrivacyPolicy v-if="this.$route.name === 'PrivacyPolicy'"/>
            <GameRules v-if="this.$route.name === 'GameRules'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Terms from '@/views/content-pages/Terms.vue';
import Contact from '@/views/content-pages/Contact.vue';
import CookiePolicy from '@/views/content-pages/CookiePolicy.vue';
import PrivacyPolicy from '@/views/content-pages/PrivacyPolicy.vue';
import GameRules from '@/views/content-pages/GameRules.vue';

export default {
  name: 'StaticContent',
  components: {
    Terms,
    Contact,
    CookiePolicy,
    PrivacyPolicy,
    GameRules,
  },
};
</script>

<style scoped lang="scss">
  .regular-content {
    background-image: url('~@/assets/tournament-bg-desktop.jpg');
    background-repeat: no-repeat;
    background-size: 35% 100%;
    background-position: right;
    background-attachment: fixed;
  }
  .regular-content__content {
    margin-top: 2rem;
    color: #fff;
    line-height: 1.5;
  }
  .site-logo {
    display: block;
    cursor: pointer;
  }
  .regular-content__flex {
    display: flex;
    padding-right: 40%;
  }
  .regular-content__inner-col {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
  }
  .site-logo {
    width: 400px;
    max-width: 100%;
  }
  @media (max-width: 1024px) {
    .regular-content {
      position: relative;
      &::before {
        content: '';
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: url('~@/assets/t-bg-mobile.jpg');
        background-position: center;
        background-size: cover;
      }
    }
    .regular-content__flex {
      justify-content: center;
      padding-right: 0;
    }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    .regular-content__flex {
      padding: 0 1rem;
    }
  }
  @media (max-width: 767px) {
    /deep/ h1 {
      font-size: 20px;
    }
    .site-logo {
      width: 175px;
      margin: 0 auto;
    }
    .regular-content__inner-col {
      width: 100%;
      padding: 3rem 1rem;
    }
    .regular-content__content {
      margin-top: 1rem;
    }
    /deep/ .view-content h2:first-child {
      margin-top: 2rem;
    }
  }
</style>
