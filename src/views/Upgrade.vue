<template>
  <div class="upgrade">
    <template v-if="step === 0">
      <div class="upgrade__title">
        <p v-if="fromRegister" class="step">Step 2 of 3</p>
        <h2>Choose your plan</h2>
      </div>

      <div class="upgrade__input">
        <p><img svg-inline src="@/assets/check-blue.svg" class="upgrade__check"/>Choose between a basic and paid plan.</p>
        <p><img svg-inline src="@/assets/check-blue.svg" class="upgrade__check"/>No commitments, cancel anytime.</p>
        <p><img svg-inline src="@/assets/check-blue.svg" class="upgrade__check"/>Play across all your devices.</p>
      </div>

      <div class="upgrade__actions">
        <Button
          text="See Plans"
          variant="rounded-blue"
          @clicked="setStep(1)"
        />
      </div>
    </template>

    <Plans
      v-if="step === 1"
      :set-step="setStep"
      :from-register="fromRegister"
    />
    <Payment
      v-if="step === 2"
      :set-step="setStep"
      :from-register="fromRegister"
      :selected-plan="plan"
    />

    <div v-if="isLoading" class="upgrade__loading-overlay">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import Plans from '@/components/upgrade/Plans.vue';
import Payment from '@/components/upgrade/Payment.vue';
import Button from '@/components/global/Button.vue';
import EventBus from '@/helpers/event-bus';

export default {
  name: 'Upgrade',
  components: {
    Plans,
    Payment,
    Button,
  },
  data() {
    return {
      isLoading: false,
      step: 0,
      plan: 'premium',
    };
  },
  created() {
    EventBus.$on('upgrade/is-loading', (isLoading) => {
      this.isLoading = isLoading;
    });
    if (!this.fromRegister) {
      this.step = 2;
    }
  },
  mounted() {
    console.log('created', this.activeSub);
    if (this.activeSub && this.activeSub.status !== 'Expired') {
      console.log('redirected from upgrade mounted');
      this.$router.push({ name: 'Profile' });
    }
  },
  beforeDestroy() {
    EventBus.$off('upgrade/is-loading');
  },
  computed: {
    fromRegister() {
      return this.$route.query.register;
    },
    activeSub() {
      return this.$store.state.vip.subscription;
    },
  },
  // watch: {
  //   activeSub(val) {
  //     if (val && val.status !== 'Expired') {
  //       this.$router.push({ name: 'Profile' });
  //     }
  //   },
  // },
  methods: {
    setStep(step, plan = 'premium') {
      this.step = step;
      this.plan = plan;
    },
  },
};
</script>

<style lang="scss">
  .upgrade {
    width: 370px;
    background-color: #fff;
    padding: 0 1rem;

    & .upgrade__title {
      margin-bottom: 1rem;
      padding-left: 6px;

      & h2 {
        font-weight: 600;
        margin-bottom: 6px;
      }

      // & .upgrade__subtitle {
      //   font-size: 15px;
      // }

      & .step {
        font-size: 13px;
        font-weight: normal;
        margin-bottom: 6px;
      }
    }

    & .upgrade__input {
      margin-bottom: 2rem;

      & > p {
        margin-bottom: 1rem;
        font-size: 14px;
      }

      & .upgrade__check {
        height: 12px;
        margin-bottom: -1px;
        margin-right: 6px;
      }
    }

    & .upgrade__actions {
      display: flex;
      flex-direction: column;
      align-items: center;

      & .button {
        width: 100%;
        height: 40px;
        min-height: 40px;
        font-size: 16px;
      }
    }

    & .upgrade__loading-overlay {
      background-color: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }
  }

  .upgrade .modal .button {
    padding-left: 3rem;
    padding-right: 3rem;
  }
  .upgrade .modal-inner-scroll-outer {
    padding-top: 3rem;
    padding-bottom: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
</style>
