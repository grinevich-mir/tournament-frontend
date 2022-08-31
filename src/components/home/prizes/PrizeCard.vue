<template>
  <Card :image="imageUrl || ''" class="p-card">
    <template v-if="isLoading || (timeLeft && timeLeft > 0 && isLessThan7Days)" v-slot:badge>
      <Badge variant="blue" class="overlay-badge--right">
        <template v-slot:text>
          <!-- <img svg-inline class="icon" src="@/assets/time-left.svg" alt="Time left:" /> -->
          <div v-if="isLoading" class="p-timer game__loading-dots"><div></div><div></div><div></div><div></div></div>
          <template v-else-if="timeLeft && timeLeft > 0 && isLessThan7Days">
            <!-- <span v-if="isOver30Days" class="game__time-left">{{ $dayjs(prize.tournament.endTime).startOf('day').format('MMM Do, YYYY') }}</span> -->
            <span class="game__time-left">{{ timeLeft | toSingleUnitTime }} LEFT!</span>
          </template>
          <span v-else-if="!timeLeft || timeLeft <= 0" class="game__time-left">COMPLETE</span>
        </template>
      </Badge>
    </template>
    <template v-slot:body>
      <div class="p-card__container">
        <p class="label">{{prize.headingHomepage}}</p>
        <p class="game">{{prize.tournament.name}}</p>
        <!-- <p class="desc">{{prize.endMonth}}</p> -->
      </div>
    </template>
    <template v-slot:footer>
      <div class="p-card__container">
        <Button @clicked="$router.push({ name: 'Register' })" text="ENTER NOW" variant="rounded-blue"/>
        <a @click="openModal(prize)" class="read-more">READ MORE</a>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from '@/components/global/Card.vue';
import Badge from '@/components/global/Badge.vue';
import Button from '@/components/global/Button.vue';

import sanity from '@/sanity';
import imageUrlBuilder from '@sanity/image-url';

const imageBuilder = imageUrlBuilder(sanity);

export default {
  name: 'PrizeCard',
  components: {
    Card,
    Badge,
    Button,
  },
  props: {
    prize: Object,
    index: Number,
    openModal: Function,
    isLoading: Boolean,
  },
  computed: {
    isLessThan7Days() {
      if (typeof this.prize.tournament.endTime === 'undefined') {
        return false;
      }
      return this.$dayjs(this.prize.tournament.endTime).diff(this.$dayjs(), 'days') <= 7;
    },
    imageUrl() {
      if (!this.prize || !this.prize.imageMobile) return '';
      return this.imageUrlFor(this.prize.imageMobile);
    },
  },
  data() {
    return {
      timeLeft: 0,
      polling: null,
    };
  },
  created() {
    this.updatetimeLeft();
    setTimeout(this.updatetimeLeft, 1000);
    this.polling = setInterval(() => {
      this.updatetimeLeft();
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },
    updatetimeLeft() {
      if (!this.prize.tournament) return;
      // game start time
      let targetTime;
      this.started = this.$dayjs(this.prize.tournament.startTime).isSameOrBefore();

      if (this.started && this.prize.tournament.endTime && (this.prize.tournament.allowJoinAfterStart === true || this.prize.tournament.playerJoined === true)) {
        targetTime = this.$dayjs(this.prize.tournament.endTime);
      } else {
        targetTime = this.$dayjs(this.prize.tournament.startTime);
      }
      // current time
      const nowTime = this.$dayjs.utc();
      // time difference - games that have been played will have a negative value
      this.timeLeft = targetTime.diff(nowTime, 'seconds');
      this.ended = this.ended && this.timeLeft < 1;
    },
  },
};
</script>

<style scoped lang="scss">
  .prize-card {
    margin: 0 10px;
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
    & .badge {
      display: flex;
      align-items: center;
      width: fit-content;
      & .icon {
        width: 14px;
        margin-right: 10px;
      }
    }
    & p.gold {
      font-size: 12px;
      font-weight: 600;
      line-height: 19px;
      margin: 0;
    }
    & p {
      font-size: 10px;
      font-weight: 400;
      line-height: 16px;
      margin-top: 10px;
      margin-bottom: 20px;
    }
    & .button {
      font-size: 8px;
      padding: 8px 22px;
    }
  }
  p.label {
    text-transform: uppercase;
  }
  .p-timer {
    transform: scale(0.5);
    width: 80px;
    height: 10px;
  }
</style>
