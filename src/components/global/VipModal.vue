<template>
  <div class="vip-modal" :class="`vip-modal--${mode}`">
    <img svg-inline class="modal-close" src="@/assets/close.svg" alt="close-icon" @click="closeModal" />
    <div class="vip-col content">
      <div class="vip-benefits-top">
        <template v-if="mode === 'cancel'">
          <h1 class="vip-heading">Wait a minute!</h1>
          <p class="vip-benefits-p">Don't go just yet, look at all the wonderful benefits you'll lose if you cancel your subscription.</p>
          <p class="vip-benefits-p">We're so confident you'll want to stay longer we're happy to offer you a free month on us just to say thank you for keeping your subscription active.</p>
          <p class="vip-benefits-p">Click on the Accept Offer button below to take advantage of this amazing deal, alternatively it will make us sad to see you go but it's been great having you as a member.</p>
        </template>
        <template v-else>
          <h1 class="vip-heading">Membership Access</h1>
          <p class="vip-benefits-p">Get access to premium games and exclusive bonuses</p>
        </template>
      </div>
      <div class="vip-benefits">
        <h4 v-if="mode === 'cancel'" class="vip-other-heading">Keep your advantages</h4>
        <h4 v-else class="vip-other-heading">You will get</h4>
        <p v-for="(benefit, index) in benefits" v-html="benefit" :key="`benefit-${index}`"></p>
      </div>
      <div v-if="mode === 'cancel'" class="vip-btns">
        <Button text="Accept Offer" variant="orange" @clicked="$emit('acceptOffer')"/>
        <a href="#" @click="$event.preventDefault(); $emit('cancelSub');">No thanks, cancel my subscription</a>
      </div>
      <template v-else>
        <Button @clicked="$router.push({ name: 'Upgrade' })" text="Start Membership" variant="green"/>
      </template>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'VipModal',
  props: {
    mode: {
      type: String,
      default: 'vip',
    },
  },
  components: {
    Button,
  },
  computed: {
    benefits() {
      return this.$store.getters.benefits;
    },
  },
  data() {
    return {
      games: [
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
        {
          name: 'Leaderboard',
          variant: 'hilo',
          type: 'Hi-Lo',
          desc: 'Choose higher or lower than current number to win real prizes',
        },
      ],
    };
  },
  methods: {
    closeModal() {
      document.body.classList.remove('vip-modal-opened');
      this.$emit('modalClosed');
    },
  },
};
</script>

<style scoped lang="scss">
  svg.modal-close {
    position: absolute;
    width: 20px;
    fill: #fff;
    right: 1rem;
    top: 1rem;
  }
  .vip-heading {
    font-weight: 700;
    background: $orange-gradient;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
  .vip-benefits-p {
    text-align: center;
  }
  .vip-modal {
    padding: 6rem 2rem;
    color: $kimberly;
    font-weight: 500;
    display: flex;
  }
  .vip-games-slider {
    display: flex;
    justify-content: center;
    align-items: center;
    .slider-item {
      margin: 0 .5rem;
      /deep/ h2 {
        font-size: 1rem;
      }
      /deep/ p {
        font-size: 10px;
        font-weight: normal;
      }
    }
  }
  .vip-benefits {
    margin-top: 2rem;
    p {
      line-height: 1.5;
      margin-bottom: .25rem !important;
    }
  }
  .vip-other-heading {
    color: #fff;
  }
  .vip-benefits-p,
  .vip-benefits p,
  .vip-basket__product,
  .vip-checkout__terms {
    font-size: 14px;
  }
  .vip-input {
    font-size: 12px;
    font-weight: 500;
    padding: .75rem;
    width: 100%;
    background-color: $light-navy;
    color: $kimberly;
    border-radius: 0 !important;
    &::placeholder {
      color: $kimberly;
    }
  }
  .vip-input--row:not(:last-child) {
    margin-bottom: .5rem;
  }
  .vip-input-grp {
    display: flex;
    justify-content: space-between;
    .vip-input {
      flex-basis: calc(50% - .25rem);
    }
  }
  .vip-modal {
    position: fixed;
    top: 150%;
    background: #1a1a2a;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
    z-index: 99999;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
    transition: 0.3s all ease-in-out;
    opacity: 0;
  }
  .vip-modal-opened .vip-modal {
    top: 0 !important;
    opacity: 1;
  }
  .vip-col.content {
    max-width: 100%;
    margin: auto;
    width: 900px;
  }
  .vip-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .vip-col .button {
    flex: none;
    margin-top: 1rem;
  }
  .vip-benefits {
    width: 100%;
    margin-top: 2rem !important;
  }
  .slider-item {
    &:not(:nth-child(3)) {
      opacity: 0.3;
    }
    &:nth-child(2), &:nth-child(4) {
      transform: scale(0.85);
    }
    &:nth-child(1), &:nth-child(5) {
      display: none;
    }
    &:nth-child(2) {
      right: -13px;
    }
    &:nth-child(4) {
      left: -13px;
    }
  }
  .vip-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.5rem;
    margin-left: -.5rem;
    margin-right: -.5rem;
  }
  .vip-btns .button, .vip-btns a {
    margin: 0 .5rem !important;
  }
  .vip-btns a {
    color: #fff;
    font-size: 12px;
  }
  .vip-btns a {
    font-size: 10px;
  }

  @media (max-width: 767px) {
    .vip-modal {
      padding: 1rem;
    }
    .vip-games-slider {
      width: 150vw;
      position: relative;
      left: calc(-50% + ((50vw - 4rem) / 2));
    }
    .vip-games-slider-outer {
      // overflow: hidden;
      // margin-left: -1rem;
      // margin-right: -1rem;
    }
    .slider-item {
      &:not(:nth-child(3)) {
        opacity: 0.3;
      }
      &:nth-child(2), &:nth-child(4){
        transform: scale(0.85);
      }
      &:nth-child(1), &:nth-child(5){
        transform: scale(0.7);
        opacity: 0.2;
      }
      &:nth-child(2) {
        right: -13px;
      }
      &:nth-child(4) {
        left: -13px;
      }
      &:nth-child(1) {
        right: -3.75rem;
      }
      &:nth-child(5) {
        left: -3.75rem;
      }
      /deep/ .slider-item__top {
        height: 100px;
      }
    }
    .vip-heading {
      text-align: center;
    }
    .vip-benefits-p {
      text-align: center;
    }
    .vip-benefits-p,
    .vip-benefits p,
    .vip-basket__product, {
      font-size: 12px;
    }
    .vip-other-heading {
      font-size: 16px !important;
      margin-top: -5px !important;
    }
    .vip-btns .button {
      flex: 1 !important;
    }
    .vip-modal--cancel .vip-games-slider-outer {
      display: none;
    }
    .vip-modal--cancel .vip-heading, .vip-modal--cancel .vip-benefits-p {
      text-align: left;
    }
    .vip-modal--cancel .vip-benefits {
      margin-top: 1.5rem !important;
    }
  }
</style>
