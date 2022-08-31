<template>
  <div class="footer-wrapper">
    <div class="footer">
      <div v-if="!isAffiliate" class="footer__badge">
        <img svg-inline class="plus-18" src="@/assets/18-plus-badge.svg" alt="footer-badge" />
      </div>
      <div v-if="isAffiliate" class="footer__nav">
        <router-link class="footer__link" :to="{ name: 'AffiliatesHome' }">Affiliates Home</router-link>
        <router-link class="footer__link" :to="{ name: 'AffiliatesCommission' }">Commission</router-link>
        <router-link class="footer__link" :to="{ name: 'AffiliatesFAQ' }">FAQ</router-link>
        <router-link class="footer__link" :to="{ name: 'AffiliatesContact' }">Contact</router-link>
        <router-link class="footer__link" :to="{ name: 'AffiliatesTerms' }">Terms & conditions</router-link>
      </div>
      <div v-else class="footer__nav">
        <router-link class="footer__link" :to="{ name: 'AboutUs' }">About</router-link>
        <router-link class="footer__link" :to="{ name: 'Contact' }">Contact</router-link>
        <router-link class="footer__link" :to="{ name: 'CookiePolicy' }">Cookie policy</router-link>
        <!-- <router-link class="footer__link" :to="{ name: 'GameRules' }">Game rules</router-link> -->
        <!-- <router-link class="footer__link" :to="{ name: 'FAQ' }">FAQ</router-link> -->
        <router-link class="footer__link" :to="{ name: 'PrivacyPolicy' }">Privacy policy</router-link>
        <router-link class="footer__link" :to="{ name: 'TermsConditions' }">Terms & conditions</router-link>
      </div>
      <div class="footer__socials">
        <a target="_blank" rel="noindex nofollow" class="footer__social-link" href="https://www.facebook.com/tournamentprizes/">
          <img svg-inline src="@/assets/Facebook.svg" alt="Facebook Icon" />
        </a>
        <a target="_blank" rel="noindex nofollow" class="footer__social-link" href="https://www.instagram.com/tournament.ent/">
          <img svg-inline src="@/assets/Instagram.svg" alt="Instagram Icon" />
        </a>
        <a target="_blank" rel="noindex nofollow" class="footer__social-link" href="https://twitter.com/TournamentWins">
          <img svg-inline src="@/assets/Twitter.svg" alt="Twitter Icon" />
        </a>
        <a target="_blank" rel="noindex nofollow" class="footer__social-link" href="https://www.youtube.com/channel/UCSoNJ8e-ICHMS66hDL8GUpQ">
          <img svg-inline src="@/assets/YouTube.svg" alt="YouTube Icon" />
        </a>
        <a target="_blank" rel="noindex nofollow" class="footer__social-link" href="https://www.tiktok.com/@tournament_wins?lang=en">
          <img svg-inline src="@/assets/tiktok-logo.svg" alt="Tiktok Icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    isAffiliate() {
      return this.$route.path.includes('affiliate');
    },
  },
};
</script>

<style scoped lang="scss">
  .footer {
    display: flex;
    align-items: center;
    background-color: $navy;
    padding: 1.25rem 1rem;
    border-radius: 8px;
  }
  .plus-18 {
    width: 20px;
    display: block;
  }
  .footer__badge {
    flex: none;
    margin-left: 1rem;
  }
  .footer__nav {
    margin-left: 4rem;
    flex: none;
  }
  .footer__link {
    color: $kimberly;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    &:not(:last-child) {
      margin-right: 1.5rem;
    }
  }
  .footer__socials {
    flex: 1;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .footer__social-link {
    display: inline-block;
    &:not(:last-child) {
      margin-right: 1rem;
    }
    svg {
      height: 20px;
      width: 20px;
      display: block;

      path {
        fill: $kimberly;
      }
    }
  }
  @media (min-width: 1024px) and (max-width: 1215px) {
    .footer__nav {
      margin-left: 2rem;
    }
  }
  @media (min-width: 1280px) and (max-width: 1440px) {
    .footer__link {
      &:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
  @media (max-width: 1023px) {
    .footer-wrapper {
      .footer {
        background-color: transparent;
        flex-direction: column;
      }
      .footer__badge {
        margin-left: 0;
      }
      .footer__nav {
        margin: 3rem 0 3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .footer__socials {
        margin: 0;
      }
      .footer__link {
        margin-right: 0 !important;
        &:not(:last-child) {
          margin-bottom: 1rem;
        }
      }
    }
  }
  @media (min-width: 768px) and (max-width: 1279px) {
    .footer {
      margin-bottom: 87px;
    }
  }
  @media (max-width: 767px) {
    .footer {
      padding-bottom: 87px;
    }
  }
</style>
