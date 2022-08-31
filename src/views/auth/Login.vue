<template>
  <div class="login">
    <h2 class="login__title">Sign in</h2>
    <form @submit.prevent="signIn" v-if="!confirmView">
      <div class="login__input">
        <input
          v-model="email"
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="email"
        >
      </div>

      <div class="login__input">
        <input
          v-model="password"
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="password"
        >
      </div>

      <div class="login__actions">
        <Button
          text="Sign in"
          variant="rounded-blue"
          type="submit"
          :disabled="!(email && password)"
        />

        <router-link :to="{ name: 'ForgottenPassword' }" class="login__forgotten">Forgotten password?</router-link>
      </div>
    </form>
    <form method="post" autocomplete="off" v-else @submit.prevent="confirm">
      <div class="t-form__row">
        <div class="code-sent-msg">Verification code sent to {{ mobile }}</div>
      </div>
      <div class="t-form__row">
        <div class="t-form__confirm-code">
          <!-- eslint-disable-next-line -->
          <input id="veri1" class="code--input" type="text" inputmode="numeric" name="code[]" placeholder="" size="1" min="0" max="9" pattern="\d{1}"
            v-on:keypress="checkIfNumber($event);" v-on:input="handleOverage($event);moveOnMax($event,'veri2');" v-model="verificationNumber[0]" autofocus />
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

    <div v-if="isLoading" class="login__loading-overlay">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'Login',
  components: {
    Button,
  },
  data() {
    return {
      isLoading: false,
      // errors: [],
      email: null,
      password: null,
      mobile: null,
      confirmView: false,
      confirmCode: '',
      verificationNumber: [],
      recaptchaToken: null,
    };
  },
  mounted() {
    const grecaptcha = document.getElementsByClassName('grecaptcha-badge')[0];
    grecaptcha.classList.add('visible');
  },
  beforeDestroy() {
    const grecaptcha = document.getElementsByClassName('grecaptcha-badge')[0];
    grecaptcha.classList.remove('visible');
  },
  computed: {
    canContinueVerification() {
      return (this.confirmCode.length === 6);
    },
  },
  methods: {
    signIn() {
      this.isLoading = true;
      grecaptcha.enterprise.ready(() => { // eslint-disable-line
        grecaptcha.enterprise.execute('6LcTUsocAAAAAIk8TexSQNMOxwIi3RX8pzN9tcwy', { // eslint-disable-line
          action: 'login',
        }).then((token) => {
          this.recaptchaToken = token;

          this.$Amplify.Auth.signIn(this.email, this.password, {
            captchaToken: this.recaptchaToken,
          }).then(() => {
            this.isLoading = false;
            AmplifyEventBus.$emit('authState', 'signedIn');
          }).catch(async (err) => {
            this.isLoading = false;

            if (err.name === 'UserNotConfirmedException') {
              await this.resendConfirmationCode();
              this.confirmView = true;
              this.focusCode();
              return;
            }

            this.$noty.error(err.message);
            console.log(err.message || err);
          });
        });
      });
    },
    async resendConfirmationCode() {
      this.isLoading = true;
      try {
        const data = await this.$Amplify.Auth.resendSignUp(this.email);
        this.mobile = data.CodeDeliveryDetails.Destination;
        console.log('code resent successfully');
      } catch (err) {
        console.log('error resending code: ', err);
        this.$noty.error(err.message);
      } finally {
        this.isLoading = false;
        this.verificationNumber = [];
        this.confirmCode = '';
      }
    },
    confirm() {
      this.isLoading = true;
      grecaptcha.enterprise.ready(() => { // eslint-disable-line
        grecaptcha.enterprise.execute('6LcTUsocAAAAAIk8TexSQNMOxwIi3RX8pzN9tcwy', { // eslint-disable-line
          action: 'login',
        }).then((token) => {
          this.recaptchaToken = token;

          this.$Amplify.Auth.confirmSignUp(this.email, this.confirmCode)
            .then((result) => {
              console.log(result);
              this.$Amplify.Auth.signIn(this.email, this.password, {
                captchaToken: this.recaptchaToken,
              }).then(() => {
                AmplifyEventBus.$emit('authState', 'signedIn');
              });
            })
            .catch((err) => {
              console.log(err.message);
              this.$noty.error(err.message);
            }).finally(() => {
              this.isLoading = false;
              this.verificationNumber = [];
              this.confirmCode = '';
            });
        });
      });
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
  .login {
    width: 370px;
    background-color: #fff;
    padding: 0 1rem;

    & .login__title {
      margin-bottom: 1rem;
      padding-left: 6px;
    }

    & form {
      & .login__input > input {
        height: 40px;
        width: 100%;
        color: #4D4D4D !important;
        -webkit-text-fill-color: #4D4D4D !important;
        border: 1px solid #5A5A5A;
        border-radius: 5px;
        margin-bottom: 1rem;
        text-align: left;
        padding: 0 10px;
        font-size: 14px;

        &:focus {
          border: 2px solid #5A5A5A;
          outline: none;
        }
      }

      & .login__actions {
        display: flex;
        flex-direction: column;
        align-items: center;

        & .button {
          width: 100%;
          height: 40px;
          min-height: 40px;
          font-size: 16px;
        }

        & .login__forgotten {
          color: #4E4E4E;
          margin-top: 1rem;
          font-size: 14px;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }

    & .login__loading-overlay {
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
</style>
