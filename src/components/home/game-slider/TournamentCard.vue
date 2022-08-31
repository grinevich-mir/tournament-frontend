<template>
  <Card :image="tournament.bannerImgUrl" class="tournament-card">
    <template v-slot:body>
      <div>
        <p class="name">{{tournament.name}}</p>
        <p class="description">{{tournamentDesc}}</p>
      </div>
    </template>
    <template v-slot:footer>
      <div class="actions">
        <div class="timer">
          <img svg-inline class="icon" src="@/assets/time-left.svg" alt="Time left:" />
          <template v-if="timeLeft && timeLeft > 0">
            <span v-if="isOver30Days" class="game__time-left">{{ $dayjs(tournament.endTime).startOf('day').format('MMM Do, YYYY') }}</span>
            <span v-else class="game__time-left">{{ timeLeft | toMinutes }}</span>
          </template>
          <span v-if="!timeLeft || timeLeft <= 0" class="game__time-left">--:--</span>
        </div>
        <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Register' })" text="ENTER" variant="rounded-blue"/>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from '@/components/global/Card.vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'TournamentCard',
  components: {
    Card,
    Button,
  },
  props: {
    tournament: Object,
  },
  data() {
    return {
      isLoading: true,
      timeLeft: 0,
      polling: null,
    };
  },
  computed: {
    tournamentDesc() {
      if (this.tournament.metadata && this.tournament.metadata.homeDesc) return this.tournament.metadata.homeDesc;
      return '';
    },
    isOver30Days() {
      return this.$dayjs(this.tournament.endTime).diff(this.$dayjs(), 'days') > 30;
    },
  },
  created() {
    this.updatetimeLeft();
    this.polling = setInterval(() => {
      this.updatetimeLeft();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    updatetimeLeft() {
      // game start time
      let targetTime;
      this.started = this.$dayjs(this.tournament.startTime).isSameOrBefore();

      if (this.started && this.tournament.endTime && (this.tournament.allowJoinAfterStart === true || this.tournament.playerJoined === true)) {
        targetTime = this.$dayjs(this.tournament.endTime);
      } else {
        targetTime = this.$dayjs(this.tournament.startTime);
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

<style lang="scss">
  .tournament-card {
    margin: 0 10px;
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
    & .card__content {
      padding: 10px 20px !important;
    }
    & .card__thumbnail img {
      height: 130px;
    }
    & .name {
      font-size: 16px;
      font-weight: 600;
      line-height: 26px;
    }
    & .description {
      font-size: 12px;
      font-weight: 400;
      line-height: 19px;
      opacity: 0.8;
    }
    & .actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & .timer {
        display: flex;
        align-items: center;
        font-size: 12px;
        line-height: 20px;
        & svg {
          margin-right: 10px;
        }
      }
      & .button {
        flex: none;
        padding: 8px 36px;
      }
    }
  }
</style>
