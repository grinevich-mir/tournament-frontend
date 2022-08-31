<template>
  <div class="t-form-wrapper">
    <form class="t-form t-form--register" :class="{ 'is-loading' : isLoading }" v-if="!confirmView" method="post" autocomplete="off" @submit.prevent="signUp">
      <div v-if="useUsername" class="t-form__row">
        <input class="t-form__input" :class="{'not-empty' : username}" id="name" name="name" type="text" v-debounce:500ms="checkDisplayName" v-model="username">
        <label class="t-form__input-label" for="name">Username</label>
        <div v-if="usernameValidator.isBusy" class="status-check status-check__busy">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
        <div class="status-check is-ok" v-if="usernameValidator.isValid && usernameValidator.isAvailable">User name available</div>
        <div class="status-check is-taken" v-else-if="usernameValidator.isValid !== null || usernameValidator.isAvailable !== null">User with that name already exists</div>
      </div>
      <div class="t-form__row" :class="{ 'error' : errors.email.length }">
        <input class="t-form__input" :class="{'not-empty' : email}" id="email" name="email" type="email" v-model="email" @input="isValidEmail">
        <label class="t-form__input-label" for="email">Email</label>
        <ul v-if="errors.email.length" class="errors">
          <li v-for="(error, index) in errors.email" :key="`email-error-${index}`">{{ error }}</li>
        </ul>
      </div>
      <div class="t-form__row"  :class="{ 'error' : errors.password.length }">
        <input class="t-form__input" :class="{'not-empty' : password}" id="password" name="password" type="password" v-model="password" @input="isValidPassword">
        <label class="t-form__input-label" for="password">Password</label>
        <ul v-if="errors.password.length" class="errors">
          <li v-for="(error, index) in errors.password" :key="`password-error-${index}`">{{ error }}</li>
        </ul>
      </div>
      <div class="t-form__row checkboxes" v-if="inEU">
        <div class="checkbox-row">
          <label class="checkbox">
            I want to receive marketing communication
            <input type="checkbox" v-model="checkMarketing">
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
      <div class="t-form__row checkboxes">
        <div class="checkbox-row">
          <label class="checkbox">I agree with the <router-link :to="{ name: 'TermsConditions' }">Terms and Conditions</router-link>
            <input type="checkbox" v-model="checkTerms">
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
      <div class="t-form__row thick-button flex">
        <Button text="Sign Up" variant="green" type="submit" :disabled="!canContinueWithEmailAndPassword"/>
      </div>
      <br>
      <div class="t-form__row">
        <!-- facebook temporarily disabled -->
        <button v-if="false" type="button" class="button button--social button--social-facebook" @click="handleFederatedSignIn('Facebook')"><img svg-inline class="form-social-logo" src="@/assets/Facebook.svg" alt="facebook" />Log in with Facebook</button>
        <!-- google temporarily disabled -->
        <button v-if="false" type="button" class="button button--social button--social-google"><img svg-inline class="form-social-logo" src="@/assets/google-icon.svg" alt="google" />Log in with Google</button>
      </div>
    </form>
    <form class="t-form t-form--register" :class="{ 'is-loading' : isLoading }" v-else method="post" autocomplete="off" @submit.prevent="confirm">
      <div class="t-form__row">
        <div class="code-sent-msg">Validation code sent to <span class="validation-email">{{ email }}</span></div>
      </div>
      <div class="t-form__row">
        <!-- <input class="t-form__input" :class="{'not-empty' : confirmCode}" id="confirmCode" name="confirmCode" type="text" v-model="confirmCode">
        <label class="t-form__input-label" for="confirmCode">Confirm #</label> -->
        <div class="t-form__confirm-code">
          <!-- eslint-disable-next-line -->
          <input id="veri1" class="code--input" type="text" name="code[]" placeholder="" maxLength="1" size="1" min="0" max="9" pattern="\d{1}" v-on:keypress="checkIfNumber($event);" v-on:input="moveOnMax($event,'veri2');" v-on:paste="handlePaste($event);" v-model="verificationNumber[0]" autofocus />
          <input id="veri2" class="code--input" type="text" name="code[]" placeholder="" maxLength="1" size="1" min="0" max="9" pattern="\d{1}" v-on:keypress="checkIfNumber($event);" v-on:input="moveOnMax($event,'veri3');" v-on:keydown="backOnMin($event, 'veri1');" v-model="verificationNumber[1]" />
          <input id="veri3" class="code--input" type="text" name="code[]" placeholder="" maxLength="1" size="1" min="0" max="9" pattern="\d{1}" v-on:keypress="checkIfNumber($event);" v-on:input="moveOnMax($event,'veri4');" v-on:keydown="backOnMin($event, 'veri2');" v-model="verificationNumber[2]" />
          <input id="veri4" class="code--input" type="text" name="code[]" placeholder="" maxLength="1" size="1" min="0" max="9" pattern="\d{1}" v-on:keypress="checkIfNumber($event);" v-on:input="moveOnMax($event,'veri5');" v-on:keydown="backOnMin($event, 'veri3');" v-model="verificationNumber[3]" />
          <input id="veri5" class="code--input" type="text" name="code[]" placeholder="" maxLength="1" size="1" min="0" max="9" pattern="\d{1}" v-on:keypress="checkIfNumber($event);" v-on:input="moveOnMax($event,'veri6');" v-on:keydown="backOnMin($event, 'veri4');" v-model="verificationNumber[4]" />
          <input id="veri6" class="code--input" type="text" name="code[]" placeholder="" maxLength="1" size="1" min="0" max="9" pattern="\d{1}" v-on:keypress="checkIfNumber($event);" v-on:input="moveOnMax($event);" v-on:keydown="backOnMin($event, 'veri5');" v-model="verificationNumber[5]" />
        </div>
      </div>
      <div class="t-form__row thick-button flex">
        <Button text="Start playing" variant="green" type="submit" :disabled="!canContinueVerification"/>
        <a class="t-form__sup-link" @click="resendConfirmationCode">Send another code</a>
      </div>
    </form>
    <div class="form--loading-overlay">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue';
import { isInEUTimezone } from '@segment/in-eu';
import Button from '@/components/global/Button.vue';

export default {
  name: 'RegForm',
  components: {
    Button,
  },
  data() {
    return {
      isLoading: false,
      username: '',
      usernameValidator: {
        isAvailable: null,
        isValid: null,
        isBusy: false,
      },
      email: '',
      password: '',
      confirmView: false,
      confirmCode: '',
      verificationNumber: [],
      checkTerms: false,
      checkMarketing: false,
      check18: false,
      checkResidency: false,
      useUsername: false,
      errors: {
        email: [],
        password: [],
      },
    };
  },
  mounted() {
    this.checkMarketing = !this.inEU;
  },
  computed: {
    canContinueWithEmailAndPassword() { // TODO: MORE CHECKS HERE AS WELL IN THE FUTURE !!!
      let usernameAllGooda = true;
      if (this.useUsername && this.usernameValidator.isAvailable && this.usernameValidator.isValid) {
        usernameAllGooda = true;
      } else if (this.useUsername) {
        usernameAllGooda = false;
      }
      console.log('usernameAllGood', usernameAllGooda);
      return (this.checkTerms && usernameAllGooda && this.email.length > 0 && this.errors.email.length === 0 && this.password.length > 0 && this.errors.password.length === 0);
    },
    canContinueVerification() {
      return (this.confirmCode.length === 6);
    },
    inEU() {
      return isInEUTimezone();
    },
  },
  methods: {
    async confirm() {
      await this.$Amplify.Auth.confirmSignUp(this.email, this.confirmCode)
        .then(async (result) => {
          console.log(result);
          await this.$Amplify.Auth.signIn(this.email, this.password).then(() => {
            AmplifyEventBus.$emit('authState', 'signedIn');
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async resendConfirmationCode() {
      this.isLoading = true;
      try {
        await this.$Amplify.Auth.resendSignUp(this.email);
        console.log('code resent successfully');
        this.confirmCode = '';
      } catch (err) {
        console.log('error resending code: ', err);
      } finally {
        this.isLoading = false;
      }
    },
    isValidEmail() {
      // TODO: this is really simple email validator - worth taking a look here in the future if seeing too many errors in Amplify
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const check = re.test(String(this.email).toLowerCase());
      this.errors.email = [];
      if (!check) {
        this.errors.email.push('Must be a valid email address.');
      }
    },
    isValidPassword() {
      const regexLower = /^(?=.*[a-z]).+$/; // Lowercase character pattern
      const regexUpper = /^(?=.*[A-Z]).+$/; // Uppercase character pattern
      const regexNumber = /^(?=.*[0-9]).+$/; // Number pattern

      this.errors.password = [];
      if (this.password.length < 8) {
        this.errors.password.push('Must be at least 8 characters long.');
      }
      if (!regexLower.test(this.password)) {
        this.errors.password.push('Must contain a lowercase letter.');
      }
      if (!regexUpper.test(this.password)) {
        this.errors.password.push('Must contain an uppercase letter.');
      }
      if (!regexNumber.test(this.password)) {
        this.errors.password.push('Must contain a number.');
      }
    },
    signUp() {
      this.isLoading = true;
      // console.log(this.username, this.email, this.password);

      this.$Amplify.Auth.signUp({
        username: this.email,
        password: this.password,
        attributes: {
          nickname: this.username,
          'custom:marketingOptIn': this.checkMarketing.toString(),
        },
      })
        .then(async (data) => {
          console.log('data1111', data);
          if (data.userConfirmed) {
            await this.$Amplify.Auth.signIn(this.email, this.password).then(() => {
              AmplifyEventBus.$emit('authState', 'signedIn');
            });
          } else {
            this.confirmView = true;
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$noty.error(err.message);
          console.log(err.message || err);
        });
    },
    checkDisplayName() {
      // first client side checks
      if (!this.username) {
        // reset username Validator
        this.usernameValidator.isValid = null;
        this.usernameValidator.isAvailable = null;
        return;
      }
      if (this.username.length < 3) { // TODO: more checks here!
        this.usernameValidator.isValid = false;
        return;
      }
      // reset username Validator and call API
      this.usernameValidator.isBusy = true;
      this.usernameValidator.isAvailable = null;
      this.usernameValidator.isValid = null;
      this.$api
        .post('/user/display-name/check', {
          name: this.username,
        })
        .then((response) => {
          this.usernameValidator.isAvailable = response.data.available;
          this.usernameValidator.isValid = response.data.valid;
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          this.usernameValidator.isBusy = false;
        });
    },
    forgotPassword() {
      console.log('forgot pass!');
    },
    moveOnMax(event, nextFieldID = false) {
      if (event.target.value.length >= event.target.maxLength) {
        if (nextFieldID) {
          document.getElementById(nextFieldID).focus();
        }
      }
      return '';
    },
    handlePaste(event) {
      // console.log(event);
      const inp = document.querySelectorAll('.code--input');
      const pasteStr = event.clipboardData.getData('text').trim();
      if (!/\d{6}/.test(pasteStr)) return event.preventDefault(); // pass invalid. Exit here
      const s = pasteStr.split('');
      for (let i = 0; i < inp.length; i += 1) {
        this.verificationNumber[i] = s[i];
      }
      return '';
    },
    backOnMin(event, prevFieldID) {
      if (event.target.value.length.toString() === event.target.min && (event.which === 8 || event.which === 46)) {
        // event.preventDefault();
        document.getElementById(prevFieldID).select();
      }
    },
    checkIfNumber(event) {
      if (event.which < 48 || event.which > 57) return event.preventDefault();
      return true;
    },
    handleFederatedSignIn(provider) {
      this.$Amplify.Auth.federatedSignIn({ provider });
    },
  },
  watch: {
    verificationNumber(val) {
      this.confirmCode = val.join('');
    },
  },
};
</script>

<style lang="scss">
  .code-sent-msg {
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 1.5;
  }
  .validation-email {
    font-weight: 600;
  }
  .t-form__confirm-code {
    display: flex;
    justify-content: space-around;
  }
  .code--input {
    background-color: transparent;
    color: $kimberly;
    border-radius: 0;
    outline: none;
    border-bottom: 1px solid #fff;
    font-size: 18px;
    text-align: center;
    padding: .5rem 0;
    width: 40px;
    &:focus {
      border-bottom: 1px solid $kimberly;
    }
  }
</style>
