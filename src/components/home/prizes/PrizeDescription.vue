<template>
  <div class="prize-description">
    <div class="loader" v-if="!description">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="desc" v-else>
      <h3>{{description.heading}}</h3>
      <div v-html="description.content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrizeDescription',
  props: ['description'],
  computed: {
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
  },
};
</script>

<style scoped lang="scss">
  .prize-description {
    text-align: center;
    z-index: 1;
    max-width: 855px;
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: initial;

    & h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      line-height: 29px;
      max-width: 855px;
    }

    & .button {
      font-weight: 600;
      font-size: 14px;
      line-height: 26px;
      padding: 8px 40px;
    }
  }
  @media (min-width: 768px) {
    .prize-description {
      margin-top: 20px;
      & h3 {
        font-size: 26px;
        font-weight: 700;
        line-height: 42px;
        text-transform: uppercase;
      }
      & .desc p {
        font-size: 16px;
        margin-top: 40px;
        font-weight: 400;
        line-height: 26px;
      }
    }
  }
</style>

<style lang="scss">
  .prize-description {
    & .desc {
      max-width: 855px;
      & p {
        font-weight: 500;
        font-size: 12px;
        line-height: 19px;
        margin-top: 20px;
        margin-bottom: 0;
      }
    }
  }
  @media (min-width: 768px) {
    .prize-description {
      & .desc p {
        font-size: 16px;
        margin-top: 40px;
        font-weight: 400;
        line-height: 26px;
      }
    }
  }
</style>
