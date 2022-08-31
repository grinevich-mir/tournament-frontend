<template>
  <div class="t-form-wrapper">
    <form v-if="isForgotPasswordView === 'forgot'" class="t-form t-form--forgot" method="post" :class="{ 'is-loading': isLoading }" @submit.prevent="handleForgotPassword" autocomplete="off">
      <input type="hidden" autocomplete="off">
      <div class="forgot-title">Forgotten Password?</div>
      <div class="t-form__row">
        <input class="t-form__input" :class="{'not-empty' : email}" id="email" name="email" type="email" v-model="email">
        <label class="t-form__input-label" for="email">Email</label>
      </div>
      <div class="t-form__row thick-button flex">
        <Button text="Get New Password" variant="rounded-blue" type="submit" :disabled="!email"/>
        <a class="t-form__sup-link" @click="switchToLogin">Log In</a>
      </div>
    </form>

    <form v-else-if="isForgotPasswordView === 'code'" class="t-form t-form--forgot" method="post" :class="{ 'is-loading': isLoading }" @submit.prevent="handleForgotPasswordSubmit" autocomplete="off">
      <div style="height: 0px; visibility: hidden; opacity: 0; position: absolute; bottom: 0px;">
        <!-- fake fields are a workaround for chrome autofill getting the wrong fields -->
        <input type="text" name="prevent_autofill" id="prevent_autofill" value="" style="display:none;" />
        <input type="password" name="password_fake" id="password_fake" value="" style="display:none;" />
        <input type="password" name="password" id="password" value="" />
      </div>
      <input type="hidden" autocomplete="off">
      <div class="forgot-title">Confirmation Required</div>
      <div class="forgot-subtitle">A code was sent to {{ email }} please enter it here and your new password below:</div>
      <div class="t-form__row">
        <input class="t-form__input" :class="{'not-empty' : forgotCode}" id="code" name="code" type="text" v-model="forgotCode">
        <label class="t-form__input-label" for="code">Password Reset Code</label>
      </div>
      <div class="t-form__row">
        <input class="t-form__input" :class="{'not-empty' : newPassword}" id="new-password" name="new-password" type="password" v-model="newPassword" autocomplete="new-password">
        <label class="t-form__input-label" for="new-password">New Password</label>
      </div>
      <div class="t-form__row thick-button flex">
        <Button text="Get New Password" variant="rounded-blue" type="submit" :disabled="!(forgotCode && newPassword)"/>
        <a class="t-form__sup-link" @click="switchToLogin">Log In</a>
      </div>
    </form>

    <form v-else class="t-form t-form--login" method="post" :class="{ 'is-loading': isLoading }" @submit.prevent="signIn">
      <div class="t-form__row">
        <input class="t-form__input" :class="{'not-empty' : email}" id="email" name="email" type="email" placeholder="Email" v-model="email">
        <!-- <label class="t-form__input-label" for="email">Email</label> -->
      </div>
      <div class="t-form__row">
        <input class="t-form__input" :class="{'not-empty' : password}" id="password" name="password" type="password" placeholder="Password" v-model="password">
        <!-- <label class="t-form__input-label" for="password">Password</label> -->
      </div>
      <div class="t-form__row thick-button flex">
        <Button text="Sign in" variant="rounded-blue" type="submit" :disabled="!(email && password)"/>
        <a class="t-form__sup-link" @click="switchToForgotPassword">Forgot Password?</a>
      </div>
      <div class="t-form__row">
        <!-- facebook temporarily disabled -->
        <button v-if="false" type="button" class="button button--social button--social-facebook" @click="handleFederatedSignIn('Facebook')"><img svg-inline class="form-social-logo" src="@/assets/Facebook.svg" alt="facebook" />Log in with Facebook</button>
        <!-- google temporarily disabled -->
        <button v-if="false" type="button" class="button button--social button--social-google"><img svg-inline class="form-social-logo" src="@/assets/google-icon.svg" alt="google" />Log in with Google</button>
      </div>
    </form>

    <div class="form--loading-overlay">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'LoginForm',
  components: {
    Button,
  },
  data() {
    return {
      isLoading: false,
      email: '',
      password: '',
      confirmView: false,
      isForgotPasswordView: false,
      newPassword: '',
      forgotCode: '&nbsp;',
    };
  },
  computed: {
    //
  },
  mounted() {
    if ('action' in this.$route.query) {
      if (this.$route.query.action === 'forgotpassword') {
        this.isForgotPasswordView = 'forgot';
      } else if (this.$route.query.action === 'newpassword' && this.email) {
        this.isForgotPasswordView = 'code';
      } else if (this.$route.query.action === 'newpassword' && !this.email) {
        this.switchToForgotPassword();
      }
    }
  },
  methods: {
    signIn() {
      this.isLoading = true;
      this.$Amplify.Auth.signIn(this.email, this.password)
        .then(async (user) => {
          if (user.challengeName === 'SMS_MFA') {
            this.confirmView = true;
          } else {
            this.isLoading = false;
            AmplifyEventBus.$emit('authState', 'signedIn');
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$noty.error(err.message);
          console.log(err.message || err);
        });
    },
    switchToForgotPassword() {
      this.isForgotPasswordView = 'forgot';
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, action: 'forgotpassword' } });
    },
    switchToSetNewPassword() {
      this.isForgotPasswordView = 'code';
      this.$router.replace({ name: this.$route.name, query: { ...this.$route.query, action: 'newpassword' } });
      this.forgotCode = '';
    },
    switchToLogin() {
      this.isForgotPasswordView = false;
      this.$router.replace({ name: this.$route.name });
    },
    handleForgotPassword() {
      this.isLoading = true;
      this.$Amplify.Auth.forgotPassword(this.email)
        .then((response) => {
          this.isLoading = false;
          // this.$noty.success('Succcess! Check your e-mail address for the password reset code.');
          this.switchToSetNewPassword();
          console.log(response);
        })
        .catch((err) => {
          this.isLoading = false;
          this.$noty.error(err.message);
          console.log(err.message || err);
        });
    },
    handleForgotPasswordSubmit() {
      this.isLoading = true;
      this.$Amplify.Auth.forgotPasswordSubmit(this.email, this.forgotCode, this.newPassword)
        .then((response) => {
          this.isLoading = false;
          this.$noty.success('Password changed!');
          this.switchToLogin();
          this.password = this.newPassword;
          console.log(response);
        })
        .catch((err) => {
          this.isLoading = false;
          this.$noty.error(err.message);
          console.log(err.message || err);
        });
    },
    handleFederatedSignIn(provider) {
      this.$Amplify.Auth.federatedSignIn({ provider });
    },
  },
};
</script>

<style>
.forgot-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
}

.forgot-subtitle {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-top: -2rem;
  margin-bottom: 3rem;
}

@media (max-width: 767px) {
  .forgot-title {
    font-size: 14px;
    margin-bottom: 2rem;
  }
}
</style>
