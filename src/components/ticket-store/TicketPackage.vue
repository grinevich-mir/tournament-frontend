<template>
  <div class="diamonds__item">
    <!-- :class="[ item.tag ? 'featured' : null, item.tag ? item.tag.toLowerCase() : null ]"> -->
    <!-- <p v-if="item.tag" class="diamonds__tag">{{ getTagText(item.tag) }}</p> -->
    <img class="diamonds__item-image" svg-inline src="@/assets/ticket-icon.svg" alt="Tickets">
    <div class="package-info">
      <p class="price">{{formatMoney(item.price, 'USD')}}</p>
      <p class="package-name">{{item.name}}</p>
    </div>
    <div class="divider"></div>
    <!-- <img class="diamonds__item-image" svg-inline :src="item.imageUrl" alt=""> -->
    <Button class="diamonds__item-button" text="BUY NOW" variant="rounded-blue" @clicked="buy(item)" :disabled="isLoading" />
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'TicketPackage',
  components: {
    Button,
  },
  props: ['item', 'buy', 'isLoading'],
  methods: {
    getTagText(tag) {
      switch (tag) {
        case 'BestValue':
          return 'Best Value';
        default:
          return tag;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .diamonds__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    padding: 12px 10px;
    background-color: #2F2F45;
    border: 1px solid transparent;
    position: relative;
    border-radius: 10px;
    width: 100%;
    max-width: 580px;
    &.featured {
      .diamonds__tag {
        color: #fff;
        position: absolute;
        transform: translateX(-50%);
        left: 50%;
        top: -11px;
        border-radius: 10px;
        padding: 5px;
        text-align: center;
        width: 125px;
        font-size: 10px;
        font-weight: bold;
        background-color: #fff;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 0 0.4px #1f1f1fd6;
      }
      &.bestvalue {
        border-color: $gradient-light-gold;
        .diamonds__tag {
          background: $gold-gradient-vertical;
        }
        //  .diamonds__item-button {
        //    background: $gold-gradient-vertical;
        //  }
      }
      &.popular {
        border-color: #b1bfd8;
        .diamonds__tag {
          color: #fff;
          background: $silver-gradient-diagonal;
        }
        // .diamonds__item-button {
        //   background: $silver-gradient-diagonal;
        // }
      }

      &.recommended {
        border-color: #5182c1;
        .diamonds__tag {
          color: #fff;
          background: $blue-gradient-diagonal;
        }
        // .diamonds__item-button {
        //   background: $blue-gradient-diagonal;
        // }
      }
    }
    & .package-info {
      min-width: 43%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 20px;
      text-align: left;
      color: #fff;
      & .price {
        font-size: 25px;
        font-weight: 900;
        line-height: 40px;
        margin-bottom: 10px;
      }
      & .name {
        font-size: 14px;
        font-weight: 400;
        line-height: 26px;
      }
    }
    & .divider {
      width: 2px;
      height: 100%;
      background-color: #0D7EE8;
      border-radius: 1px;
      margin-right: 20px;
    }
  }
  @media (min-width: 768px) {
    .diamonds__item-button {
      // flex: none;
      padding: 12px 10px;
    }
    .divider {
      margin-right: 30px !important;
    }
  }
  @media (max-width: 767px) {
    .diamonds__item {
      max-width: 380px;
    }
  }
  @media (max-width: 575px) {
    .diamonds__item {
      & .package-info {
        min-width: 48%;
        & .price {
          margin-bottom: 2px;
          font-size: 22px;
        }
        & .package-name {
          font-size: 14px;
        }
      }
    }
  }
  @media (max-width: 350px) {
    .diamonds__item {
      & .diamonds__item-image {
        width: 26px;
      }
      & .package-info {
        min-width: 47%;
        padding: 2px 14px;
        height: auto;
        & .price {
          font-size: 18px;
          margin-bottom: 5px;
          line-height: 28px;
        }
        & .package-name {
          font-size: 12px;
        }
      }
      & .divider {
        height: 78%;
        margin-right: 14px;
      }
      & .diamonds__item-button {
        font-size: 12px;
        padding-top: 12px;
        padding-bottom: 12px;
        // min-width: 136px;
      }
    }
  }
</style>
