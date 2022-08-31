<template>
  <div class="join" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="join__overlay">
      <div class="hero__header" v-if="!isMobile">
        <img svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
        <div class="dskt-btns">
          <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Register' })" text="SIGN UP" variant="outlined-white"/>
          <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Login' })" text="LOG IN" variant="rounded-blue"/>
        </div>
      </div>
      <div class="loader" v-if="!content">
        <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
      <template v-else>
        <img :src="imageUrlFor(content.logo)" alt="Dream Chaser">
        <h1 v-html="content.heading" :style="{ color: content.headingColor.hex }"></h1>
        <p>{{content.subheading}}</p>
        <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Register' })" text="ENTER NOW" variant="rounded-pink"/>
         <!-- :style="{ background: content.headingColor.hex }" -->
      </template>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

import sanity from '@/sanity';
import imageUrlBuilder from '@sanity/image-url';

const imageBuilder = imageUrlBuilder(sanity);

export default {
  name: 'Join',
  props: ['content'],
  components: {
    Button,
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    backgroundImage() {
      // return this.isMobile ? bgMobile : bgDesktop;
      if (!this.content) return null;
      return this.imageUrlFor(this.isMobile ? this.content.imageMobile : this.content.imageDesktop).url();
    },
  },
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },
  },
};
</script>

<style scoped lang="scss">
  .join {
    margin-bottom: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    display: flex;
    & .join__overlay {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(23, 33, 53, 0.6) 0%, #172135 100%);
      padding: 70px 20px;
      position: relative;
      & .hero__header {
        width: 100%;
        max-width: 1440px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        position: absolute;
        top: 0;
        .site-logo {
          display: block;
          margin: 0;
          width: 200px;
          height: auto;
        }
        .dskt-btns {
          .button {
            flex: none;
            padding: 6px 30px 6px 30px;
            font-size: 14px;
            font-weight: 600;
            line-height: 26px;
            width: fit-content;
            &:first-of-type {
              margin-right: 16px;
            }
          }
        }
      }
      & h1 {
        font-size: 56px;
        font-weight: 800;
        line-height: 60px;
        // color: #FF00BE;
        margin: 10px 0;
      }
      & p {
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        margin-top: 0;
        margin-bottom: 20px;
      }
      & .button {
        font-size: 14px;
        font-weight: 600;
        line-height: 26px;
        padding: 11px 33px;
        width: 230px;
        flex: none;
      }
    }
  }
  @media (min-width: 768px) {
    .join {
      & .join__overlay {
        min-height: 860px;
        & h1 {
          font-size: 96px;
          line-height: 100px;
          margin: 16px 0;
        }
        & p {
          font-size: 22px;
          line-height: 36px;
          max-width: 410px;
          margin-bottom: 32px;
        }
        & img {
          width: 360px;
          height: 52px;
        }
      }
    }
  }
</style>
