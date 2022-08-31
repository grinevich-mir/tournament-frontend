<template>
  <div class="regular-content">
    <div class="container">
      <div class="regular-content__flex">
        <div class="regular-content__inner-col">
          <div class="logo" v-if="!['Login', 'Register'].includes($route.name)">
            <img @click="$router.push({ name: $store.state.auth.userData ? 'Lobby' : 'Home' })" svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
          </div>
          <div class="regular-content__content content">
            <a class="go-back" @click="goBack">← Back to Tournament</a>
            <br>
            <br>
            <slot />

            <br><br>
            <!-- <p>
              Tournament Entertainment Limited
              <br>Registered in Ireland with registered number 610593.
              <br>77 Sir John Rogersons’s Quay, Dublin 2, Ireland DO2 F540
              <br>VAT number: IE 3497687H
            </p> -->
            <a class="go-back" @click="goBack">← Back to Tournament</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StaticLayout',
  computed: {
    isLoggedIn() {
      return this.$store.getters.token;
    },
  },
  methods: {
    goBack() {
      if (this.isLoggedIn) this.$router.push({ name: 'Lobby' });
      else this.$router.push({ name: 'Home' });
      // return this.$router.go(-1);
    },
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
    height: 100%;
  }
  .logo {
    width: 400px;
    max-width: 100%;
  }
  .site-logo {
    display: block;
    cursor: pointer;
    width: 400px;
    max-width: 100%;
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
  .go-back {
    text-decoration: underline;
    cursor: pointer;
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
      padding: 1rem;
      min-height: 100vh;
      min-height: -webkit-fill-available;
    }
    .regular-content__content {
      margin-top: 1rem;
    }
    /deep/ .view-content h2:first-child {
      margin-top: 2rem;
    }
  }
</style>
