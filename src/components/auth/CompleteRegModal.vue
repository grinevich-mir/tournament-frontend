<template>
  <div class="modal-big-wrapper">
    <div class="modal-big">
      <div class="modal-header">Complete your profile</div>
      <div class="modal-body">
        <div class="help">
          <p>Please add a community friendly username that will be displayed in chat, leaderboards and other community based features</p>
        </div>
        <form class="t-form t-form--register" :class="{ 'is-loading' : isLoading }" method="post" autocomplete="off" @submit.prevent="completeReg">
          <div class="t-form__row">
            <input class="t-form__input" :class="{'not-empty' : username}" id="name" name="name" type="text" v-debounce:500ms="checkDisplayName" v-model="username">
            <label class="t-form__input-label" for="name">Username</label>
            <div v-if="usernameValidator.isBusy" class="status-check status-check__busy">
              <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
            </div>
            <div class="status-check is-ok" v-if="usernameValidator.isValid && usernameValidator.isAvailable">User name available</div>
            <div class="status-check is-taken" v-else-if="usernameValidator.isValid !== null || usernameValidator.isAvailable !== null">User with that name already exists</div>
          </div>
          <!-- <div class="t-form__row checkboxes">
            <div class="checkbox-row">
              <label class="checkbox">I agree with the <router-link :to="{ name: 'TermsConditions' }" target="_blank">Terms</router-link>
                <input type="checkbox" v-model="checkTerms">
                <span class="checkmark"></span>
              </label>
            </div>
          </div> -->
          <div class="t-form__row thick-button flex">
            <Button text="Continue" variant="rounded-blue" type="submit" :disabled="!canContinue"/>
          </div>
          <br>
        </form>
        <div class="form--loading-overlay">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'CompleteRegModal',
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
      // checkTerms: false,
      check18: false,
      checkResidency: false,
    };
  },
  computed: {
    userData() {
      return this.$store.state.auth.userData;
    },
    canContinue() {
      return (this.usernameValidator.isAvailable && this.usernameValidator.isValid);
    },
    displayNameStore() {
      if (this.userData) {
        return this.userData.displayName;
      }
      return '';
    },
  },
  watch: {
    displayNameStore(newValue) {
      this.username = newValue;

      if (newValue) {
        this.checkDisplayName();
      }
    },
  },
  created() {
    if (this.userData) {
      this.username = this.userData.displayName;
      if (this.username) {
        this.checkDisplayName();
      }
    }
  },
  methods: {
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
    completeReg() {
      this.isLoading = true;

      if (!(this.usernameValidator.isAvailable && this.usernameValidator.isValid)) return;
      this.usernameValidator.isAvailable = null;
      this.usernameValidator.isValid = null;
      this.$api
        .put('/user/display-name', {
          name: this.username,
        })
        .then(() => {
          this.isLoading = false;
          this.$store.dispatch('loadUserData');
          this.$emit('completed');
        })
        .catch((err) => {
          this.isLoading = false;
          this.$noty.error(err.message);
          console.log(err.message || err);
        })
        .finally(() => {
          this.usernameValidator.isBusy = false;
          console.log('finally completeReg()');
        });
    },
  },
};
</script>

<style lang="scss">
  @import '~@/scss/forms.scss';

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

  .modal-big-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 99999;
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-big {
      width: 600px;
      max-width: calc(100% - 1rem);
      background: #0b0c11;
      padding: 2rem;
    }
    .modal-header {
      font-size: 1.8rem;
      font-weight: 800;
      text-align: center;
    }
    .help {
      margin-top: 1.5rem;
      margin-bottom: 2rem;
      line-height: 1.4;
      color: #fff;
      font-weight: 600;
      text-align: center;
      font-size: 14px;
    }
    .checkbox {
      font-size: 14px;
    }
    .t-form__row.thick-button.flex {
      margin-bottom: 0;
    }
  }

  @media (max-width: 767px) {
    .modal-big-wrapper {
      .modal-header {
        font-size: 1.5rem;
        font-weight: 800;
      }
      .t-form__row.thick-button .button {
        padding: .75rem;
        font-size: 14px;
      }
      .t-form__input, .t-form__input-label {
        font-size: 14px;
      }
    }
  }
</style>
