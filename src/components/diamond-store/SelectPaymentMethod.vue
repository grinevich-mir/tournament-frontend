<template>
  <div class="diamonds__payment-method">
    <div v-if="isLoading" class="diamonds__checkout-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div v-else-if="compact">
      <div class="saved-pm">
        <label class="checkbox radio">
          <span>{{savedPaymentLabel}}</span>
          <input type="radio" :value="false" v-model="selected">
          <span class="checkmark"></span>
        </label>
      </div>
      <div class="new-pm">
        <label class="checkbox radio">
          New payment method
          <input type="radio" :value="true" v-model="selected">
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <template v-else>
      <div class="saved-pm" v-if="paymentMethod">
        <label class="pm-section">
          Previous payment method:
        </label>
        <label class="checkbox radio">
          <span>{{savedPaymentLabel}}</span>
          <input type="radio" :value="paymentMethod" v-model="selected">
          <span class="checkmark"></span>
        </label>
      </div>
      <div class="new-pm">
        <label class="pm-section">
          New payment method:
        </label>
          <label v-for="paymentOption in paymentOptions" :key="paymentOption.id" class="checkbox radio">
            {{ paymentOption.name }}
            <input type="radio" :value="paymentOption" v-model="selected">
            <span class="checkmark"></span>
          </label>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SelectPaymentMethod',
  props: ['value', 'isLoading', 'compact'],
  data() {
    return {
      PAYMENT_TYPE_READABLE: {
        CreditCard: 'Credit Card',
      },
    };
  },
  computed: {
    selected: {
      get() { return this.value; },
      set(val) {
        this.$emit('input', val);
        return val;
      },
    },
    paymentMethod() {
      return this.$store.state.banking.paymentMethod;
    },
    paymentOptions() {
      return this.$store.state.banking.paymentOptions;
    },
    savedPaymentLabel() {
      switch (this.paymentMethod.type) {
        case 'CreditCard':
          return `${this.paymentMethod.cardType} ending with ${this.paymentMethod.lastFour}`;
        default:
          return this.paymentMethod.type;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .diamonds__payment-method {
    margin-top: 1rem;
    font-weight: normal;
    text-align: left;

    & label {
      font-size: 12px;
    }

    input:checked ~ .checkmark {
      background-color: $emerald;
      border: 1px solid $emerald;
    }

    .checkmark {
      border-radius: 50%;
      height: 20px;
      width: 20px;
      background-color: transparent;
      border-color: #7487AD;
      margin-top: -3px;
      left: -4px;
      &:after {
        left: 6px;
        top: 2px;
        width: 7px;
        height: 12px;
      }
    }
    .checkbox.radio {
      margin-top: 10px;
    }
    .pm-section {
      margin-left: -10px;
      color: $kimberly;
    }
  }
</style>
