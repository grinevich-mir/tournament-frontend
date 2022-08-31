<template>
  <div class="leaderboard">
    <div class="t-divider">
      <img src="@/assets/t-divider.svg">
      <h3 v-if="content">{{content.heading}}</h3>
      <p></p>
      <!-- <p>Know if you’ve won or lost instantly</p> -->
    </div>
    <div class="leaderboard__container">
      <div class="loader" v-if="isLoading">
        <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
      <template v-else>
        <div class="leaderboard__entry" v-for="(entry, index) in leaderboard" :key="index" :class="`rank--${index + 1}`">
          <span class="rank">{{index + 1}}</span>
          <span class="username"><Flag :country="entry.country"/> {{entry.displayName}}</span>
          <span class="points">{{formatMoney(entry.winnings, 'USD', 2)}}</span>
        </div>
      </template>
    </div>
    <img src="@/assets/home-bg-elements/home-bg-rect-1-left.svg" class="bg-element left">
    <img src="@/assets/home-bg-elements/home-bg-rect-1-right.svg" class="bg-element right">
    <img src="@/assets/home-bg-grid.svg" class="bg-element grid left">
    <img src="@/assets/home-bg-print.svg" class="bg-element grid right">
    <img src="@/assets/home-bg-grid.svg" class="bg-element grid right-2">
  </div>
</template>

<script>
import Flag from '@/components/global/Flag.vue';

export default {
  name: 'Leaderboard',
  props: ['content'],
  components: {
    Flag,
  },
  data() {
    return {
      isLoading: true,
      leaderboard: [],
    };
  },
  created() {
    this.$api.get('/statistics/winners/lifetime?take=10')
      .then((response) => {
        this.leaderboard = response.data;
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
};
</script>

<style scoped lang="scss">
  .leaderboard {
    width: 100%;
    padding: 0 20px;
    max-width: 1460px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & .leaderboard__container {
      border-radius: 2px;
      overflow: hidden;
      width: 100%;
      max-width: 700px;
      & .loader {
        text-align: center;
      }
      & .jackpot {
        background: linear-gradient(0deg, #C6A156 0%, #FFD978 100%, #FFD978 100%, #FFD978 100%);
        color: #101018;
        font-size: 12px;
        font-weight: 700;
        line-height: 19px;
        padding: 8px 0;
        width: 100%;
        text-align: center;
        text-transform: uppercase;
      }
      & .leaderboard__entry {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3px 20px;
        background: #151522;
        position: relative;
        & span {
          font-size: 15px;
          font-weight: 700;
          line-height: 18px;
        }
        // & .rank {
        //   min-width: 50px;
        // }
        & .username {
          text-align: left;
          position: absolute;
          left: 50%;
          transform: translate(-80px);
        }
        & .points {
          // min-width: 50px;
          text-align: right;
        }
        &.rank--1 {
          background-color: $lb-rank-4;
        }
        &.rank--2 {
          background-color: $lb-rank-3;
        }
        &.rank--3 {
          background-color: $lb-rank-2;
        }
        &.rank--4 {
          background-color: $lb-rank-7;
        }
        &.rank--5 {
          background-color: $lb-rank-8;
        }
        &.rank--6 {
          background-color: $lb-rank-7;
        }
        &.rank--7 {
          background-color: $lb-rank-8;
        }
        &.rank--8 {
          background-color: $lb-rank-7;
        }
        &.rank--9 {
          background-color: $lb-rank-8;
        }
        &.rank--10 {
          background-color: $lb-rank-7;
        }
      }
    }
    .bg-element {
      position: absolute;
      transform: scale(1.3);
      display: none;
      &.left {
        bottom: -1400px;
        left: 0;
        transform-origin: left;
      }
      &.right {
        bottom: -1100px;
        right: 0;
        transform-origin: right;
      }
      &.grid {
        opacity: 0 !important;
        &.left {
          transform: scale(2);
          bottom: -400px;
          left: 20vw;
        }
        &.right {
          transform: rotate(180deg) scale(1.5);
          bottom: -900px;
          right: 35vw;
        }
        &.right-2 {
          transform: scale(2);
          bottom: -1100px;
          right: 12vw;
        }
      }
    }
  }
  @media (min-width: 2700px) {
    .leaderboard {
      .bg-element.grid {
        display: block;
      }
    }
  }
  @media (min-width: 1599px) {
    .leaderboard {
      .bg-element {
        display: block;
      }
    }
  }
</style>
