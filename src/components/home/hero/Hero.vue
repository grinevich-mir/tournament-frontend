<template>
  <div class="hero">
    <div class="hero__header" v-if="isMobile">
      <img svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
      <Button v-if="isMobile" class="to-login gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Login' })">
        <template v-slot:text>
          LOG IN<img svg-inline src="@/assets/user-icon.svg">
        </template>
      </Button>
      <template v-else>
        <div class="dskt-btns">
          <!-- <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Register' })" text="SIGN UP" variant="outlined-white"/> -->
          <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Login' })" text="LOG IN" variant="rounded-blue"/>
        </div>
      </template>
    </div>
    <Join :content="content"/>
    <img src="@/assets/home-bg-elements/home-bg-rect-2-left.svg" class="bg-element left">
    <img src="@/assets/home-bg-elements/home-bg-rect-3-right.svg" class="bg-element right">
    <img src="@/assets/home-bg-grid.svg" class="bg-element grid left">
    <img src="@/assets/home-bg-grid.svg" class="bg-element grid right">
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';
import Join from './Join.vue';

export default {
  name: 'Hero',
  props: ['content'],
  components: {
    Join,
    Button,
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
  },
};
</script>

<style scoped lang="scss">
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: relative;
    .hero__header {
      width: 100%;
      // max-width: 1440px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;

      .to-login {
        display: flex;
        align-items: center;
        background: transparent;
        color: #fff;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 12px;
        line-height: 26px;
        padding: 0;
        flex: unset !important;
        box-shadow: none;
        & svg {
          margin-left: 10px;
          flex: 1;
        }
      }
    }
    .site-logo {
      display: block;
      margin: 0;
      width: 162px;
      height: auto;
    }

    .dskt-btns {
      .button {
        flex: none;
        padding: 6px 30px 6px 30px;
        font-size: 14px;
        font-weight: 600;
        line-height: 26px;
        // &:first-of-type {
        //   margin-right: 16px;
        // }
      }
    }
    .bg-element {
      position: absolute;
      transform: scale(1.3);
      opacity: 0;
      &.left {
        left: 0;
        transform-origin: left;
        bottom: -600px;
      }
      &.right {
        right: 0;
        transform-origin: right;
        bottom: -800px;
      }
      &.grid {
        opacity: 0 !important;
        transform: scale(2);
        &.left {
          bottom: -600px;
          left: 20vw;
        }
        &.right {
          bottom: -250px;
          right: 20vw;
        }
      }
    }
  }
  @media (min-width: 2700px) {
    .hero {
      .bg-element.grid {
        opacity: 1 !important;
      }
    }
  }
  @media (min-width: 1599px) {
    .hero {
      .hero__header {
        justify-content: center;
        position: relative;
        svg {
          min-width: 225px;
        }
        .dskt-btns {
          position: absolute;
          right: 60px;
        }
      }
      .bg-element {
        opacity: 1;
      }
    }
  }
  @media (min-width: 767px) {
    .hero {
      .hero__header {
        padding: 26px 60px;
        .site-logo {
          width: 200px;
        }
      }
    }
  }
</style>
