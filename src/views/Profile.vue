<template>
  <div>
    <div v-if="isLoading" class="body-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="profile__main-body" :class="{'is-loading': isLoading}">
      <div class="user-controls__info-box">
        <router-link v-if="$route.matched.some(({ name }) => name !== 'Profile')" :to="{ name: 'Profile' }" class="user-info__go-profile"><img svg-inline class="edit-profile" src="@/assets/edit-profile.svg" alt="edit-profile" /></router-link>
        <UserInfo @tap-name="displayName.editing = !displayName.editing" :avatar="userAvatar" :displayName="displayNameStore" :balance="walletBalance" :diamonds="diamondBalance" :show-controls="true" />
      </div>
      <div class="profile__take-action" :class="{ 'has-vip-upgrade': canUpgradeToVip }">
        <Button variant="rounded-blue" text="Withdrawal" @clicked="goToWithdrawal" :disabled="!this.$store.state.banking.simpleWithdrawal && identityStatus === 'Pending'"/>
        <!-- <Button @clicked="$router.push({ name: 'Upgrade' })" :text="this.userLevel > 1 ? 'Membership' : 'Start Membership'" variant="green" v-if="canUpgradeToVip" /> -->
        <p v-if="!this.$store.state.banking.simpleWithdrawal && identityStatus === 'Pending'" class="info">We are reviewing your identity documents and address information. Once approved you will be able to request a withdrawal.</p>
      </div>
      <div class="acc-info">
        <p class="acc-info__title">Account information</p>
        <div class="acc-inputs">
          <div class="acc-input-wrap">
            <input class="acc-input" type="text" v-if="email" v-model="email" readonly disabled>
            <div class="ldr" style="width: 100%; height: 45px" v-else></div>
          </div>
          <div class="acc-input-wrap">
            <div class="acc-input-wrap__inner">
              <template v-if="this.userLevel > 1">
                <img v-if="!displayName.editing" svg-inline class="input-edit" src="@/assets/pencil.svg" alt="edit-profile" @click="displayName.editing = !displayName.editing; focusInput('displayName')" />
                <img v-if="displayName.editing" svg-inline class="input-edit input-edit--close" src="@/assets/close.svg" alt="edit-profile" @click="quitEditing" />
                <img v-if="displayName.editing && displayName.inputValue !== displayName.inputValueInit" svg-inline class="input-edit input-edit--submit" src="@/assets/check.svg" alt="edit-profile" @click="updateProfile" />
              </template>
              <input ref="displayName" class="acc-input acc-input--editable" :class="{ editing: displayName.editing }" type="text" v-model="displayName.inputValue" v-debounce:500ms="checkDisplayName" @click="enableNameEdit" :readonly="!displayName.editing" :disabled="userLevel < 1">
            </div>
            <div v-if="displayName.isBusy" class="status-check status-check__busy">
              <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
            </div>
            <div class="status-check is-ok" v-if="displayName.isValid && displayName.isAvailable && displayName.editing">User name available</div>
            <div class="status-check is-taken" v-else-if="(displayName.isValid !== null || displayName.isAvailable !== null) && displayName.editing">{{ displayNameErrorMsg }}</div>
          </div>
          <div class="acc-input-wrap">
            <Button variant="rounded-blue" text="Save" @clicked="updateProfile" :disabled="updateProfileBtnDisabled" />
          </div>
        </div>
        <router-link :to="{ name: 'History' }">Game History</router-link>
        <!-- <hr>
        <div class="your-subscription">
          <p class="acc-info__title">Your Membership</p>
          <div class="acc-inputs">
            <template v-if="this.userLevel > 1 && activeSub">
              <div class="acc-input-wrap">
                <div class="acc-input acc-input--div">Status: <strong :class="activeSub.status">{{ activeSub.status }}</strong></div>
                <div v-if="activeSub.status === 'Active'" class="acc-input acc-input--div">Renewal: <strong>{{ $dayjs(activeSub.endTime).format('MMM Do YYYY, h:mm:ss a') }}</strong></div>
              </div>
              <div v-if="activeSub.status === 'Active'"><a href="#" @click="upgradeSubscription(0)">Cancel Membership</a></div>
              <p v-if="activeSub.status === 'Cancelled'">Your membership will end on {{ $dayjs(activeSub.expireTime).format('MMM Do YYYY, h:mm:ss a') }}</p>
              <div v-if="activeSub.status === 'Cancelled'" class="acc-input-wrap" style="margin-top: 1rem;">
                <Button @clicked="upgradeSubscription()" text="Cancel Change" variant="green" />
              </div>
            </template>
            <template v-else>
              <p>You don't have an active membership.<br>Click below to learn about the benefits and upgrade!</p>
            </template>
            <div class="acc-input-wrap" style="margin-top: 1rem;">
              <Button @clicked="$router.push({ name: 'Upgrade' })" text="Start Membership" variant="green" v-if="canUpgradeToVip" />
            </div>
          </div>
        </div> -->
        <hr>
        <div class="payment-methods">
          <p class="acc-info__title">Payment method</p>
          <div class="acc-inputs">
            <template v-if="paymentMethod">
              <div class="acc-input-wrap">
                <div v-if="paymentMethod.type === 'CreditCard'" class="acc-input acc-input--div">Default: <strong>{{paymentMethod.cardType}} &bull;&bull;&bull;&bull; {{paymentMethod.lastFour}} | Expires {{paymentMethod.expiryMonth}}/{{paymentMethod.expiryYear}}</strong></div>
                <div v-else class="acc-input acc-input--div">Default: <strong>{{paymentMethod.type}}</strong></div>
              </div>
            </template>
            <template v-else>
              <p>You don't have an active payment method yet.<br/>Make a purchase to add one.</p>
              <br>
              <Button text="Buy Tickets" class="diamonds-cta" @clicked="openStore" variant="rounded-blue"/>
            </template>
            <div v-if="false" class="acc-input-wrap" style="margin-top: 1rem;">
              <Button @clicked="$router.push({ name: 'NewPaymentMethod' })" :text="this.paymentMethod ? 'Change Payment Method' : 'Add New Payment Method'" variant="rounded-blue" />
            </div>
            <div class="acc-input-wrap" style="margin-top: 1rem;">
              <router-link :to="{ name: 'PaymentHistory' }">Purchase History</router-link>
            </div>
          </div>
        </div>
        <hr>
        <div v-if="notificationsEmail" class="email-notifications">
          <p class="acc-info__title">Notifications preferences</p>
          <div class="acc-inputs">
            <p>We have loads of exciting plans so make sure you're set to receive our emails!</p>
            <div v-for="(notification, label) in notificationsEmail" class="checkbox-row" :key="label">
              <label class="checkbox">{{ label }} <input type="checkbox" name="email" :value="label" :checked="notification" @input="updateEmailPreferencesObj"><span class="checkmark"></span></label>
            </div>
            <div class="acc-input-wrap">
              <Button variant="rounded-blue" text="Save" @clicked="saveProfile" :disabled="updateNotificationsBtnDisabled" />
            </div>
          </div>
        </div>
        <br>
      </div>
    </div>
    <VipModal v-if="$store.state.vip.showVip && $store.state.vip.vipActive" mode="cancel" @acceptOffer="acceptPromo()" @cancelSub="declinePromo" />
  </div>
</template>

<script>
import UserInfo from '@/components/panel/UserInfo.vue';
import Button from '@/components/global/Button.vue';
import VipModal from '@/components/global/VipModal.vue';
import EventBus from '@/helpers/event-bus';

export default {
  name: 'Profile',
  components: {
    UserInfo,
    Button,
    VipModal,
  },
  data() {
    return {
      isLoading: false,
      profileData: [],
      email: '',
      displayName: {
        inputValue: '',
        inputValueInit: '',
        editing: false,
        isAvailable: null,
        isValid: null,
        isBusy: false,
      },
      displayNameErrorMsg: '',
      showFeed: false,
      notificationsEmail: null,
      notificationsEmailOLD: null,
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
      return this.userData ? this.userData.identityStatus : false;
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
      return this.$store.getters.walletBalance;
    },
    diamondBalance() {
      return this.$store.getters.diamondBalance;
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
    updateProfileBtnDisabled() {
      if (this.isLoading) {
        return true;
      }
      return !(this.displayName.isAvailable && this.displayName.isValid);
    },
    updateNotificationsBtnDisabled() {
      if (this.isLoading) {
        return true;
      }
      if (this.notificationsEmail.account !== this.notificationsEmailOLD.account) {
        return false;
      }
      if (this.notificationsEmail.marketing !== this.notificationsEmailOLD.marketing) {
        return false;
      }
      if (this.notificationsEmail.prize !== this.notificationsEmailOLD.prize) {
        return false;
      }
      return true;
    },
    activeSub() {
      return this.$store.state.vip.subscription;
    },
    paymentMethod() {
      return this.$store.state.banking.paymentMethod;
    },
    canUpgradeToVip() {
      return this.$store.getters.canUpgradeToVip;
    },
  },
  watch: {
    displayNameStore(newValue) {
      // console.log(newValue);
      this.displayName.inputValue = newValue;
      this.displayName.inputValueInit = newValue;
    },
  },
  async created() {
    this.isLoading = true;
    if (this.$store.state.auth.userData) {
      this.displayName.inputValue = this.$store.state.auth.userData.displayName;
      this.displayName.inputValueInit = this.$store.state.auth.userData.displayName;
    }
    try {
      await this.fetchProfile();
      await this.fetchNotificationPref();
      await this.$store.dispatch('loadSubscription');
      await this.$store.dispatch('loadPaymentMethods');
    } catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    openStore() {
      EventBus.$emit('toggleTicketStore', true, null);
    },
    enableNameEdit() {
      if (this.displayName.editing === false) {
        this.displayName.editing = true;
      }
    },
    saveProfile() {
      this.isLoading = true;
      const emailNotificationsPreferencesObj = {
        enabled: true,
        ...this.notificationsEmail,
      };
      this.$api.put('/user/setting/notification/Email', emailNotificationsPreferencesObj)
        .then(() => {
          this.notificationsEmailOLD = {
            ...this.notificationsEmail,
          };
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    updateEmailPreferencesObj(e) {
      this.notificationsEmail[e.target.value] = e.target.checked;
    },
    fetchNotificationPref() {
      return this.$api.get('/user/setting/notification')
        .then((response) => response.data)
        .then((notifications) => {
          notifications.forEach((item) => {
            if (item.channel === 'Email') {
              this.notificationsEmail = {
                account: item.account,
                prize: item.prize,
                marketing: item.marketing,
              };
              this.notificationsEmailOLD = {
                account: item.account,
                prize: item.prize,
                marketing: item.marketing,
              };
            }
          });
        });
    },
    // handle withdrawal flow
    goToWithdrawal() {
      // TEMP go straight to Withdrawal page! No ID verification req for now
      if (this.$store.state.banking.simpleWithdrawal) {
        this.$router.push({ name: 'Withdrawal' });
      } else if (this.userData.addressStatus === 'Unverified') {
        this.$router.push({ name: 'Address' });
      } else if (this.userData.addressStatus === 'Complete' && this.userData.identityStatus === 'Verified') {
        this.$router.push({ name: 'Withdrawal' });
      } else if (this.userData.addressStatus === 'Pending') {
        this.$router.push({ name: 'Address' });
      } else {
        this.$router.push({ name: 'Address' });
      }
    },
    quitEditing() {
      this.displayName.editing = !this.displayName.editing;
      this.displayName.inputValue = this.displayName.inputValueInit;
      this.displayName.isValid = null;
      this.displayName.isAvailable = null;
    },
    focusInput(toFocus) {
      // solve focus and show keyboard problem on iOS
      if (this.isMobile) return;
      this.$refs[toFocus].focus();
    },
    fetchProfile() {
      return this.$api
        .get(`/user/profile`)
        .then((response) => response.data)
        .then((profileData) => {
          this.profileData = profileData;
          this.email = profileData.email;
        });
    },
    checkDisplayName() {
      this.displayNameErrorMsg = 'User with that name already exists';
      // first client side checks
      if (!this.displayName.inputValue) {
        // reset username Validator
        this.displayName.isValid = null;
        this.displayName.isAvailable = null;
        return;
      }
      if (this.displayName.inputValue.length < 5) { // TODO: more checks here!
        this.displayNameErrorMsg = 'User name is too short';
        this.displayName.isValid = false;
        return;
      }
      // reset username Validator and call API
      this.displayName.isBusy = true;
      this.displayName.isAvailable = null;
      this.displayName.isValid = null;
      this.$api
        .post('/user/display-name/check', {
          name: this.displayName.inputValue,
        })
        .then((response) => {
          if (response.data.invalidCharacters !== undefined) {
            this.displayNameErrorMsg = 'User name contains invalid characters';
          }
          this.displayName.isAvailable = response.data.available;
          this.displayName.isValid = response.data.valid;
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          this.displayName.isBusy = false;
        });
    },
    updateProfile() {
      if (!(this.displayName.isAvailable && this.displayName.isValid)) return;
      // this.displayName.isBusy = true;
      this.displayName.isAvailable = null;
      this.displayName.isValid = null;
      console.log(this.displayName.inputValue);
      this.isLoading = true;
      this.$api
        .put('/user/display-name', {
          name: this.displayName.inputValue,
        })
        .then((response) => {
          console.log(response.data);
          this.displayName.editing = false;
          this.displayName.isBusy = false;
          this.displayName.isAvailable = null;
          this.displayName.isValid = null;
          this.$store.dispatch('loadUserData');
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          this.isLoading = false;
          console.log('finally updateProfile()');
        });
    },
    acceptPromo() {
      console.log('accept');
      this.isLoading = true;
      this.$api.post('/upgrade/subscription/promo').then(() => {
        document.body.classList.remove('vip-modal-opened');
        this.$store.dispatch('loadSubscription').finally(() => {
          this.isLoading = false;
        });
      });
    },
    declinePromo() {
      console.log('decline');
      this.$api.delete('/upgrade/subscription/promo').then(() => {
        document.body.classList.remove('vip-modal-opened');
        this.upgradeSubscription(0, false);
      });
    },
    async upgradeSubscription(tierId = 1, checkForPromo = true) {
      this.isLoading = true;
      if (tierId === 0 && checkForPromo) {
        const promo = await this.$api.get('/upgrade/subscription/promo');
        if (promo) {
          console.log(promo.data);
          this.isLoading = false;
          if (promo.data && promo.data.onCancellation) {
            document.body.classList.add('vip-modal-opened');
            return;
          }
        }
      }
      this.isLoading = true;
      this.$api.put('/upgrade/subscription', {
        tierId,
      })
        .then(async () => {
          if (tierId === 0) {
            this.$noty.success('Your Subscription Has Been Canceled');
          }
          if (tierId === 1) {
            this.$noty.success('Success!');
          }
          try {
            // await this.fetchProfile();
            await this.$store.dispatch('loadSubscription');
          } catch (ex) {
            console.error('inner', ex.message);
            throw ex;
          } finally {
            this.isLoading = false;
          }
        })
        .catch((err) => {
          this.isLoading = false;
          if (err.response) {
            this.$noty.error(err.response.data.message);
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
.input-edit {
  width: 30px;
}
.acc-info {
  width: 500px;
  max-width: 100%;
  margin: 2rem auto 0 auto;
  text-align: center;
}
.acc-info__title {
  margin: 0;
  font-weight: 700;
  font-size: 20px;
}
.acc-inputs {
  margin: 1rem 0;
  p {
    font-size: 14px;
    color: $kimberly;
  }
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
  border-radius: 7px;
  &:not([readonly]) {
    color: #fff;
  }
  &[disabled] {
    opacity: 1 !important;
    -webkit-text-fill-color: $kimberly;
  }
}
.acc-input--editable {
  padding-right: 4rem;

  &.editing {
    border-left: 8px solid $blue;
    outline: none;
  }
}
.acc-input-wrap {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
.input-edit {
  position: absolute;
  width: 14px;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
}
.acc-input-wrap__inner + div {
  margin-top: 1rem;
}
.status-check {
  font-size: 14px;
  .game__loading-dots {
    height: 16px;
  }
  &.is-ok {
    color: #48c774;
  }
  &.is-taken {
    color: #f14668;
  }
}
.input-edit--close,
.input-edit--submit {
  width: 12px;
  fill: $kimberly;
}
.input-edit--submit {
  right: 3.5rem;
}
.ldr {
  background-color: $light-navy;
  &::after {
    animation-name: loader500;
    background: linear-gradient(to right, rgba(29,29,48,1) 8%,rgba(35,35,56,1) 18%,rgba(29,29,48,1) 33%);
  }
}
.profile__take-action {
  width: 500px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  margin-top: 1rem;
  &.has-vip-upgrade {
    display: flex;
    // justify-content: space-between;
    justify-content: center;
    flex-wrap: wrap;
    .button {
      flex: none;
      padding: 12px 24px;
      // flex-basis: calc(50% - .5rem);
    }
  }
  .button {
    margin-top: 1rem;
  }
}
.info {
  color: $kimberly;
  line-height: 1.3;
  margin-top: 1rem;
}
.checkbox-row {
  display: flex;
  align-items: center;
}
label.checkbox {
  text-transform: capitalize;
}
.body-loading {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  z-index: 9;
}
.panel__col.col-middle {
  position: relative;
}
.is-loading.profile__main-body {
  opacity: 0.1;
}
.acc-input--div {
  text-align: left;
  color: $kimberly !important;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  strong {
    color: #fff;
  }
  strong.Cancelled {
    color: $red;
  }
  strong.Active {
    color: $lb-rank-1;
  }
}
.email-notifications .acc-inputs>p:last-of-type {
  margin-bottom: 1.25rem;
}
@media (max-width: 767px) {
  .acc-info {
    margin-bottom: 4rem !important;
  }
}
</style>
