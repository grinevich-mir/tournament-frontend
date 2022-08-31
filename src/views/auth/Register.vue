<template>
  <div class="register" :class="authMode ? 'auth' : 'home'">
    <div class="register__title" v-if="authMode">
      <!-- <p class="step">Step 1 of 3</p> -->
      <h2>Create account</h2>
    </div>
    <form @submit.prevent="signUp" autocomplete="off" v-if="!confirmView">
      <input type="email" autocomplete="off" name="hidden" style="display:none;">
      <input type="password" autocomplete="off" name="hidden" style="display:none;">
      <input type="number" autocomplete="off" name="hidden" style="display:none;">
      <input type="tel" autocomplete="off" name="hidden" style="display:none;">
      <div class="register__input">
        <input
          v-model="email"
          type="email"
          name="email"
          placeholder="Email"
          @input="isValidEmail"
          :class="{ 'error' : errors.email.length }"
          autocomplete="new-password"
          tabindex="1"
        >
        <ul v-if="errors.email.length" class="errors">
          <li v-for="(error, index) in errors.email" :key="`email-error-${index}`">{{error}}</li>
        </ul>
      </div>

      <div class="register__input" v-if="mobileRequired">
        <template>
          <vue-tel-input :defaultCountry="mobileCountry" :autoDefaultCountry="false" :validCharactersOnly="true" :inputOptions="mobileOptions" class="mobile-number" @input="mobileChanged"></vue-tel-input>
        </template>
        <ul v-if="errors.mobile.length" class="errors">
          <li v-for="(error, index) in errors.mobile" :key="`mobile-error-${index}`">{{error}}</li>
        </ul>
      </div>

      <div class="register__input">
        <input
          v-model="password"
          type="password"
          name="password"
          placeholder="Password"
          @input="isValidPassword"
          :class="{ 'error' : errors.password.length }"
          autocomplete="new-password"
          tabindex="3"
        >
        <ul v-if="errors.password.length" class="errors">
          <li v-for="(error, index) in errors.password" :key="`password-error-${index}`">{{error}}</li>
        </ul>
      </div>

      <template v-if="!referredCode">
        <p class="referral-toggle" v-if="!showRefInput" @click="showRefInput = true">Got a referral code?</p>
        <div class="register__input" v-else>
          <input
            v-model="referralCode"
            type="text"
            name="refcode"
            placeholder="Referral Code"
            autocomplete="off"
            :class="{ 'error' : errors.referralCode.length }"
            @input="isValidRefCode"
            maxlength="8"
          >
          <ul v-if="errors.referralCode.length" class="errors">
            <li v-for="(error, index) in errors.referralCode" :key="`referralCode-error-${index}`">{{error}}</li>
          </ul>
        </div>
      </template>

      <div class="register__input register__checkbox">
        <template v-if="inEU">
          <label class="checkbox" tabindex="4">
            I want to receive marketing communication
            <input type="checkbox" v-model="checkMarketing">
            <span class="checkmark"></span>
          </label>
        </template>

        <label class="checkbox" tabindex="5">
          I agree with the <router-link :to="{ name: 'TermsConditions' }">Terms and Conditions</router-link>
          <input type="checkbox" v-model="checkTerms">
          <span class="checkmark"></span>
        </label>
      </div>

      <div class="register__actions">
        <Button
          :text="authMode ? 'Sign up' : 'Register'"
          variant="rounded-blue"
          type="submit"
          :disabled="!canContinueWithEmailAndPassword"
          tabindex="6"
        />
      </div>
      <div class="mobile-notice">
        Please make sure you have entered your mobile number correctly as it will be verified via SMS before you can use your account.
      </div>
    </form>
    <form v-else method="post" autocomplete="off" @submit.prevent="confirm">
      <div class="t-form__row">
        <div class="code-sent-msg">Verification code sent to <span class="validation-phone">{{ mobile }}</span></div>
      </div>
      <div class="t-form__row">
        <div class="t-form__confirm-code">
          <!-- eslint-disable-next-line -->
          <input id="veri1" class="code--input" type="text" inputmode="numeric" name="code[]" placeholder="" size="1" min="0" max="9" pattern="\d{1}"
            v-on:keypress="checkIfNumber($event);" v-on:input="handleOverage($event);moveOnMax($event,'veri2');" v-model="verificationNumber[0]" />
          <input id="veri2" class="code--input" type="text" inputmode="numeric" name="code[]" placeholder="" size="1" min="0" max="9" pattern="\d{1}"
            v-on:keypress="checkIfNumber($event);" v-on:input="handleOverage($event);moveOnMax($event,'veri3');" v-on:keydown="backOnMin($event, 'veri1');" v-model="verificationNumber[1]" />
          <input id="veri3" class="code--input" type="text" inputmode="numeric" name="code[]" placeholder="" size="1" min="0" max="9" pattern="\d{1}"
            v-on:keypress="checkIfNumber($event);" v-on:input="handleOverage($event);moveOnMax($event,'veri4');" v-on:keydown="backOnMin($event, 'veri2');" v-model="verificationNumber[2]" />
          <input id="veri4" class="code--input" type="text" inputmode="numeric" name="code[]" placeholder="" size="1" min="0" max="9" pattern="\d{1}"
            v-on:keypress="checkIfNumber($event);" v-on:input="handleOverage($event);moveOnMax($event,'veri5');" v-on:keydown="backOnMin($event, 'veri3');" v-model="verificationNumber[3]" />
          <input id="veri5" class="code--input" type="text" inputmode="numeric" name="code[]" placeholder="" size="1" min="0" max="9" pattern="\d{1}"
            v-on:keypress="checkIfNumber($event);" v-on:input="handleOverage($event);moveOnMax($event,'veri6');" v-on:keydown="backOnMin($event, 'veri4');" v-model="verificationNumber[4]" />
          <input id="veri6" class="code--input" type="text" inputmode="numeric" name="code[]" placeholder="" size="1" maxlength="1" min="0" max="9"
            pattern="\d{1}" v-on:keypress="checkIfNumber($event);" v-on:input="handleOverage($event);moveOnMax($event);" v-on:keydown="backOnMin($event, 'veri5');" v-model="verificationNumber[5]" />
        </div>
      </div>
      <div class="t-form__row thick-button flex">
        <Button text="Confirm" variant="rounded-blue" type="submit" :disabled="!canContinueVerification"/>
        <a class="t-form__sup-link" @click="resendConfirmationCode">Send another code</a>
      </div>
    </form>

    <div v-if="isLoading" class="register__loading-overlay">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue';
import { isInEUTimezone } from '@segment/in-eu';
import Button from '@/components/global/Button.vue';

export default {
  name: 'Register',
  components: {
    Button,
  },
  props: {
    authMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isLoading: false,
      errors: {
        email: [],
        password: [],
        mobile: [],
        referralCode: [],
      },
      email: null,
      mobile: null,
      mobileData: null,
      mobileCountry: 'US',
      mobileOptions: {
        maxlength: 25,
        name: 'mobile',
        placeholder: 'Mobile Phone',
        type: 'tel',
        tabindex: 2,
      },
      password: null,
      passwordChecks: ['length'],
      // Password Checks available options:
      // 'length' - Must be at least 8 characters long.
      // 'uppercase' - Must contain an uppercase letter.
      // 'lowercase' - Must contain a lowercase letter.
      // 'number' - Must contain a number.
      showRefInput: false,
      referralCode: null,
      checkMarketing: false,
      checkTerms: false,
      btag: this.$cookies.get('affx'),
      referredCode: this.$cookies.get('referredCode'),
      confirmView: false,
      confirmCode: '',
      verificationNumber: [],
    };
  },
  created() {
    if (this.$route.params.email) {
      this.email = this.$route.params.email;
      this.isValidEmail();
    }

    const [, country] = navigator.language.split('-');
    this.mobileCountry = country;
  },
  mounted() {
    this.checkMarketing = !this.inEU;
  },
  computed: {
    canContinueWithEmailAndPassword() { // TODO: MORE CHECKS HERE AS WELL IN THE FUTURE !!!
      // let usernameAllGooda = true;
      // if (this.useUsername && this.usernameValidator.isAvailable && this.usernameValidator.isValid) {
      //   usernameAllGooda = true;
      // } else if (this.useUsername) {
      //   usernameAllGooda = false;
      // }
      // console.log('usernameAllGood', usernameAllGooda);
      return (this.checkTerms /* && usernameAllGooda */ && this.email && this.email.length > 0 && this.errors.email.length === 0 && this.password && this.password.length > 0 && this.errors.password.length === 0 && (!this.mobileRequired || this.mobileData.valid));
    },
    inEU() {
      return isInEUTimezone();
    },
    canContinueVerification() {
      return (this.confirmCode.length === 6);
    },
    mobileRequired() {
      return process.env.VUE_APP_MOBILE_REQUIRED === 'true';
    },
  },
  methods: {
    isValidEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isValid = re.test(String(this.email).toLowerCase());
      this.errors.email = [];
      if (!isValid) {
        this.errors.email.push('Must be a valid email address.');
      }
    },
    isValidPassword() {
      const regexLower = /^(?=.*[a-z]).+$/; // Lowercase character pattern
      const regexUpper = /^(?=.*[A-Z]).+$/; // Uppercase character pattern
      const regexNumber = /^(?=.*[0-9]).+$/; // Number pattern

      this.errors.password = [];
      if (this.passwordChecks.includes('length') && this.password.length < 8) {
        this.errors.password.push('Must be at least 8 characters long.');
      }
      if (this.passwordChecks.includes('lowercase') && !regexLower.test(this.password)) {
        this.errors.password.push('Must contain a lowercase letter.');
      }
      if (this.passwordChecks.includes('uppercase') && !regexUpper.test(this.password)) {
        this.errors.password.push('Must contain an uppercase letter.');
      }
      if (this.passwordChecks.includes('number') && !regexNumber.test(this.password)) {
        this.errors.password.push('Must contain a number.');
      }
    },
    isValidRefCode() {
      const re = /^[a-zA-Z0-9\-_]*$/;
      const isValid = re.test(String(this.referralCode));
      this.errors.referralCode = [];
      if (!isValid) {
        this.errors.referralCode.push('Wrong referral code format.');
      }
      if (this.referralCode.length !== 8) {
        this.errors.password.push('Must be 8 characters long.');
      }
    },
    signUp() {
      this.isLoading = true;
      const attributes = {
        nickname: '',
        phone_number: this.mobile,
        'custom:marketingOptIn': this.checkMarketing.toString(),
      };
      if (this.btag) {
        attributes['custom:btag'] = this.btag;
      }
      if (this.referredCode) {
        attributes['custom:referredCode'] = this.referredCode;
      } else if (this.referralCode) {
        attributes['custom:referredCode'] = this.referralCode;
      }
      this.$Amplify.Auth.signUp({
        username: this.email,
        password: this.password,
        attributes,
      })
        .then(async (data) => {
          this.$cookies.remove('referredCode');
          if (data.userConfirmed) {
            await this.$Amplify.Auth.signIn(this.email, this.password).then(() => {
              // this.$router.replace({ name: 'Upgrade', query: { register: true, step: 1 } });
              if (this.$route.query.redirect) {
                this.$router.replace({ path: this.$route.query.redirect });
              } else {
                this.$router.replace({ name: 'Lobby', query: { store: true, showTutorial: true } });
              }
              AmplifyEventBus.$emit('authState', 'signedIn');
            });
          } else {
            this.confirmView = true;
            this.focusCode();
          }
        })
        .catch((err) => {
          const message = err.message.replace('PreSignUp failed with error', '');

          this.$noty.error(message);
          console.log(message || err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async confirm() {
      this.isLoading = true;
      await this.$Amplify.Auth.confirmSignUp(this.email, this.confirmCode)
        .then(async (result) => {
          console.log(result);
          await this.$Amplify.Auth.signIn(this.email, this.password).then(() => {
            // this.$router.replace({ name: 'Upgrade', query: { register: true, step: 1 } });
            if (this.$route.query.redirect) {
              this.$router.replace({ path: this.$route.query.redirect });
            } else {
              this.$router.replace({ name: 'Lobby', query: { store: true, showTutorial: true } });
            }
            AmplifyEventBus.$emit('authState', 'signedIn');
          });
        })
        .catch((err) => {
          console.log(err.message);
          this.$noty.error(err.message);
        }).finally(() => {
          this.isLoading = false;
          this.confirmCode = '';
          this.verificationNumber = [];
        });
    },
    async resendConfirmationCode() {
      this.isLoading = true;
      try {
        await this.$Amplify.Auth.resendSignUp(this.email);
        console.log('code resent successfully');
      } catch (err) {
        console.log('error resending code: ', err);
        this.$noty.error(err.message);
      } finally {
        this.isLoading = false;
        this.confirmCode = '';
        this.verificationNumber = [];
      }
    },
    checkIfNumber(event) {
      if (event.which < 48 || event.which > 57) return event.preventDefault();
      return true;
    },
    moveOnMax(event, nextFieldID = false) {
      if (event.target.value.length >= 1) {
        if (nextFieldID) {
          document.getElementById(nextFieldID).focus();
        }
      }
      return '';
    },
    handleOverage(event) {
      if (event.target.value.length > 1) {
        this.verificationNumber = event.target.value.split('');
        setImmediate(() => document.getElementById(`veri${this.verificationNumber.length}`).focus());
        event.preventDefault();
        event.stopPropagation(true);
      }
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
      console.log(event.which);
      if ((event.target.value.length === 0 || event.target.value.length.toString() === event.target.min) && (event.which === 8 || event.which === 46)) {
        // event.preventDefault();
        document.getElementById(prevFieldID).select();
      }
    },
    mobileChanged(number, data) {
      this.mobileData = data;
      this.mobile = data.number;

      this.errors.mobile = [];

      if (!this.mobileData.valid && this.mobileData.number) {
        this.errors.mobile.push('Please enter a valid mobile number.');
      }
    },
    focusCode() {
      setTimeout(() => document.getElementById(`veri1`).focus(), 100);
    },
  },
  watch: {
    verificationNumber(val) {
      this.confirmCode = val.join('');
    },
  },
};
</script>

<style lang="scss" scoped>
  .register.auth {
    width: 370px;
    background-color: #fff;
    padding: 0 1rem;

    & .register__title {
      margin-bottom: 1rem;
      padding-left: 6px;
      font-weight: 600;

      & .step {
        font-size: 13px;
        font-weight: normal;
        margin-bottom: 6px;
      }
    }

    & form {
      & .referral-toggle {
        color: $blue;
        font-size: 14px;
        text-decoration: underline;
        cursor: pointer;
        margin-bottom: 1rem;
        margin-left: 10px;
        &:hover {
          color: #4498e7;
        }
      }
      & .register__input {
        margin-bottom: 1rem;

        & input {
          height: 40px;
          width: 100%;
          color: #4D4D4D !important;
          -webkit-text-fill-color: #4D4D4D !important;
          border: 1px solid #5A5A5A;
          border-radius: 5px;
          text-align: left;
          padding: 0 10px;
          font-size: 14px;

          &:focus {
            border: 2px solid #5A5A5A;
            outline: none;
          }

          &.error {
            border-color: $red;
          }
        }

        &.register__checkbox {
          padding-left: 6px;

          & > label {
            color: #000;
            font-size: 14px;

            & > input {
              display: none;
            }

            & > a {
              color: $blue;
            }
          }
        }

        & > ul.errors {
          margin-bottom: 1rem;
          margin-top: 0.5rem;
        }
      }

      & .register__actions {
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

      .mobile-number {
        border: 1px solid #5A5A5A;
        padding: 5px;
        border-radius: 5px;

        &:focus-within {
          border-width: 2px;
          padding: 4px;
          box-shadow: none;
        }
      }
    }

    & .register__loading-overlay {
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

  .register.home {
    & form {
      & .register__input {
        margin-bottom: 1rem;
        background-color: transparent !important;

        & input {
          width: 100%;
          background-color: transparent !important;
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
          border-bottom: 1px solid #fff;
          text-align: left;
          padding: 12.5px;
          font-size: 14px;

          &:focus {
            border-bottom: 1px solid $blue;
            outline: none;
          }

          &.error {
            border-color: $red;
          }
        }

        &.register__checkbox {
          padding-left: 6px;

          & > label {
            font-size: 11px;
            font-weight: 400;
            line-height: 16px;
            text-align: left;

            & > input {
              display: none;
            }

            & > a {
              color: $kimberly;
              &:hover {
                color: $kimberly-light;
              }
            }
          }
          .checkmark {
            border: 1px solid #fff;
            background-color: transparent;
          }
          .checkbox:hover input ~ .checkmark {
            background-color: #ccc;
          }
          .checkbox input:checked ~ .checkmark {
            background-color: $blue;
            border: 1px solid $blue;
          }
        }

        & > ul.errors {
          margin-bottom: 1rem;
          margin-top: 0.5rem;
        }
      }

      & .register__actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40px;

        & .button {
          width: 100%;
          height: 40px;
          min-height: 40px;
          font-size: 16px;
        }
      }
    }

    & .register__loading-overlay {
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

  .code-sent-msg {
    color: #000;
  }

  .code--input {
    border-radius: 5px;
    border: 1px solid #000;
  }

  @media (max-width: 767px) {
    .login {
      width: 100%;
    }
  }

  .mobile-notice {
    padding-top: 10px;
    font-size: 11px;
    text-align: center;
  }
</style>

<style lang="scss">
  .vti__input {
    font-size: 14px;
    color: #4D4D4D;
    -webkit-text-fill-color: #4D4D4D !important;
  }

  @media (max-width: 767px) {
    .vti__dropdown-list {
      border-radius: 5px;
      position: fixed;
      top: 10px !important;
      left: 10px;
      right: 10px;
      bottom: 10px;
      max-height: none;
      width: auto;

      .vti__dropdown-item {
        font-size: 16px;
        padding: 8px;
      }
    }
  }

  .vti__dropdown-item {
    font-size: 14px;

    b, strong {
      font-weight: normal;
    }
  }

  .vti__country-code {
    margin-right: 3px;
  }
</style>
