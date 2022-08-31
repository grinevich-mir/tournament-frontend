<template>
  <div class="forgot">
    <h2 class="forgot__title">Reset password</h2>
    <form @submit.prevent="setNewPassword" autocomplete="off">
      <div style="height: 0px; visibility: hidden; opacity: 0; position: absolute; bottom: 0px;">
        <!-- fake fields are a workaround for chrome autofill getting the wrong fields -->
        <input type="text" name="prevent_autofill" id="prevent_autofill" value="" style="display:none;" />
        <input type="password" name="password_fake" id="password_fake" value="" style="display:none;" />
        <input type="password" name="password" id="password" value="" />
      </div>
      <input type="hidden" autocomplete="off">

      <div class="forgot__input">
          <!-- v-show="false" -->
        <input
          v-model="code"
          v-show="false"
          type="text"
          name="code"
          placeholder="Password reset code"
        >
      </div>

      <div class="forgot__input">
        <input
          v-model="password"
          type="password"
          name="password"
          placeholder="New password"
        >
      </div>

      <div class="forgot__actions">
        <Button
          text="Set new password"
          variant="rounded-blue"
          type="submit"
          :disabled="!email"
        />

        <router-link :to="{ name: 'Login' }" class="forgot__forgotten">Sign in</router-link>
      </div>
    </form>

    <div v-if="isLoading" class="forgot__loading-overlay">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'ResetPassword',
  components: {
    Button,
  },
  data() {
    return {
      isLoading: false,
      // errors: [],
      email: null,
      code: null,
      password: null,
    };
  },
  mounted() {
    if (!this.$route.query.email || !this.$route.query.code) {
      this.$router.replace({ name: 'Register' });
    } else {
      this.email = this.$route.query.email;
      this.code = this.$route.query.code;
    }
  },
  methods: {
    setNewPassword() {
      this.isLoading = true;
      this.$Amplify.Auth.forgotPasswordSubmit(this.email, this.code, this.password)
        .then(() => {
          this.$noty.success('Password changed!');
          this.$router.push({ name: 'Login' });
          this.password = this.newPassword;
        })
        .catch((err) => {
          this.$noty.error(err.message);
          console.log(err.message || err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
  .forgot {
    width: 350px;

    & .forgot__title {
      margin-bottom: 1rem;
      padding-left: 10px;
    }

    & form {
      & .forgot__input > input,
      & .forgot__input > input:-webkit-autofill {
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

      & .forgot__actions {
        display: flex;
        flex-direction: column;
        align-items: center;

        & .button {
          width: 100%;
          height: 40px;
          min-height: 40px;
          font-size: 16px;
        }

        & .forgot__forgotten {
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

    & .forgot__loading-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% + 2rem);
      height: calc(100% + 2rem);
      background-color: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
    }
  }

  @media (max-width: 767px) {
    .login {
      width: 100%;
    }
  }
</style>
