<template>
  <div class="guest404">
    <div class="container">
      <div class="guest404__flex">
        <div class="guest404__inner-col">
          <div class="logo">
            <img svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
          </div>
          <div class="guest404__content">
            <div class="message-404">
              <h1>404</h1>
              <p>The page you are looking for is missing…</p>
              <div class="button-404">
                <Button @clicked="goLogin" variant="rounded-blue" text="Go back"/>
              </div>
            </div>
          </div>
          <div class="help">
            Need <span class="help-link"><router-link to='/'>help</router-link></span>?
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'Guest404',
  components: {
    Button,
  },
  methods: {
    goLogin() {
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>

<style scoped lang="scss">
  .guest404 {
    background-image: url('~@/assets/tournament-bg-desktop.jpg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right;
  }
  .site-logo {
    display: block;
  }
  .guest404__flex {
    display: flex;
  }
  .guest404__inner-col {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 6rem 0;
  }
  .message-404 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: 700;
    h1 {
      color: #fff;
      font-size: 150px;
      line-height: 1;
      margin: 0;
    }
    p {
      color: #fff;
      margin-bottom: 3rem;
      font-size: 12px;
    }
  }
  .button-404 {
    width: 200px;
    display: flex;
  }
  .help {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
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
  @media (min-width: 1025px) and (max-width: 1215px) {
    .guest404 {
      background-position-x: 65vw;
    }
  }
  @media (max-width: 1024px) {
    .guest404 {
      background-image: url('~@/assets/t-bg-mobile.jpg');
      background-position: center;
      background-size: cover;
    }
    .guest404__flex {
      justify-content: center;
    }
  }
  @media (max-width: 767px) {
    .site-logo {
      width: 175px;
    }
    .guest404__inner-col {
      width: 100%;
      padding: 3rem 1rem;
    }
    .help {
      font-size: 14px;
      margin-top: 1.5rem;
    }
    .guest404__flex {
      min-height: 100vh;
      min-height: -webkit-fill-available;
    }
    .guest404__inner-col {
      min-height: 100%;
    }
    .message-404 {
      h1 {
        font-size: 100px;
      }
      p {
        margin-bottom: 2rem;
      }
    }
  }
</style>
