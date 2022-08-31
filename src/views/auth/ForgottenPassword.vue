<template>
  <div class="forgot">
    <template v-if="!sent">
      <h2 class="forgot__title">Forgotten password</h2>
      <form @submit.prevent="getResetPasswordCode" autocomplete="off">
        <div class="forgot__input">
          <input
            v-model="email"
            type="email"
            name="email"
            placeholder="Email"
          >
        </div>

        <div class="forgot__actions">
          <Button
            text="Get new password"
            variant="rounded-blue"
            type="submit"
            :disabled="!email"
          />

          <router-link :to="{ name: 'Login' }" class="forgot__forgotten">Sign in</router-link>
        </div>
      </form>
    </template>

    <div v-else class="forgot__sent">
      <div class="forgot__check-wrapper">
        <img svg-inline src="@/assets/check.svg" alt="Email sent">
      </div>
      <p class="forgot__information">If the information provided is correct, a confirmation email will be sent to the registered email address.</p>
    </div>

    <div v-if="isLoading" class="forgot__loading-overlay">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'ForgottenPassword',
  components: {
    Button,
  },
  data() {
    return {
      isLoading: false,
      email: null,
      sent: false,
    };
  },
  methods: {
    getResetPasswordCode() {
      this.isLoading = true;
      this.$Amplify.Auth.forgotPassword(this.email)
        .then(() => {
          this.sent = true;
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

    & .forgot__sent {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      & .forgot__check-wrapper {
        border-radius: 50%;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid $blue;
        width: fit-content;

        & svg {
          width: 40px;
          path {
            fill: $blue;
          }
        }
      }

      & .forgot__information {
        margin-top: 1rem;
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
