<template>
  <div class="badge" :class="badgeVariant">
    <slot name="text">
      {{text}}
    </slot>
  </div>
</template>

<script>
// Badge variants to pass: 'emerald', 'slot', 'hilo', 'bingo', 'vip'
export default {
  name: 'Badge',
  props: {
    text: String,
    variant: String,
    rounded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    badgeVariant() {
      let classes = '';
      if (this.variant) classes += `badge--${this.variant}`;
      if (this.rounded) classes += ' rounded';
      return classes;
    },
  },
};
</script>

<style scoped lang="scss">
  .badge {
    background-color: #fff;
    display: inline-block;
    padding: .35rem 1rem;
    line-height: 1;
    font-size: 15px;
    font-weight: 700;
    border-radius: 3px;
    &.rounded {
      border-radius: 20px;
    }
    &.badge--emerald {
      background-color: $emerald;
      color: #fff;
    }
    &.badge--hilo {
      background-color: $pink;
      color: #fff;
      border-radius: 22px;
    }
    &.badge--slot {
      background-color: $emerald;
      color: #fff;
      border-radius: 22px;
    }
    &.badge--crash {
      background-color: #E10069;
      color: #fff;
      border-radius: 22px;
    }
    // &.badge--bingo {
    //   background-color: $orange;
    //   color: #fff;
    // }
    &.badge--astro {
      background-color: $orange;
      color: #fff;
      border-radius: 22px;
    }
    &.badge--red {
      background-color: $red;
      color: #fff;
    }
    &.badge--vip {
      background: $orange-gradient;
      color: #fff;
      clip-path: polygon(100% 0, 85% 50%, 100% 100%, 0 100%, 15% 50%, 0 0);
      border-radius: 0;
    }
    &.badge--gold {
      background: $gold-gradient-diagonal;
      color: #fff;
      text-shadow: 0px 0px 6px #b37d08;
    }
    &.badge--dark-grey {
      background: $dark-grey;
      color: #fff;
      text-shadow: 0px 0px 6px #b37d08;
    }
    &.badge--transparent-blue {
      background: rgba(13, 126, 232, 0.5);
      border-radius: 8px;
      padding: 2px 8px;
      font-size: 10px;
      font-weight: 600;
    }
    &.badge--blue {
      font-size: 12px;
      font-weight: 700;
      line-height: 12px;
      padding: 4px 8px;
      background-color: $blue;
      box-shadow: 0.5px 0.5px 1px #000000;
      border-radius: 4px;
    }
    &.badge--rounded-pink {
      background-color: $pink;
      border-radius: 22px;
      color: #fff;
      padding: 5px 16px;
      font-size: 12px;
      font-weight: 700;
    }
  }
</style>
