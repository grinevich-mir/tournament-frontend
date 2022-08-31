<template>
  <div
    class="leaderboard"
    :class="{ active: playerLoaded, 'start-collapsed': !isMobile, loading: switchingModes }"
    v-touch:swipe="emitSwipeDirection"
    v-touch="showMobileLeaderboard"
  >
      <div class="leaderboard__toggle-data" @click="toggleLeaderboardMode">
        <template v-if="showTop">
          <img svg-inline class="arrow-icon arrow-icon--bottom" src="@/assets/arrow.svg" alt="go to your position" />
          Your position
        </template>
        <template v-else>
          <img svg-inline class="arrow-icon arrow-icon--top" src="@/assets/arrow.svg" alt="go to top" />
          Top players
        </template>
      </div>
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
      <transition-group
        name="list" tag="div"
        class="leaderboard__body"
        :class="[`leaderboard--pos-${playerPosition}`, { active: showLeaderboardMobile && isMobile }, {'player-last-place': (playerPosition === this.leaderboard.entries.length - 1) && this.leaderboard.entries.length > 2} ]"
      >
        <LeaderboardEntry
          v-for="entry in entries"
          :key="entry.displayName"
          :entry="entry"
          :leaderboardMode="leaderboardMode"
          :playerPosition="playerPosition"
          :isVisible="entry.isVisible"
          :prize="prizes[entry.rank]"
        ></LeaderboardEntry>
      </transition-group>
      <div v-if="isMobile" class="leaderboard__handler">
        <!-- <div class="leaderboard__handler-icon"></div> -->
        <img svg-inline class="leaderboard__handler-icon" src="@/assets/chevron.svg" alt="Expand" :class="{ expanded: showLeaderboardMobile }">
      </div>
  </div>
</template>

<script>
import LeaderboardEntry from '@/components/panel/LeaderboardEntry.vue';

export default {
  name: 'Leaderboard',
  components: {
    LeaderboardEntry,
  },
  data() {
    return {
      maxEntries: 7,
      showLeaderboard: false,
      showLeaderboardMobile: false,
      showTop: false,
    };
  },
  props: ['leaderboard', 'isMobile', 'playerPosition', 'leaderboardMode', 'playerLoaded', 'switchingModes', 'prizes'],
  methods: {
    generatePlaceholderEntries(num, maxVisible) {
      if (num === 0) {
        return [];
      }

      const placeholders = [];
      for (let i = 0; i < num; i += 1) {
        placeholders.push({
          rank: this.leaderboard.entries.length + (i + 1),
          displayName: `ph-${i}`,
          points: 0,
          isVisible: i + 1 <= maxVisible,
          runningPoints: 0,
          placeholder: true,
        });
      }
      return placeholders;
    },
    emitSwipeDirection(direction) {
      if (!this.isMobile) return;
      // emit a swipe direction to toggle between leaderboard modes
      this.$emit('swiped', direction);
      // console.log(direction);
    },
    showMobileLeaderboard() {
      if (!this.isMobile) return;
      this.showLeaderboardMobile = !this.showLeaderboardMobile;
      this.$emit('full-board');
    },
    preventBrowserBounce(event) {
      event.preventDefault();
    },
    toggleLeaderboardMode() {
      this.$emit('swiped', this.showTop ? 'top' : 'bottom');
      this.showTop = !this.showTop;
    },
  },
  computed: {
    entries() {
      let count = this.maxEntries;
      let entries = [];

      if (this.leaderboard) {
        entries = this.leaderboard.entries;
        count = this.maxEntries - this.leaderboard.entries.length;
      }

      if (entries.length >= this.maxEntries) {
        return entries;
      }

      const visibleCount = Math.max(count - 4, 0);
      const placeholders = this.generatePlaceholderEntries(count, visibleCount);
      entries = entries.concat(placeholders);
      return entries;
    },
  },
  mounted() {
    this.$el.addEventListener('touchstart', this.preventBrowserBounce, { passive: false });
  },
  beforeDestroy() {
    this.$el.removeEventListener('touchstart', this.preventBrowserBounce, { passive: false });
  },
  isMobile() {
    return this.$store.getters.isMobile;
  },
};
</script>

<style scoped lang="scss">
  // opacities
  $opa-1: rgba(29, 29, 48, 1);
  $opa-08: rgba(29, 29, 48, 0.8);
  $opa-65: rgba(29, 29, 48, 0.65);
  $opa-55: rgba(29, 29, 48, 0.55);
  $opa-04: rgba(29, 29, 48, 0.4);
  $opa-03: rgba(29, 29, 48, 0.3);
  $opa-01: rgba(29, 29, 48, 0.1);
  // positiions
  .leaderboard--pos-0 {
    background: linear-gradient(180deg,
      $opa-1 0%,
      $opa-1 calc(100% / 7),
      $opa-08 calc(100% / 7),
      $opa-08 calc((100% / 7) * 2),
      $opa-65 calc((100% / 7) * 2),
      $opa-65 calc((100% / 7) * 3),
      $opa-55 calc((100% / 7) * 3),
      $opa-55 calc((100% / 7) * 4),
      $opa-04 calc((100% / 7) * 4),
      $opa-04 calc((100% / 7) * 5),
      $opa-03 calc((100% / 7) * 5),
      $opa-03 calc((100% / 7) * 6),
      $opa-01 calc((100% / 7) * 6),
      $opa-01 calc((100% / 7) * 7),
    );
  }
  .leaderboard--pos-1 {
    background: linear-gradient(180deg,
      $opa-08 0%,
      $opa-08 calc(100% / 7),
      $opa-1 calc(100% / 7),
      $opa-1 calc((100% / 7) * 2),
      $opa-08 calc((100% / 7) * 2),
      $opa-08 calc((100% / 7) * 3),
      $opa-65 calc((100% / 7) * 3),
      $opa-65 calc((100% / 7) * 4),
      $opa-55 calc((100% / 7) * 4),
      $opa-55 calc((100% / 7) * 5),
      $opa-04 calc((100% / 7) * 5),
      $opa-04 calc((100% / 7) * 6),
      $opa-03 calc((100% / 7) * 6),
      $opa-03 calc((100% / 7) * 7),
    );
  }
  .leaderboard--pos-2 {
    background: linear-gradient(180deg,
      $opa-65 0%,
      $opa-65 calc(100% / 7),
      $opa-08 calc(100% / 7),
      $opa-08 calc((100% / 7) * 2),
      $opa-1 calc((100% / 7) * 2),
      $opa-1 calc((100% / 7) * 3),
      $opa-08 calc((100% / 7) * 3),
      $opa-08 calc((100% / 7) * 4),
      $opa-65 calc((100% / 7) * 4),
      $opa-65 calc((100% / 7) * 5),
      $opa-55 calc((100% / 7) * 5),
      $opa-55 calc((100% / 7) * 6),
      $opa-04 calc((100% / 7) * 6),
      $opa-04 calc((100% / 7) * 7),
    );
  }
  .leaderboard--pos-3 {
    background: linear-gradient(180deg,
      $opa-55 0%,
      $opa-55 calc(100% / 7),
      $opa-65 calc(100% / 7),
      $opa-65 calc((100% / 7) * 2),
      $opa-08 calc((100% / 7) * 2),
      $opa-08 calc((100% / 7) * 3),
      $opa-1 calc((100% / 7) * 3),
      $opa-1 calc((100% / 7) * 4),
      $opa-08 calc((100% / 7) * 4),
      $opa-08 calc((100% / 7) * 5),
      $opa-65 calc((100% / 7) * 5),
      $opa-65 calc((100% / 7) * 6),
      $opa-55 calc((100% / 7) * 6),
      $opa-55 calc((100% / 7) * 7),
    );
  }
  .leaderboard--pos-4 {
    background: linear-gradient(180deg,
      $opa-04 0%,
      $opa-04 calc(100% / 7),
      $opa-55 calc(100% / 7),
      $opa-55 calc((100% / 7) * 2),
      $opa-65 calc((100% / 7) * 2),
      $opa-65 calc((100% / 7) * 3),
      $opa-08 calc((100% / 7) * 3),
      $opa-08 calc((100% / 7) * 4),
      $opa-1 calc((100% / 7) * 4),
      $opa-1 calc((100% / 7) * 5),
      $opa-08 calc((100% / 7) * 5),
      $opa-08 calc((100% / 7) * 6),
      $opa-65 calc((100% / 7) * 6),
      $opa-65 calc((100% / 7) * 7),
    );
  }
  .leaderboard--pos-5 {
    background: linear-gradient(180deg,
      $opa-03 0%,
      $opa-03 calc(100% / 7),
      $opa-04 calc(100% / 7),
      $opa-04 calc((100% / 7) * 2),
      $opa-55 calc((100% / 7) * 2),
      $opa-55 calc((100% / 7) * 3),
      $opa-65 calc((100% / 7) * 3),
      $opa-65 calc((100% / 7) * 4),
      $opa-08 calc((100% / 7) * 4),
      $opa-08 calc((100% / 7) * 5),
      $opa-1 calc((100% / 7) * 5),
      $opa-1 calc((100% / 7) * 6),
      $opa-08 calc((100% / 7) * 6),
      $opa-08 calc((100% / 7) * 7),
    );
  }
  .leaderboard--pos-6 {
    background: linear-gradient(180deg,
      $opa-01 0%,
      $opa-01 calc(100% / 7),
      $opa-03 calc(100% / 7),
      $opa-03 calc((100% / 7) * 2),
      $opa-04 calc((100% / 7) * 2),
      $opa-04 calc((100% / 7) * 3),
      $opa-55 calc((100% / 7) * 3),
      $opa-55 calc((100% / 7) * 4),
      $opa-65 calc((100% / 7) * 4),
      $opa-65 calc((100% / 7) * 5),
      $opa-08 calc((100% / 7) * 5),
      $opa-08 calc((100% / 7) * 6),
      $opa-1 calc((100% / 7) * 6),
      $opa-1 calc((100% / 7) * 7),
    );
  }
  .leaderboard__body {
    transition: .2s ease-in-out opacity;
    opacity: 1;
  }
  .leaderboard {
    background-color: #000;
    overflow: visible;
    position: relative;
    .game__loading-dots {
      position: absolute;
      z-index: 1;
      pointer-events: none;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: .2s ease-in-out opacity;
    }
    &.loading {
      .leaderboard__body {
        opacity: .25;
      }
      .game__loading-dots {
        opacity: 1;
      }
    }
  }
  .list-enter-active,
  .list-leave-active,
  .list-move {
    transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
    transition-property: opacity, transform;
  }

  .list-enter {
    opacity: 0;
    transform: translateX(50px) scaleY(0.5);
  }

  .list-enter-to {
    opacity: 1;
    transform: translateX(0) scaleY(1);
  }

  .list-leave-active {
    position: absolute;
    left: 0;
    right: 0;
  }

  .list-leave-to {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: center top;
  }

  .leaderboard__toggle-data {
    color: $kimberly;
    font-size: 13px;
    text-align: center;
    width: 100%;
    padding: 0.2rem;
    text-decoration: underline;
    cursor: pointer;
    position: relative;
    z-index: 10;

    & .arrow-icon {
      fill: $kimberly;
      height: 12px;

      &.arrow-icon--top {
        margin-bottom: -0.1rem;
      }
      &.arrow-icon--bottom {
        margin-bottom: -0.4rem;
      }
    }
  }

  .leaderboard__handler {
    height: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $lb-rank-1;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    position: absolute;
    bottom: -20px;

    & svg  {
      // width: 60px;
      // border-bottom: 2px solid #5B5B63;
      // border-radius: 2px;
      width: 12px;
      // transition: transform 0.15s ease-in-out;

      // & path {
      //   fill: #5B5B63;
      // }

      &.expanded {
        transform: rotate(180deg);
        // transition: ;
      }
    }

  }

  @media (max-width: 1279px) {
    .leaderboard__toggle-data {
      display: none;
    }
  }
</style>
