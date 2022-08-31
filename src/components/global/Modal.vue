<template>
  <transition name="fade">
    <div v-if="value" class="overlay overlay--modal" :class="`overlay--${mode}`">
      <div class="secondary-overlay" :class="{ 'confetti': showConfetti }">
        <div class="modal" :class="[`modal--${mode}`, { 'no-padding': contentFullSize }]" ref="modal">
          <div class="modal-inner-scroll-outer" :class="{ 'jackpot': mode === 'jackpot' }" ref="innerScroll">
            <div class="modal-inner-scroll">

              <slot name="title" v-if="title">
                <h2 class="modal-title">{{ title }}</h2>
              </slot>

              <slot name="body" class="modal--body"></slot>

            </div>
            <div class="modalbutton" v-if="$slots.buttons">
              <slot name="buttons"></slot>
            </div>
            <div class="modalbutton" v-else-if="!noButtons">
              <Button
                @clicked="action"
                :text="btnText"
                :variant="btnVariant"
              />
            </div>
            <div class="close-button" v-if="closeButton" @click="closeAction">
              <img svg-inline src="@/assets/close.svg" alt="Close">
            </div>

            <div v-if="isLoading" class="modal-loading">
              <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
          <template v-if="mode === 'prizes'">
            <img class="coin coin-1" src="@/assets/coin-1.png" alt="" />
            <img class="coin coin-2" src="@/assets/coin-2.png" alt="" />
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Button from '@/components/global/Button.vue';

export default {
  name: 'Modal',
  props: {
    value: Boolean,
    title: String,
    btnAction: Function,
    btnText: {
      type: String,
      default: 'OK',
    },
    btnVariant: {
      type: String,
      default: 'blue',
    },
    isLoading: Boolean,
    mode: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'simple', 'win', 'jackpot', 'prizes', 'video'].includes(val),
    },
    showConfetti: Boolean,
    closeButton: Boolean,
    closeBtnAction: Function,
    noButtons: Boolean,
    contentFullSize: Boolean,
  },
  components: {
    Button,
  },
  // data() {
  //   return {
  //     resizeListener: null,
  //   };
  // },
  // computed: {
  //   showConfetti() {
  //     if (this.mode === 'win' || this.mode === 'jackpot') {
  //       return true;
  //     }
  //     return false;
  //   },
  // },
  mounted() {
    if (this.mode === 'prizes') {
      this.checkHeight();
    }
  },
  methods: {
    checkHeight() {
      const modalContentHeight = this.$refs.innerScroll.clientHeight;
      const modalHeight = this.$refs.modal.clientHeight;
      if (modalContentHeight > modalHeight + 5) {
        this.$refs.modal.classList.add('has-scroll');
        this.$refs.modal.style.height = `${modalContentHeight}px`;
      }
    },
    toggleShow() {
      this.$emit('input', !this.value);
      document.body.classList.toggle('no-scroll');
    },
    action() {
      if (!this.btnAction) return this.toggleShow();
      return this.btnAction();
    },
    closeAction() {
      if (this.closeBtnAction) this.closeBtnAction();
      else this.toggleShow();
    },
  },
};
</script>

<style scoped lang="scss">

// to prevent showing the hideous windows scrollbar we just do it the drastic way and disable all scrollbars lol
/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.modal {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.secondary-overlay {
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
  padding-bottom: 2rem;

  &.confetti {
    background-image: url('~@/assets/confetti.svg');
  }
  .overlay--prizes & {
    background: transparent;
  }
}

.overlay--modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 9999 !important;
  color: #fff;
  font-size: 14px;

  &.modal--finished {
    position: absolute;
    z-index: 10;
  }
}

.modal {
  background: #1D1D30;
  color: $kimberly;
  text-align: center;
  border: 2px solid #3d7ce6;
  border-radius: 6px;
  margin: 3rem;
  width: 700px;
  max-width: 100%;
  line-height: 1.3;
  font-size: 14px;

  &.no-padding {
    & .modal-inner-scroll-outer {
      padding: 0;
    }
    & .modal-inner-scroll {
      margin: 0;
    }
  }

  /deep/ p:not(:last-child) {
    margin-bottom: .8rem;
  }
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    mix-blend-mode: hard-light;
    background: linear-gradient(0deg, rgba(176,213,255,0) 25%, #b0d5ff 50%, rgba(176,213,255,0) 75%);
  }
  &::before {
    left: -3px;
  }
  &::after {
    right: -3px;
  }
  &.modal--jackpot {
    border: 2px solid #FD8E40;
  }
  &.modal--simple {
    overflow: auto !important;
    border: none;
    border-radius: 12.5px;
    padding: 1rem !important;

    &:after,
    &:before {
      display: none;
    }
    & .modal-inner-scroll-outer:after,
    & .modal-inner-scroll-outer:before {
      display: none;
    }
  }

  & .close-button {
    padding: 6px;
    background-color: #323447;
    height: 22px;
    width: 22px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #494b5f;
    }

    & svg {
      width: 10px;
      fill: #fff;
    }

    & .modal-loading {
      border-radius: 12.5px;
    }
  }
}

.modal-inner-scroll-outer {
  position: relative;
  &::before,
  &::after {
    position: absolute;
    content: '';
    height: 150px;
    width: 6px;
    background: #fff;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    background: radial-gradient(circle, #70b3ff 0%, rgba(112, 179, 255, 0) 100%);
    filter: blur(3px);
    mix-blend-mode: hard-light;
  }
  &::before {
    left: -3px;
  }
  &::after {
    right: -3px;
  }
  &.jackpot::before, &.jackpot::after {
    background: #FD8E40;
    background: radial-gradient(circle, #F6CC5E 0%, rgba(112, 179, 255, 0) 100%);
  }

  & .modal-loading {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%,0);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,0.6);
  }
}

.modal-title {
  margin-bottom: 1rem;
  color: #fff;
  font-size: 28px;
}

img.coin {
  position: absolute;
}

img.coin.coin-1 {
  bottom: 98%;
  left: 50%;
  transform: translateX(-30%);
}

.modal {
  position: relative;
  overflow: visible !important;
}

img.coin.coin-2 {
  top: 90%;
  left: 80%;
  z-index: 999999;
}

.overlay--video {
  & .modal:after {
    content: none;
  }
  & .modal-inner-scroll-outer {
    padding: 0;
    & .modal-inner-scroll {
      margin: 0;
    }
  }
}

.modal-inner-scroll-outer {
  padding: 1rem 1rem 0;
  max-height: 100%;
  max-height: -webkit-fill-available;
  height: 100%;
  overflow-y: auto;
}

.modal-inner-scroll {
  margin-bottom: 20px;
}

.modal {
  padding: 0 !important;
  max-height: 100%;
  max-height: -webkit-fill-available;
}

.modalbutton {
  margin-bottom: 1rem;
}

.close-button {
  padding: 8px;
  background-color: #fff;
  height: 35px;
  width: 35px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid $blue;
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 999;

  & svg {
    fill: $blue;
  }
}

@media (max-width: 1279px) {
  .modal {
    margin: 0;
    padding: 1rem;
    font-size: 12px;
  }
  .modalbutton {
    position: sticky;
    bottom: 0;
    background: #1d1d30;
  }
  .modalbutton:before {
    content: '';
    height: 1.5rem;
    background: linear-gradient(180deg, rgba(26,26,42,0) 0%, rgba(29,29,48,1) 100%);
    left: 0;
    right: 0;
    position: absolute;
    bottom: 100%;
  }
}

@media (max-width: 767px) {
  .overlay.overlay--modal {
    padding: 0;
    background-position: center;
    background-size: cover;
  }

  .overlay.overlay--modal.overlay--jackpot {
    // background-image: url('~@/assets/Game.png');
    background: #000000eb;
  }

  .modal {
    max-width: 500px;

    .close-button {
      top: 0px;
      right: 0px;
    }
  }
}
@media (max-width: 575px) {
  .modal-title {
    font-size: 18px;
  }

  .modal {
    width: auto;
    max-width: calc(100% - 1.4rem);
  }

  .modal--finished .modal {
    margin-top: -100px !important;
  }

  .modal-inner-scroll-outer {
    padding-top: 0;
  }
}
</style>
