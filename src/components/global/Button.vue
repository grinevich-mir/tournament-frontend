<template>
  <button @click="$emit('clicked')" class="button" :class="btnVariant">
    <slot name="text">
      <span class="button__text">{{text}}</span>
    </slot>
  </button>
</template>

<script>
// Button variants to pass: 'blue' or 'orange'
export default {
  name: 'Button',
  props: {
    text: String,
    variant: String,
    large: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    btnVariant() {
      let classes = '';
      if (this.variant) classes += `button--${this.variant}`;
      if (this.large) classes += ' large';
      return classes;
    },
  },
};
</script>

<style lang="scss" scoped>
  .button {
    padding: .5rem 1rem;
    border-radius: 2px;
    border: 0;
    font-weight: 600;
    flex: 1;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-shadow: inset 0px 0px 0px 2px rgba(255, 255, 255, 0.3);
    font-size: 15px;
    transition: .3s ease-in-out opacity, .3s ease-in-out box-shadow;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: .3s ease-in-out opacity, .3s ease-in-out box-shadow;
    }
    &.large {
      padding: 14px 20px;
    }
    &.button--blue {
      color: #fff;
      background: $blue-gradient;
    }
    &.button--rounded-blue {
      color: #fff;
      // background: $blue;
      background: #0D7EE8;
      border-radius: 50px;
      border: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: none;
      &:focus {
        outline: none;
      }
      &:hover {
        background: #188bf7;
      }
      &.outlined {
        border: 2px solid #0D7EE8;
        background: transparent;
        &:hover {
          background: #0D7EE8;
        }
      }
    }
    &.button--rounded-pink {
      color: #fff;
      // background: $blue;
      background: #FF00BE;
      border-radius: 50px;
      border: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: none;
      &:focus {
        outline: none;
      }
      &:hover {
        background: #f504b9;
      }
      &.outlined {
        border: 2px solid #FF00BE;
        background: transparent;
        &:hover {
          background: #FF00BE;
        }
      }
    }
    &.button--rounded-green {
      color: #fff;
      background: #75d466;
      border-radius: 50px;
      border: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: none;
      &:focus {
        outline: none;
      }
      &:hover {
        background: #76DC67;
      }
    }
    &.button--orange {
      color: #fff;
      background: $orange-gradient;
      box-shadow: none;
    }
    &.button--rounded-orange {
      box-shadow: none;
      border-radius: 50px;
      color: #fff;
      border: none;
      background: $orange;
    }
    &.button--outlined-white {
      // border: 1px solid #FFFFFF;
      box-shadow: inset 0px 0px 0px 2px #fff;
      border-radius: 50px;
      background: transparent;
      color: #fff;
      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    }
    &.button--underlined-white {
      box-shadow: none;
      background: transparent;
      color: #fff;
      & span {
        font-weight: 400;
        border-bottom: 1px solid #fff;
      }
      &:hover span {
        color: rgba(255, 255, 255, 0.9);
        border-color: rgba(255, 255, 255, 0.9);
      }
    }
    &.button--red {
      color: #fff;
      background: red;
    }
    &.button--green {
      color: #fff;
      background: $gradient-light-green;
    }
    &.button--light {
      color: #fff;
      background: rgba(255, 255, 255, 0.0);
    }
    &.button--overlay-green {
      width: 100%;
      background: #4FD157D9;
      color: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 11;
      padding: 30px 0;
      font-size: 20px;
      font-weight: 700;
      line-height: 27px;
      box-shadow: none;
      &:hover, &:focus {
        background: #4FD157;
      }
    }
    &[disabled] {
      cursor: not-allowed;
      filter: brightness(0.5) grayscale(.8);
      &::before {
        opacity: 0 !important;
      }
    }
    & .button__text {
      position: relative;
      z-index: 1;
      pointer-events: none;
    }
  }
</style>
