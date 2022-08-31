<template>
  <div class="lb-user" :class="[`lb-user--rank-${entry.rank}`, {me: entry.isPlayer, 'mobile-visible': isVisible || (entry.rank <= 3 && playerPosition === -1), running, progressing, prize, active: entry.active }]">
    <div class="lb-user__progress-bg" :style="{ width: 100 - progress + '%' }" v-if="entry"></div>
    <div class="lb-user__prop lb-user__rank">
      <span class="lb-rank-minwidth">{{ placeholder ? '-' : rank }}</span>
      &nbsp;
      <template v-if="prize">
        <span class="lb-prize" v-if="!prize.amount && prize.shortName">{{prize.shortName}}</span>
        <span class="lb-prize" v-else-if="prize.currencyCode === 'DIA'">
          <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">
          {{prize.amount}}
        </span>
        <span class="lb-prize" v-else>{{ formatMoney(prize.amount, prize.currencyCode) }}</span>
      </template>
    </div>
    <div class="lb-user__prop lb-user__name">
      <Flag v-if="entry.country && entry.role !== 'operator'" class="lb-user__badge" :country="entry.country" size="sm" round />
      <SupportIcon v-else-if="entry.role === 'operator'" class="lb-user__badge" />
      {{ displayName }}
    </div>
    <div class="lb-user__prop lb-user__score">
      {{ placeholder ? '-' : points }}
      <div class="lb--arrow-up"></div>
      <!--  :class="{ visible: running && !progressing }" -->
    </div>
    <div class="lb-user__progress" :style="{ width: progress + '%' }" v-if="entry" :class="{ show: tweeningProgress || (entry.active && progress > 0 && progress < 100) }">
        <span>{{ runningPoints }}</span>
    </div>
  </div>
</template>

<script>
import { tween } from 'femtotween';
import Flag from '@/components/global/Flag.vue';
import SupportIcon from '@/components/global/SupportIcon.vue';

export default {
  name: 'LeaderboardEntry',
  components: {
    Flag,
    SupportIcon,
  },
  props: ['entry', 'isVisible', 'playerPosition', 'prize'],
  data() {
    return {
      points: 0,
      runningPoints: 0,
      rank: 0,
      progress: 100,
      tweeningProgress: false,
      stopPointsTween: null,
      stopRunningPointsTween: null,
      stopProgressTween: null,
      stopRankTween: null,
      placeholder: this.entry.placeholder === true,
      active: false,
    };
  },
  computed: {
    displayName() {
      if (this.placeholder) return '-';
      // if (this.entry.displayName.length >= 14) return `${this.entry.displayName.substring(0, 13)}...`;
      return this.entry.displayName;
    },
    running() {
      if (!this.entry || !this.entry.runningPoints) return false;
      return this.entry.runningPoints > 0;
    },
    progressing() {
      if (!this.progress) return false;
      return this.progress > 0 && this.progress < 100;
    },
  },
  created() {
    if (!this.entry) {
      this.placeholder = true;
      return;
    }

    this.points = this.entry.points;
    this.runningPoints = this.entry.runningPoints;
    this.progress = this.getProgress(this.runningPoints, this.points);
    this.rank = this.entry.rank;
  },
  methods: {
    tweenPoints(from, to) {
      if (from === to) {
        return;
      }

      if (from + 1 === to) {
        this.points = to;
        return;
      }

      if (this.stopPointsTween) {
        this.stopPointsTween();
      }
      this.stopPointsTween = tween(from, to, (v) => {
        this.points = Math.round(v);
      },
      {
        time: 1000,
      });
    },
    tweenRunningPoints(from, to) {
      if (from === to) {
        return;
      }

      if (this.stopRunningPointsTween) {
        this.stopRunningPointsTween();
      }
      this.stopRunningPointsTween = tween(from, to, (v) => {
        this.runningPoints = Math.round(v);
      },
      {
        time: 1000,
      });
    },
    tweenProgress(from, to) {
      if (from === to) {
        return;
      }

      if (this.stopProgressTween) {
        this.stopProgressTween();
      }

      this.tweeningProgress = true;
      this.stopProgressTween = tween(from, to, (v) => {
        this.progress = Math.round(v);
      },
      {
        time: 1000,
        done: () => {
          this.tweeningProgress = false;
        },
      });
    },
    tweenRank(from, to) {
      if (from === to) {
        return;
      }

      if (from + 1 === to) {
        this.rank = to;
        return;
      }

      if (this.stopRankTween) {
        this.stopRankTween();
      }
      this.stopRankTween = tween(from, to, (v) => {
        this.rank = Math.round(v);
      },
      {
        time: 1000,
      });
    },
    getProgress(runningPoints, points) {
      if (points === 0) {
        return 100;
      }

      return Math.min((runningPoints / points) * 100, 100);
    },
  },
  watch: {
    entry: {
      deep: true,
      handler(newVal, oldVal) {
        this.tweenPoints(oldVal.points, newVal.points);
        this.tweenRunningPoints(oldVal.runningPoints, newVal.runningPoints);
        this.tweenRank(oldVal.rank, newVal.rank);
        const fromProgress = this.getProgress(oldVal.runningPoints, oldVal.points);
        const toProgress = this.getProgress(newVal.runningPoints, newVal.points);
        this.tweenProgress(fromProgress, toProgress);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.lb-high-rank {
    .lb-user__progress-bg {
      background-color: rgba(0, 0, 0, 0.4);
    }

    .lb-user__progress {
      background-color: $lb-progress-7;
    }
}

.lb-user.running, .lb-user.me.running {
  &.progressing {
    &.prize {
      .lb-user__score
      .lb-rank-minwidth {
        opacity: 0 !important;
      }
      & .lb-user__progress span {
        opacity: 0;
      }
    }
    & .lb-user__rank {
      z-index: 2;
    }
  }
}

.lb-user {
  // font-family: 'Carter One';
  color: #A2A2CD;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 1rem;
  // padding-right: 1.2rem;
  padding-right: 0.25rem;
  position: relative;
  overflow: hidden;
  z-index: 2;
  &::after,
  &::before {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $blue;
    opacity: 0;
    z-index: 1;
  }
  &::after {
    top: 0;
  }
  &:before {
    bottom: 0;
  }
  &.lb-user--rank-1 {
    background-color: $lb-rank-1;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-2 {
    background-color: $lb-rank-2;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-3 {
    background-color: $lb-rank-3;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-4 {
    background-color: $lb-rank-4;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-5 {
    background-color: $lb-rank-5;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-6 {
    background-color: $lb-rank-6;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-7 {
    background-color: $lb-rank-7;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-8 {
    background-color: $lb-rank-8;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-9 {
    background-color: $lb-rank-9;
    @extend .lb-high-rank;
  }
  &.lb-user--rank-10 {
    background-color: $lb-rank-10;
    @extend .lb-high-rank;
  }
  &.me {
    background-color: transparent;
    &::after,
    &::before {
      opacity: 1;
      z-index: 2;
    }

    .lb-user__progress-bg {
      background-color: #1a315b;
    }

    .lb-user__progress {
      background-color: $lb-progress-7;
    }
  }
  .lb-user__prop {
    z-index: 1;
  }
  .lb-user__score {
    display: flex;
    align-items: center;
    text-align: right;
    z-index: 2;
    & .lb--arrow-up {
      height: 10px;
      width: 10px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0;
      margin-left: 0.2rem;
      &.visible {
        opacity: 1;
        background: url('~@/assets/leaderboard-arrow-up.svg');
      }
    }
  }
  .lb-user__name {
    // text-align: left;
    // flex: 1;
    position: absolute;
    left: 50%;
    transform: translate(-50px, 0);
    z-index: 2;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 190px;
  }

  &.active {
    color: #fff;
  }

  .lb-user__progress,
  .lb-user__progress-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: fade-out($blue, 0.85);
    z-index: 0;
  }
  .lb-user__progress {
    z-index: 1;
    left: 0;
    background-color: $lb-progress-7;
    transition: 0.2s linear opacity;
    transition-delay: 0.5s;
    opacity: 0;
    top: 1px;
    bottom: 1px;

    &.show {
      opacity: 1;
      transition-delay: 0s;

      & > span {
        left: 4rem;
        right: unset;
        margin-top: -1px;
      }
    }

    > span {
      position: absolute;
      right: 1rem;
      top: 0.25rem;
      color: #fff;
    }
  }
  .lb-user__badge {
    margin-right: 4px;
  }
}

span.lb-prize {
  letter-spacing: -.5px;
  background: linear-gradient(to bottom right, $gradient-gold 0%, $gradient-light-gold 50%, $gradient-gold 100%);;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 4px;

  & .ticket-icon {
    width: 12px;
    height: 12px;
    margin-bottom: -2px;
    path {
      fill: #7CFF84;
    }
  }
}
span.lb-rank-minwidth {
  min-width: 10px;
  display: inline-block;
  margin-right: 3px;
}
.lb-user__rank {
  white-space: nowrap;
  width: 30%;
}

@media (max-width: 1599px) {
  .lb-user {
    font-size: 12px;

    .lb-user__name {
      max-width: 140px;
    }
  }
}

@media (max-width: 1279px) {
  .lb-user {
    transition: 0.1s ease-in-out height, 0.1s ease-in-out padding, 0.05s ease-in-out opacity;
    font-size: 11px;
    line-height: 13px;
  }
  .leaderboard__body:not(.active) {
    background: $navy;
    .lb-user:not(.me):not(.mobile-visible) {
      height: 0;
      padding: 0 1rem;
      opacity: 0;
      visibility: collapse;
    }
    .lb-user.me {
      background-color: #1d1d2f;
    }
    .lb-user.mobile-visible {
      background-color: #1a1a29;
    }
    .lb-user.mobile-visible + .lb-user.mobile-visible {
      background-color: #171725;
    }
    .lb-user {
      &.lb-user--rank-1 {
        background-color: $lb-rank-1 !important;
      }
      &.lb-user--rank-2 {
        background-color: $lb-rank-2 !important;
      }
      &.lb-user--rank-3 {
        background-color: $lb-rank-3 !important;
      }
      &.lb-user--rank-4 {
        background-color: $lb-rank-4 !important;
      }
      &.lb-user--rank-5 {
        background-color: $lb-rank-5 !important;
      }
      &.lb-user--rank-6 {
        background-color: $lb-rank-6 !important;
      }
      &.lb-user--rank-7 {
        background-color: $lb-rank-7 !important;
      }
      &.lb-user--rank-8 {
        background-color: $lb-rank-8 !important;
      }
      &.lb-user--rank-9 {
        background-color: $lb-rank-9 !important;
      }
      &.lb-user--rank-10 {
        background-color: $lb-rank-10 !important;
      }
      &.me {
        background-color: transparent !important;
      }
    }
  }
  .player-last-place.leaderboard__body:not(.active) {
    .lb-user.mobile-visible {
      background-color: #171725;
    }
    .lb-user.mobile-visible + .lb-user.mobile-visible {
      background-color: #1a1a29;
    }
  }
}
@media (max-midth: 1024px) {
  .lb-user {
    .lb-user__name {
      max-width: auto !important;
    }
  }
}
</style>
