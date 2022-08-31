<template>
  <!-- MOBILE SLIDE UP MODAL -->
  <div v-if="isMobileSmall">
    <div v-if="show" class="diamonds__mobile-overlay" @click="close"></div>
    <div class="diamonds modal-slide-up" :class="{ closed: !show, 'full-size': checkoutUrl, 'no-padding': showAddressForm }">
      <!-- CHECKOUT -->
      <template v-if="checkoutUrl">
        <iframe sandbox="allow-scripts allow-popups allow-forms allow-top-navigation allow-same-origin" :src="checkoutUrl"></iframe>
      </template>

      <!-- PURCHASE CONFIRMED -->
      <template v-else-if="!isLoading && confirmedView">
        <div v-if="waitingForServerConfirmation" class="diamonds__confirmation-loading">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
          <p>Processing your payment as fast as we can.. hang in there!</p>
        </div>
        <div :class="{ 'confirmed-hidden': waitingForServerConfirmation }" class="diamonds__single-item confirmed">
          <p class="diamonds__item-name">Thank you!</p>
          <img svg-inline class="ticket-icon icon" src="@/assets/ticket-icon.svg" alt="Tickets">
          <p class="diamonds__purchased">{{purchasedItem.quantity}} tickets</p>
          <p class="diamonds__disclaimer">Tickets have been added to your balance.</p>
          <!-- <img class="diamonds__item-image" svg-inline :src="purchasedItem.imageUrl" alt="Tickets"> -->
          <Button
            class="diamonds__item-button"
            :text="gameClicked ? `Play ${gameClicked.name}` : 'Continue'"
            variant="rounded-blue"
            @clicked="endStore"
            :disabled="isLoadingPayments"
          />
        </div>
      </template>

      <!-- ADDRESS FORM -->
      <template v-else-if="showAddressForm && selectedPackage">
        <Address title="Billing Address" desc="Before proceeding to the payment, we need you to fill in your billing address:" :cancel="resetStore" :submitCallback="updateAddressCallback" partial/>
      </template>

      <!-- SELECT PAYMENT METHOD -->
      <template v-else-if="!isLoading && !showFullStore && selectedPackage && selectPaymentMethod">
        <div class="diamonds__single-item">
          <div class="package-details">
            <img svg-inline class="ticket-icon icon single" src="@/assets/ticket-icon.svg" alt="Tickets">
            <div class="package-details__text">
              <p class="diamonds__item-name">{{formatMoney(selectedPackage.price, 'USD')}}</p>
              <p class="diamonds__disclaimer">{{selectedPackage.name}}</p>
            </div>
            <div class="circle left"></div>
            <div class="circle right"></div>
          </div>
          <p>Select a payment method</p>
          <SelectPaymentMethod v-model="paymentMethodToUse" :is-loading="isLoadingPayments"/>
          <Button class="diamonds__item-button" text="CONFIRM" variant="rounded-blue" @clicked="buy(selectedPackage)" :disabled="isLoadingPayments" />
          <p class="diamonds__click-full" @click="showFullStore = true">See all Tickets packages</p>
        </div>
      </template>

      <!-- SINGLE ITEM -->
      <template v-else-if="!isLoading && !showFullStore && singleItem">
        <div class="diamonds__single-item">
          <img svg-inline class="ticket-icon icon single" src="@/assets/ticket-icon.svg" alt="Tickets">
          <p v-if="lastDiamondPurchase" class="diamonds__disclaimer">You’re out of Tickets. Buy some to continue playing.</p>
          <p v-else class="diamonds__disclaimer">Looks like this game requires Tickets, buy some to start playing.</p>
          <p class="diamonds__item-name">{{formatMoney(singleItem.price, 'USD')}}</p>
          <p class="diamonds__disclaimer">{{singleItem.name}}</p>
          <!-- <img class="diamonds__item-image" svg-inline :src="singleItem.imageUrl" alt=""> -->
          <SelectPaymentMethod v-if="paymentMethod" v-model="newPM" :is-loading="isLoadingPayments" :compact="true"/>
          <Button class="diamonds__item-button" :text="formatMoney(singleItem.price, 'USD')" variant="rounded-blue" @clicked="selectPackage(singleItem)" :disabled="isLoadingPayments" />
          <p class="diamonds__click-full" @click="showFullStore = true">See all Tickets packages</p>
        </div>
      </template>

      <!-- PAYMENT PROMPT -->
      <template v-else-if="paymentPrompt">
        <div class="payment-prompt">
          <h3 class="payment-prompt__heading" v-if="paymentPrompt.title">{{ paymentPrompt.title }}</h3>
          <p class="payment-prompt__text">{{ paymentPrompt.message }}</p>
          <Button text="Continue" variant="rounded-blue" @clicked="close()"/>
        </div>
      </template>

      <!-- ALL PACKAGES -->
      <template v-else-if="!isLoading">
        <h3 class="store-heading">Buy Entry Tickets</h3>
        <div class="diamonds__items-wrapper">
          <TicketPackage v-for="(item, index) in ticketPackages" :key="index" :item="item" :buy="selectPackage" :isLoading="isLoadingPayments"/>
        </div>
        <SelectPaymentMethod v-if="paymentMethod" v-model="newPM" :is-loading="isLoadingPayments" :compact="true"/>
      </template>

      <div class="close-button" @click="close">
        <img svg-inline src="@/assets/close-small.svg" alt="Close">
      </div>

      <div v-if="isLoading || isLoadingPayments" class="diamonds__loading" :class="{ 'no-overlay': firstLoad }">
        <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  </div>

  <!-- DESKTOP MODAL -->
  <Modal
    v-else-if="show && !isMobileSmall"
    v-model="show"
    :btn-action="close"
    :is-loading="isLoading || isLoadingPayments"
    mode="simple"
    class="diamonds__modal"
    :class="{ checkout: checkoutUrl }"
    no-buttons
    close-button
    :close-btn-action="close"
    :content-full-size="showAddressForm"
  >
    <template v-slot:body>
      <div class="diamonds" :class="{ 'full-size': checkoutUrl || showAddressForm  }">
        <!-- CHECKOUT -->
        <template v-if="checkoutUrl">
          <iframe sandbox="allow-scripts allow-popups allow-forms allow-top-navigation allow-same-origin" :src="checkoutUrl"></iframe>
        </template>

        <!-- PURCHASE CONFIRMED -->
        <template v-else-if="confirmedView">
          <div v-if="waitingForServerConfirmation" class="diamonds__confirmation-loading">
            <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
            <p>Processing your payment as fast as we can.. hang in there!</p>
          </div>
          <div :class="{ 'confirmed-hidden': waitingForServerConfirmation }"  class="diamonds__single-item">
          <p class="diamonds__item-name">Thank you!</p>
          <img svg-inline class="ticket-icon icon" src="@/assets/ticket-icon.svg" alt="Tickets">
          <p class="diamonds__purchased">{{purchasedItem.quantity}} tickets</p>
          <p class="diamonds__disclaimer">Tickets have been added to your balance.</p>
            <!-- <img class="diamonds__item-image" svg-inline :src="purchasedItem.imageUrl" alt="Tickets"> -->
            <Button
              class="diamonds__item-button"
              :text="gameClicked ? `Play ${gameClicked.name}` : 'Continue'"
              variant="rounded-blue"
              @clicked="endStore"
              :disabled="isLoadingPayments"
            />
          </div>
        </template>

        <!-- ADDRESS FORM -->
        <template v-else-if="showAddressForm && selectedPackage">
          <Address title="Billing Address" desc="Before proceeding to the payment, we need you to fill in your billing address:" :cancel="resetStore" :submitCallback="updateAddressCallback" partial/>
          <!-- <form @submit.prevent="" autocomplete="off">
            <p>Before proceeding to the payment, we need your postcode:</p>
            <input class="t-form__input" id="zipcode" name="zipcode" type="text" v-model="zipcode">
            <label class="t-form__input-label" for="zipcode">Postcode</label>
            <Button
              class="diamonds__item-button"
              text="Continue to payment"
              variant="rounded-blue"
              @clicked="updateAddressAndBuy()"
              :disabled="isLoading"
            />
          </form> -->
        </template>

        <!-- SELECT PAYMENT METHOD -->
        <template v-else-if="!isLoading && !showFullStore && selectedPackage && selectPaymentMethod">
          <div class="diamonds__single-item">
            <div class="package-details">
              <img svg-inline class="ticket-icon icon single" src="@/assets/ticket-icon.svg" alt="Tickets">
              <div class="package-details__text">
                <p class="diamonds__item-name">{{formatMoney(selectedPackage.price, 'USD')}}</p>
                <p class="diamonds__disclaimer">{{selectedPackage.name}}</p>
              </div>
              <div class="circle left"></div>
              <div class="circle right"></div>
            </div>
            <p>Select a payment method</p>
            <SelectPaymentMethod v-model="paymentMethodToUse" :is-loading="isLoadingPayments"/>
            <Button class="diamonds__item-button" text="CONFIRM" variant="rounded-blue" @clicked="buy(selectedPackage)" :disabled="isLoadingPayments" />
            <p class="diamonds__click-full" @click="showFullStore = true">See all Tickets packages</p>
          </div>
        </template>

        <!-- SINGLE ITEM -->
        <template v-else-if="!isLoading && !showFullStore && singleItem">
          <div class="diamonds__single-item">
            <img svg-inline class="ticket-icon icon single" src="@/assets/ticket-icon.svg" alt="Tickets">
            <p v-if="lastDiamondPurchase" class="diamonds__disclaimer">You’re out of Tickets. Buy some to continue playing.</p>
            <p v-else class="diamonds__disclaimer">Looks like this game requires Tickets, buy some to start playing.</p>
            <p class="diamonds__item-name">{{formatMoney(singleItem.price, 'USD')}}</p>
            <p class="diamonds__disclaimer">{{singleItem.name}}</p>
            <!-- <img class="diamonds__item-image" svg-inline :src="singleItem.imageUrl" alt=""> -->
            <!-- <SelectPaymentMethod v-model="paymentMethodToUse" :is-loading="isLoadingPayments"/> -->
            <SelectPaymentMethod v-if="paymentMethod" v-model="newPM" :is-loading="isLoadingPayments" :compact="true"/>
            <Button class="diamonds__item-button" :text="formatMoney(singleItem.price, 'USD')" variant="rounded-blue" @clicked="selectPackage(singleItem)" :disabled="isLoadingPayments" />
            <p class="diamonds__click-full" @click="showFullStore = true">See all Tickets packages</p>
          </div>
        </template>

        <!-- PAYMENT PROMPT -->
        <template v-else-if="paymentPrompt">
          <div class="payment-prompt">
            <h3 class="payment-prompt__heading" v-if="paymentPrompt.title">{{ paymentPrompt.title }}</h3>
            <p class="payment-prompt__text">{{ paymentPrompt.message }}</p>
            <Button text="Continue" variant="rounded-blue" @clicked="close()"/>
          </div>
        </template>

        <!-- ALL PACKAGES -->
        <template v-else-if="!isLoading">
          <h3 class="store-heading">Buy Entry Tickets</h3>
          <div class="diamonds__items-wrapper">
            <TicketPackage v-for="(item, index) in ticketPackages" :key="index" :item="item" :buy="selectPackage" :isLoading="isLoadingPayments" />
          </div>
          <SelectPaymentMethod v-if="paymentMethod" v-model="newPM" :is-loading="isLoadingPayments" :compact="true"/>
        </template>

      </div>
    </template>
  </Modal>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import Modal from '@/components/global/Modal.vue';
import Button from '@/components/global/Button.vue';
import TicketPackage from '@/components/ticket-store/TicketPackage.vue';
import SelectPaymentMethod from '@/components/diamond-store/SelectPaymentMethod.vue';
import Address from '@/views/Address.vue';

const unipaas = new Unipaas(); //eslint-disable-line
unipaas.usePolyfills(); // use polyfiils for IE11

export default {
  name: 'TicketStore',
  components: {
    Modal,
    Button,
    TicketPackage,
    SelectPaymentMethod,
    Address,
  },
  data() {
    return {
      show: false,
      showFullStore: false,
      singleItem: null,
      paymentMethodToUse: null,
      confirmedView: false,
      waitingForServerConfirmation: true,
      tryAgain: false,
      purchasedItem: null,
      checkoutUrl: null,
      provider: null,
      isLoading: false,
      isLoadingPayments: false,
      firstLoad: true,
      paymentWindow: window,
      selectPaymentMethod: false,
      selectedPackage: null,
      newPM: false,
      paymentPrompt: null,
      showAddressForm: false,
      zipcode: null,
      address: {
        line1: '',
        line2: '',
        line3: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    };
  },
  computed: {
    userData() {
      return this.$store.state.auth.userData;
    },
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    diamondBalance() {
      return this.$store.getters.diamondBalance;
    },
    ticketPackages() {
      return this.$store.state.diamonds.items;
    },
    gameClicked() {
      return this.$store.state.diamonds.gameClicked;
    },
    lastDiamondPurchase() {
      return this.$store.getters.lastDiamondPurchase;
    },
    paymentMethod() {
      return this.$store.state.banking.paymentMethod;
    },
    paymentOptions() {
      return this.$store.state.banking.paymentOptions;
    },
  },
  created() {
    this.unipaasInit();
    EventBus.$on('toggleTicketStore', (showFullStore, gameCost, tryAgain) => {
      if (this.show) {
        this.show = false;
        document.body.classList.remove('no-scroll');
      } else {
        this.open(showFullStore, gameCost, tryAgain);
      }
    });
    EventBus.$on('closeTicketStore', () => { this.show = false; });
    EventBus.$on('openTicketConfirmedView', this.openConfirmedview);
    EventBus.$on('showTicketStore', this.open);
    EventBus.$on('orderComplete', () => {
      this.waitingForServerConfirmation = false;
      if (!this.show) {
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        if (currentOrder) {
          this.openConfirmedview();
        }
      }
    });
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage);
  },
  beforeDestroy() {
    EventBus.$off('showTicketStore');
    EventBus.$off('closeTicketStore');
    EventBus.$off('openTicketConfirmedView');
    EventBus.$off('toggleTicketStore');
    EventBus.$off('orderComplete');
    window.removeEventListener('message', this.receiveMessage);
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal.query.store) this.open();
      },
    },
  },
  methods: {
    resetStore() {
      this.showFullStore = true;
      this.checkoutUrl = null;
      this.provider = null;
      this.confirmedView = false;
      this.showAddressForm = false;
      this.waitingForServerConfirmation = true;
      this.selectPaymentMethod = false;
      this.selectedPackage = null;
      this.newPM = false;
    },
    openConfirmedview() {
      const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
      if (!currentOrder) return;
      this.showFullStore = false;
      this.tryAgain = false;
      this.waitingForServerConfirmation = false;
      this.confirmedView = true;
      this.checkoutUrl = null;
      this.provider = null;
      this.purchasedItem = currentOrder.item;
      this.show = true;
      this.paymentWindow = null;
      this.selectPaymentMethod = false;
      this.selectedPackage = null;
    },
    open(showFullStore = false, gameCost, tryAgain = false) {
      this.resetStore();
      this.isLoading = true;
      this.firstLoad = true;
      this.showFullStore = showFullStore;
      this.tryAgain = tryAgain;

      this.show = true;
      if (!document.body.classList.contains('no-scroll')) {
        document.body.classList.add('no-scroll');
      }
      Promise.all([
        this.$store.dispatch('loadTicketStore'),
        this.$store.dispatch('loadPaymentMethods'),
        this.$store.dispatch('loadPaymentOptions'),
      ])
        .then(() => {
          this.paymentMethodToUse = this.paymentMethod || this.paymentOptions[0];
          if (gameCost) {
            this.getClosestPackage(gameCost);
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.firstLoad = false;
        });
    },
    receiveMessage(event) {
      if (typeof event.data === 'string' || !event.data.type) return;
      if (event.data.type !== 'PaymentSuccess' && event.data.type !== 'PaymentCancelled') return;
      if (event.data.type === 'PaymentCancelled') {
        this.show = false;
        this.waitingForServerConfirmation = false;
        document.body.classList.remove('no-scroll');
        return;
      }
      this.confirmedView = true;
      this.waitingForServerConfirmation = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
      const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
      if (this.paymentWindow) {
        if (!currentOrder) return;

        this.$api
          .post(`/order/${currentOrder.orderId}/payment/complete`, { provider: this.provider, data: event.data })
          .then((response) => {
            const { data } = response;

            if (!data.payment) {
              if (data.status === 'Complete') {
                this.openConfirmedview();
                return;
              }

              if (data.status === 'Pending') {
                this.waitingForServerConfirmation = true;
                this.confirmedView = true;
                this.show = true;

                setTimeout(() => {
                  if (this.show && this.waitingForServerConfirmation) {
                    this.show = false;
                    this.waitingForServerConfirmation = false;
                    document.body.classList.remove('no-scroll');
                  }
                }, 45000);
              }
            } else {
              const { payment } = data;

              if (payment.status === 'Successful') {
                this.openConfirmedview();
                return;
              }

              if (!payment.action) {
                this.show = false;
                return;
              }

              if (payment.action.type === 'Retry') {
                this.$noty.warning('Your payment was unsuccessful, please try again or contact your bank').setTimeout(0);
                this.open(true);
                return;
              }

              if (payment.action.type === 'Prompt' && payment.action.message) {
                this.paymentPrompt = { title: payment.action.title, message: payment.action.message };
                this.confirmedView = false;
              }
            }
          }).catch((err) => {
            console.error(err);
            this.$noty.error('Something went wrong, please try again.');
            this.showFullStore = true;
          });
      } else {
        const routeName = currentOrder?.redirectTo ? currentOrder?.redirectTo : 'Lobby';
        this.$router.replace({ name: routeName, query: { ...this.$route.query, restorePurchase: true } }).catch(() => {});
        this.confirmedView = true;
        this.checkoutUrl = null;
        this.provider = null;
        this.paymentWindow = false;
      }
    },
    getClosestPackage(gameCost) {
      if (!this.ticketPackages.length) return;
      if (this.lastDiamondPurchase && (this.diamondBalance + this.lastDiamondPurchase.quantity) >= gameCost) {
        this.singleItem = this.ticketPackages.find((o) => o.quantity === this.lastDiamondPurchase.quantity);
      } else {
        this.singleItem = this.ticketPackages.reduce((a, b) => Math.abs(gameCost - b.quantity) < Math.abs(gameCost - a.quantity) ? b : a); // eslint-disable-line
      }
    },
    close() {
      this.show = false;
      this.isLoading = false;
      this.paymentPrompt = null;
      localStorage.removeItem('currentOrder');
      document.body.classList.remove('no-scroll');
    },
    selectPackage(item) {
      if (this.newPM || !this.paymentMethod) {
        this.selectPaymentMethod = true;
        this.selectedPackage = item;
        this.showFullStore = false;
      } else {
        this.buy(item);
      }
      this.newPM = false;
    },
    buy(item) {
      if (this.isLoadingPayments || this.isLoading || !this.paymentMethodToUse) return;
      if (((this.paymentMethodToUse.type && this.paymentMethodToUse.type === 'CreditCard') || (this.paymentMethodToUse.methodTypes && this.paymentMethodToUse.methodTypes[0] === 'CreditCard')) && (this.userData.addressStatus !== 'Complete' && this.userData.addressStatus !== 'Partial')) {
        this.showAddressForm = true;
        this.selectedPackage = item;
        return;
      }

      this.selectPaymentMethod = false;
      this.selectedPackage = null;

      this.isLoading = true;
      const isExistingPaymentOption = !this.paymentMethodToUse?.methodTypes && this.paymentMethod;
      const isUnipaasSavedCardPayment = isExistingPaymentOption && this.paymentMethod?.provider === 'Unipaas' && this.paymentMethod?.type !== 'PayPal';

      if (!isUnipaasSavedCardPayment) {
        this.paymentWindow = this.createPaymentWindow();
      }

      this.$api.post('/store/order', { itemId: item.id })
        .then((response) => {
          localStorage.setItem('currentOrder', JSON.stringify({
            orderId: response.data.id,
            redirectTo: this.$route.name,
            item,
          }));
          if (isExistingPaymentOption) {
            if (isUnipaasSavedCardPayment) {
              return this.$api.post(`/order/${response.data.id}/payment/init`);
            }
          }
          return this.$api.post('/order/checkout', {
            orderId: response.data.id,
            provider: this.paymentMethodToUse.provider,
            returnUrl: process.env.VUE_APP_PAYMENT_RETURN_URL,
            cancelUrl: process.env.VUE_APP_PAYMENT_CANCEL_URL,
          });
        })
        .then((response) => {
          this.purchasedItem = item;
          if (response.data.data && response.data.data.sessionToken) {
            this.unipaasPayment(response.data.data.sessionToken, response.data.data.paymentOptionId);
            this.confirmedView = true;
            this.isLoading = false;
          } else if (response.data.checkoutUrl) {
            this.provider = response.data.provider;
            this.updatePaymentWindow(response.data.checkoutUrl);
          } else if (response.data.action && response.data.action.type === 'Redirect') {
            if (response.data.action.popup) {
              this.updatePaymentWindow(response.data.action.url);
            } else {
              window.location.href = response.data.action.url;
            }
          } else {
            this.confirmedView = true;
          }
        })
        .catch((err) => {
          this.paymentWindow.close();
          console.log('token ERROR - err: ', err);
          if (process.env.NODE_ENV === 'development') {
            if (err.message) {
              this.$noty.error(err.message);
            } else if (err.errors) {
              this.$noty.error(typeof err.errors === 'string' ? err.errors : err.errors[0]);
            }
          } else {
            this.$noty.error('Something went wrong, please try again later.');
          }
          this.isLoading = false;
        });
      // .finally(() => {
      //   this.isLoading = false;
      // });
    },
    endStore() {
      this.show = false;
      document.body.classList.remove('no-scroll');
      if (this.tryAgain) {
        EventBus.$emit('tryAgain');
      } else if (this.gameClicked) {
        EventBus.$emit('goToGame', this.gameClicked, true);
      } else if (this.$route.name !== 'Lobby') {
        this.$router.push({ name: 'Lobby' });
      }
      if (localStorage.currentOrder) {
        localStorage.removeItem('currentOrder');
      }
    },
    unipaasInit() {
      unipaas.on('onSuccess', (data) => {
        console.log('Success:', data);
      });
      unipaas.on('onError', (err) => {
        console.log('Error:', err);
        this.confirmedView = false;
        this.$noty.error(err.message || err);
      });
    },
    unipaasPayment(sessionToken, paymentOptionId) {
      unipaas.payWithToken(sessionToken, {
        mode: process.env.VUE_APP_UNIPAAS_MODE || 'test',
      });
      unipaas.makePayment(paymentOptionId);
    },
    createPaymentWindow() {
      if (this.isMobile) {
        return window.open(process.env.VUE_APP_PAYMENT_INITIALIZED_URL, '_blank');
      }

      const width = window.innerWidth / 2;
      const height = window.innerHeight / 1.5;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 1.5;
      const target = (new Date()).getTime();

      return window.open(
        process.env.VUE_APP_PAYMENT_INITIALIZED_URL,
        target,
        `width=${width},height=${height},top=${top},left=${left},directories=no,status=no,menubar=no,toolbar=no,location=no`,
      );
    },
    updatePaymentWindow(url) {
      if (!this.paymentWindow) return;
      this.paymentWindow.location.replace(url);
      // this.show = false;
      // document.body.classList.remove('no-scroll');
    },
    updateAddressCallback() {
      this.buy(this.selectedPackage);
      this.showAddressForm = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .diamonds__mobile-overlay {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .diamonds__modal {
    height: 100%;
  }

  .diamonds {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    padding: 0.5rem;
    // padding-top: 1rem;

    & iframe:first-of-type {
      // min-height: 65vh;
      height: 100vh;
      width: 100%;
      z-index: 10;
    }

    &.full-size {
      padding: 0;
    }

    &.modal-slide-up {
      background-color: $navy;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 9999 !important;
      overflow: auto;
      // max-height: 80vh;
      min-height: 20vh;
      max-height: 100%;
      transition: min-height 0.3s ease-in-out;
      padding-top: 1rem;

      &.full-size {
        height: 100%;
        min-height: 100%;
        padding: 0;
      }
      &.no-padding {
        padding: 0;
      }

      &.closed {
        padding: 0;
        min-height: 0;
        max-height: 0;
        transition: min-height 0.3s cubic-bezier(0, 1, 0, 1);
      }
    }

    & .diamonds__single-item {
      color: #fff;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;

      & .package-details {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
        background-color: #2F2F45;
        padding: 10px 20px;
        position: relative;
        border-radius: 2px;
        & svg {
          margin-bottom: 0;
          margin-right: 10px;
        }
        & .package-details__text {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-left: 5px dotted $navy;
          padding-left: 10px;
          & p:first-of-type {
            margin-top: 0;
          }
        }
        & .circle {
          // opacity: 0;
          background-color: $navy;
          width: 40px;
          height: 40px;
          position: absolute;
          border-radius: 50px;
          top: 50%;
          &.left {
            left: 0;
            transform: translate(-70%, -50%);
          }
          &.right {
            top: 50%;
            right: 0;
            transform: translate(70%, -50%);

          }
        }
      }

      & img {
        height: 135px;
      }

      & .diamonds__click-full {
        font-size: 12px;
        color: #fff;
        font-weight: normal;
        cursor: pointer;
        margin-top: 1rem;
        &:hover {
          opacity: 1;
        }
      }

      & .ticket-icon {
        margin: 20px 0;
        &.single {
          margin-top: 0;
        }
      }
      & .diamonds__purchased {
        font-size: 25px;
        font-weight: 900;
        line-height: 40px;
      }

      & .diamonds__disclaimer {
        font-size: 14px;
        font-weight: 300;
        line-height: 26px;
        text-align: center;
        opacity: 0.8;
      }
      & .diamonds__item-name {
        font-size: 25px;
        font-weight: 900;
        line-height: 40px;
        margin-top: 20px;
      }

      & .button {
        width: 220px;
        margin-top: 1rem;
      }
    }

    & .store-heading {
      font-size: 25px;
      font-weight: 700;
      line-height: 40px;
      text-align: center;
      color: #fff;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    & .diamonds__items-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
    }

    & .close-button {
      padding: 6px;
      background-color: #323447;
      height: 22px;
      width: 22px;
      border-radius: 50%;
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid $navy;
      z-index: 999999;

      &:hover {
        background-color: #494b5f;
      }

      & svg {
        width: 10px;
        fill: #fff;
      }
    }

    .confirmed .diamonds__disclaimer {
      max-width: 230px;
    }

    .diamonds__checkout-loading {
      position: absolute;
      top: 50%;
    }

    .diamonds__confirmation-loading {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      background-color: rgba(0, 0, 0, 0.6);
      & p {
        margin-top: 40px;
        max-width: 280px;
        color: $kimberly;
        font-size: 14px;
        text-align: center;
      }
    }

    .confirmed-hidden {
      visibility: hidden;
    }

    .diamonds__loading {
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.3);
      top: 0;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;

      &.no-overlay {
        background-color: transparent;
      }
    }
  }

  @media (min-width: 1441px) {
    .diamonds {
      & iframe {
        height: 80vh;
      }
    }
  }
  @media (min-width: 768px) {
    .diamonds {
      max-width: 620px;
    }
  }
  @media (max-width: 575px) {
    .store-heading {
      font-size: 22px !important;
    }
  }
  @media (max-width: 350px) {
    .diamonds__item {
      padding: 0 10px;
    }
  }
</style>

<style lang="scss">
  .diamonds__modal {
    .modal.modal--simple {
      padding: 0 !important;
      width: auto;

      & .modal-inner-scroll-outer {
        min-height: 20vh;
        min-width: 20vw;
      }

    }

    &.checkout {
      & .secondary-overlay {
        padding: 0;
      }
      .modal.modal--simple {
        max-width: 530px;

        .modal-inner-scroll-outer {
          padding: 0;
        }

        .modal-inner-scroll {
          margin-bottom: 0 !important;
        }
      }
    }
  }
</style>

<style lang="scss">
  .modal,
  .modal-slide-up {
    .payment-prompt {
      text-align: center;

      &__heading {
        font-size: 25px;
        font-weight: 700;
        line-height: 40px;
        text-align: center;
        color: #fff;
        margin-bottom: 20px;
      }

      &__text {
        font-size: 12px;
        color: #fff;
        font-weight: normal;
        text-align: center;
      }

      p.payment-prompt__text {
        margin: 0 0 25px;
      }
    }
  }
  .modal-slide-up {
    .payment-prompt {
      &__heading {
        font-size: 22px;
        margin-bottom: 15px;
      }

      &__text {
        padding: 0 15px;
      }

      p.payment-prompt__text {
        margin: 0 0 20px;
      }

      button {
        margin-bottom: 15px;
      }
    }
  }
</style>
