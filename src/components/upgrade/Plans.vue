<template>
  <div class="plans">
    <div class="upgrade__title">
      <p v-if="fromRegister" class="step">Step 2 of 3</p>
      <h2>Choose the plan that's right for you</h2>
      <!-- <p class="upgrade__subtitle">To access the big prize games select premium.</p> -->
    </div>

    <div class="plans__names">
      <div class="plan" :class="{ selected: selected === 'basic' }" @click="selected = 'basic'">Basic</div>
      <div class="plan" :class="{ selected: selected === 'premium' }" @click="selected = 'premium'">Premium</div>
    </div>

    <div class="plans__features">
      <div class="feature">
        <p class="feature__name">Monthly price</p>
        <div class="feature__values">
          <p class="feature__value" :class="{ selected: selected === 'basic' }">$0.00</p>
          <p class="feature__value" :class="{ selected: selected === 'premium' }">${{price}}</p>
        </div>
      </div>

      <div class="feature">
        <p class="feature__name">Mega Prizes ($100k and more)</p>
        <div class="feature__values">
          <p class="feature__value" :class="{ selected: selected === 'basic' }"><img svg-inline src="@/assets/cross.svg"></p>
          <p class="feature__value" :class="{ selected: selected === 'premium' }"><img svg-inline src="@/assets/check.svg"></p>
        </div>
      </div>

      <div class="feature">
        <p class="feature__name">Maximum wins (p/m)</p>
        <div class="feature__values">
          <p class="feature__value" :class="{ selected: selected === 'basic' }">$200</p>
          <p class="feature__value" :class="{ selected: selected === 'premium' }">Unlimited</p>
        </div>
      </div>

      <div class="feature">
        <p class="feature__name">Maximum withdrawal time</p>
        <div class="feature__values">
          <p class="feature__value" :class="{ selected: selected === 'basic' }">30 days</p>
          <p class="feature__value" :class="{ selected: selected === 'premium' }">7 days</p>
        </div>
      </div>

      <div class="feature">
        <p class="feature__name">Number of weekly chances to win</p>
        <div class="feature__values">
          <p class="feature__value" :class="{ selected: selected === 'basic' }">50</p>
          <p class="feature__value" :class="{ selected: selected === 'premium' }">500+</p>
        </div>
      </div>

      <div class="feature">
        <p class="feature__name">Chat and community</p>
        <div class="feature__values">
          <p class="feature__value" :class="{ selected: selected === 'basic' }"><img svg-inline src="@/assets/cross.svg"></p>
          <p class="feature__value" :class="{ selected: selected === 'premium' }"><img svg-inline src="@/assets/check.svg"></p>
        </div>
      </div>

    </div>

    <div class="upgrade__actions">
      <Button
        text="Continue"
        variant="rounded-blue"
        @clicked="next"
      />
    </div>

    <!-- <template v-if="selected === 'basic'">
      <p class="plans__disclaimer">
        We ask card details from all players (even free players) for age verification reasons.
        We also try to pay winnings out to cards where possible.
      </p>
    </template> -->
    <template v-if="selected === 'basic'">
      <p class="plans__disclaimer">Clicking Continue will take you to our Lobby where you can take part in our free play games.</p>
      <p class="plans__disclaimer">You can become a Premium Member at any time by clickning Start Membership</p>
    </template>
    <template v-if="selected === 'premium'">
      <p class="plans__disclaimer">Clicking Continue will take you to our secure sign-up page where you can enter your details.</p>
      <p class="plans__disclaimer">You're just a minute away from all the benefits our Premium Members enjoy every month.</p>
    </template>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'Plans',
  props: ['fromRegister', 'setStep'],
  components: {
    Button,
  },
  data() {
    return {
      selected: 'premium',
      price: process.env.VUE_APP_SUBSCRIPTION_PRICE,
    };
  },
  methods: {
    next() {
      if (this.selected === 'premium') return this.setStep(2);
      if (this.selected === 'basic') return this.$router.push({ name: 'Lobby' });
      // if (this.selected) {
      //   return this.setStep(2, this.selected);
      // }
      return console.error('unknown plan selected');
    },
  },
};
</script>

<style lang="scss" scoped>
  .plans {
    .plans__names {
      display: flex;
      justify-content: space-between;

      .plan {
        height: 87px;
        background-color: #7CB2EC;
        font-weight: 600;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        border-radius: 10px;
        cursor: pointer;
        position: relative;

        &:first-of-type {
          margin-right: 5px;
        }&:last-of-type {
          margin-left: 5px;
        }

        &:hover {
          background-color: $blue;
        }

        &.selected {
          background-color: $blue;

          &::after {
            content:'';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -8px;
            width: 0;
            height: 0;
            border-top: solid 12px $blue;
            border-left: solid 8px transparent;
            border-right: solid 8px transparent;
          }
        }
      }
    }

    .plans__features {
      margin-top: 1rem;
      margin-bottom: 1.5rem;

      .feature {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid $light-grey;
        padding: 10px 0;
        margin-bottom: 1rem;

        .feature__name {
          flex: 1;
          text-align: center;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .feature__values {
          display: flex;
          justify-content: space-around;

          & .feature__value {
            color: $light-grey;
            text-align: center;
            flex: 1;

            & svg {
              width: 13px;
              & path {
                fill: $light-grey;
              }
            }

            &.selected {
              color: $blue;

              & svg path {
                fill: $blue;
              }
            }
          }
        }
      }
    }
    .plans__disclaimer {
      margin-top: 1.5rem;
      font-size: 10px;
      color: #595959;
      line-height: 1.5;

      + .plans__disclaimer {
        margin-top: 1rem;
      }
    }
  }

</style>
