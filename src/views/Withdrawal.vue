<template>
  <div>
    <div v-if="isLoading" class="body-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="profile__main-body" :class="{'is-loading': isLoading}">
      <div class="withdrawal">
        <p v-if="walletBalance >= minWithdrawal" class="id-help">Amount available for withdrawal:</p>
        <p v-else class="id-help">Funds available:</p>
        <h1 v-if="walletBalance !== false" class="amount-available">
          {{ walletBalanceFormatted }}
        </h1>
        <div v-if="walletBalance >= minWithdrawal" class="acc-inputs" :class="{ 'error' : errors.paypal.length }">
          <div class="acc-input-wrap">
            <input class="acc-input" type="email" placeholder="PayPal Email" v-model="paypal" @input="isValidEmail">
          </div>
          <ul v-if="errors.paypal.length" class="errors">
            <li v-for="(error, index) in errors.paypal" :key="`email-error-${index}`">{{ error }}</li>
          </ul>
        </div>
        <Button
          variant="rounded-blue"
          text="Request a withdrawal"
          @clicked="requestWithdrawal"
          :disabled="walletBalance < minWithdrawal || identityStatus !== 'Verified' || isLoading || disableWithdrawalBtn || (this.$store.state.banking.simpleWithdrawal && (!this.paypal || this.errors.paypal.length > 0))"
        />
        <p v-if="walletBalance < minWithdrawal" class="id-help minimum-text">The minimum withdrawal is {{ formatMoney(minWithdrawal, (this.$store.state.banking.wallet && this.$store.state.banking.wallet.withdrawable.currencyCode) || 'USD') }}</p>
      </div>
      <div class="withdrawal-history-c">
        <h2>Withdrawal History</h2>
        <div v-if="isLoading" key="loading">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
        <div v-else-if="withdrawalsData.items.length > 0" class="withdrawal-history" key="history">
          <RowPanel
            v-for="withdrawal in withdrawalsData.items"
            :key="`withdrawal-h-${withdrawal.id}`"
            class="withdrawal-history-item"
            :title="formatMoney(withdrawal.amount, withdrawal.currencyCode)"
            :badge-text="withdrawal.status === 'Pending' ? 'X' : withdrawal.status"
            :badge-variant="withdrawal.status === 'Pending' ? 'red' : getBadgeVariant(withdrawal.status)"
            :badge-action="withdrawal.status === 'Pending' ? cancelWithdrawal : null"
            :badge-action-param="withdrawal.id"
          >
            <template v-slot:title>
              {{ formatMoney(withdrawal.amount, withdrawal.currencyCode) }}
            </template>
            <template v-slot:details class="withdrawal-date">
              <span>Requested:</span> {{ $dayjs(withdrawal.createTime).format('MMMM Do YYYY') }}
            </template>
          </RowPanel>
        </div>
        <p v-else class="id-help" key="nohistory">No history yet</p>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';
import RowPanel from '@/components/global/RowPanel.vue';

export default {
  name: 'Withdrawal',
  components: {
    // UserInfo,
    Button,
    RowPanel,
  },
  data() {
    return {
      step: 1,
      isLoading: false,
      isRequesting: false,
      isProcessing: false,
      profileData: [],
      email: '',
      paypal: '',
      showFeed: false,
      withdrawalsData: {
        items: [],
      },
      disableWithdrawalBtn: false,
      errors: {
        paypal: [],
      },
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    displayNameStore() {
      if (this.$store.state.auth.userData) {
        return this.$store.state.auth.userData.displayName;
      }
      return '';
    },
    // get all user data
    userData() {
      return this.$store.state.auth.userData;
    },
    identityStatus() {
      // TEMP go straight to Withdrawal page! No ID verification req for now
      if (this.$store.state.banking.simpleWithdrawal) {
        return 'Verified';
      }
      if (this.userData) {
        return this.userData.identityStatus;
      }
      return 'niewiem';
    },
    // get user avatar
    userAvatar() {
      return this.userData !== null ? this.userData.avatarUrl : '';
    },
    // get user wallet
    wallet() {
      return this.$store.state.banking.wallet;
    },
    // get user wallet balance from wallet
    walletBalance() {
      return this.$store.state.banking.wallet !== null ? this.$store.state.banking.wallet.withdrawable.balance : false;
    },
    walletBalanceFormatted() {
      return this.$store.getters.walletBalance;
    },
    minWithdrawal() {
      return this.withdrawalsData && this.withdrawalsData.minAmount ? this.withdrawalsData.minAmount : this.$store.state.banking.minWithdrawal;
    },
  },
  watch: {
    //
  },
  async created() {
    this.isLoading = true;
    try {
      await this.fetchProfile();
      await this.getAllWithdrawals();
    } catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    fetchProfile() {
      this.isLoading = true;
      return this.$api
        .get(`/user/profile`)
        .then((response) => response.data)
        .then((profileData) => {
          console.log('profileData', profileData);
          this.isLoading = false;
          this.profileData = profileData;
          this.email = profileData.email;
        });
    },
    getAllWithdrawals() {
      this.isLoading = true;
      return this.$api
        .get(`/banking/withdrawal`)
        .then((response) => response.data)
        .then((withdrawalsData) => {
          console.log('withdrawalsData', withdrawalsData);
          this.withdrawalsData = withdrawalsData;
          this.isLoading = false;
        });
    },
    requestWithdrawal() {
      const requestAtts = {};
      requestAtts.providerRef = this.paypal;
      this.disableWithdrawalBtn = true;
      this.isLoading = true;
      return this.$api
        .post(`/banking/withdrawal`, requestAtts)
        .then((response) => response.data)
        .then((withdrawalData) => {
          console.log('withdrawalData', withdrawalData);
          this.$store.dispatch('loadWallet')
            .then(() => {
              this.isLoading = false;
            });
          this.withdrawalsData.items.unshift(withdrawalData);
          this.errors.paypal = [];
          this.paypal = '';
        });
    },
    cancelWithdrawal(id) {
      this.disableWithdrawalBtn = false;
      this.isLoading = true;
      return this.$api
        .delete(`/banking/withdrawal/${id}`)
        .then(() => {
          console.log('cancelWithdrawal', id);
          this.$store.dispatch('loadWallet').then(() => {
            this.isLoading = false;
          });
          this.getAllWithdrawals();
        });
    },
    getBadgeVariant(status) {
      if (status === 'Pending') {
        return 'bingo';
      }
      if (status === 'Cancelled') {
        return 'red';
      }
      return 'emerald';
    },
    isValidEmail() {
      const re = /^\S+@\S+$/;
      const check = re.test(String(this.paypal).toLowerCase());
      this.errors.paypal = [];
      if (!check) {
        this.errors.paypal.push('Must be a valid email address.');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.form--loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 2rem);
  height: calc(100% + 2rem);
  background-color: rgba(16, 16, 24, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.t-form:not(.is-loading) {
  &+.form--loading-overlay {
    display: none;
  }
}
.t-form:not(.is-loading) {
  &+.form--loading-overlay {
    display: none;
  }
}
.profile__main-body {
  height: 100%;
  padding: 2rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  color: #fff;
}
.profile__footer {
  margin-top: auto;
}
.ldr {
  background-color: $light-navy;
  &::after {
    animation-name: loader500;
    background: linear-gradient(to right, rgba(29,29,48,1) 8%,rgba(35,35,56,1) 18%,rgba(29,29,48,1) 33%);
  }
}
.id-help {
  font-size: 14px;
  color: #7474AD;
  line-height: 1.5;
}
.withdrawal {
  text-align: center;
}
.withdrawal-history {
  margin-bottom: 1rem;
}
.withdrawal-history-c {
  margin-top: 3rem;
  text-align: center;
  h2 {
    margin-bottom: 1rem;
  }
  .id-help {
    margin-top: 1rem;
  }
}
.amount-available {
  margin: 1rem 0 1rem;
  font-weight: 700;
  background: $orange-gradient;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.clickable {
  cursor: pointer;
  transition: 0.15s transform ease-in-out;
}
.clickable:hover {
  transform: scale(1.1);
}
.minimum-text {
  margin-top: 1rem;
}
.game__loading-dots {
  margin: 2rem 0;
}

.acc-inputs {
  margin: 1rem auto;
  width: 500px;
  max-width: 100%;
}
.acc-input-wrap__inner {
  position: relative;
}
.acc-input {
  font-size: 12px;
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  background-color: $light-navy;
  color: $kimberly;
  border-radius: 0 !important;
  &:not([readonly]) {
    color: #fff;
  }
  &[disabled] {
    opacity: 1 !important;
    -webkit-text-fill-color: $kimberly;
  }
}
.acc-input-wrap {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
ul.errors {
  color: $red;
  font-size: 12px;
  padding-left: 2rem;
  margin-bottom: 2rem;
  text-align: left;
}
.error {
  .acc-input {
    outline: 1px solid $red;
  }
}
</style>
