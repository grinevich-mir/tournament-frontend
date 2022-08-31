<template>
  <div @click="$emit('click', $event)" class="winner" :class="winnerVariant">
    <div class="gradient-border"></div>
    <div class="winner__marque" :class="{ 'cut-text': isMobileSmall }">
      <Flag v-if="country" :country="country" size="sm" round />
      <template v-if="jackpot">{{user}} won {{game}} for <span class="winner__prize">{{prize}}</span>!</template>
      <template v-else>{{user}} won <span class="winner__prize">{{prize}}</span> on {{game}}</template>
    </div>
    <div v-if="date" class="winner__timeago">{{ $dayjs(date).subtract(10, 'second').fromNow() }}</div>
  </div>
</template>

<script>
import Flag from '@/components/global/Flag.vue';

// Variant prop options: 'pink', 'orange'
export default {
  name: 'Winner',
  props: {
    variant: String,
    user: String,
    prize: String,
    game: String,
    date: String,
    country: String,
    jackpot: {
      type: Boolean,
      default: false,
    },
    homeView: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Flag,
  },
  computed: {
    winnerVariant() {
      let classes = '';
      if (this.jackpot) classes += `jackpot--${this.variant}`;
      if (this.variant) classes += ` winner--${this.variant}`;
      if (!this.homeView && this.isMobile && this.$route.name !== 'Winners') classes += '  winner--banner';
      return classes;
    },
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
  },
};
</script>

<style scoped lang="scss">
  .winner {
    text-align: center;
    background-color: $light-navy;
    // background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 20px;
    padding: .5rem 2rem;
    position: relative;
    border-radius: 3px;
    overflow: visible;

    &.winner--banner {
      border-radius: unset;
      padding-top: 10px !important;
      padding-bottom: 10px !important;
    }

    &:not(:first-child):not(:last-child) {
      margin: .75rem 0;
    }
    &.winner--emerald {
      border-left: 6px solid $emerald;
      color: #fff;
      &.winner--banner{
        border: none;
        background-color: $emerald;
      }
    }
    &.winner--slot {
      border-left: 6px solid $pink;
      color: #fff;
      &.winner--banner{
        border: none;
        background-color: $pink;
      }
    }
    &.winner--hilo {
      border-left: 6px solid $blue;
      color: #fff;
      &.winner--banner{
        border: none;
        background-color: $blue;
      }
    }
    &.winner--bingo {
      border-left: 6px solid $orange;
      color: #fff;
      &.winner--banner{
        border: none;
        background-color: $orange;
      }
    }

    &.jackpot--mega {
      border: none;
      overflow: hidden;
      & .gradient-border {
        display: block;
        background: $gold-gradient-diagonal;
      }
      &.winner--banner{
        color: #000;
        background: $gold-gradient-diagonal;
        & .gradient-border {
          display: none;
        }
      }
    }
    &.jackpot--maxi {
      border: none;
      overflow: hidden;
      & .gradient-border {
        display: block;
        background: $silver-gradient-diagonal-double;
      }
      &.winner--banner{
        color: #000;
        background: $silver-gradient-diagonal-double;
        & .gradient-border {
          display: none;
        }
      }
    }
    &.jackpot--mini {
      border: none;
      overflow: hidden;
      & .gradient-border {
        display: block;
        background: $orange-gradient-vertical;
      }
      &.winner--banner{
        color: #000;
        background: $orange-gradient-vertical;
        & .gradient-border {
          display: none;
        }
      }
    }

    .gradient-border {
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 6px;
      height: 100%;
    }
  }
  .winner__marque {
    &.cut-text{
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    & .fflag {
      margin-top: -2px;
      margin-right: 2px;
    }
  }
  .winner__prize {
    font-weight: 700;
  }
  .winner__timeago {
    // color: rgba(255, 255, 255, 0.75);
    opacity: 0.6;
    font-size: 0.6rem;
    margin-top: 5px;
  }
  @media (max-width: 767px) {
    .winner {
      font-size: 11px !important;
    }
  }
</style>
