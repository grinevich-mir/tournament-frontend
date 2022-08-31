<template>
  <div class="winners-wrapper">
    <div class="winners__tabs" v-if="isMobile">
      <div class="winners__tab" @click="currentView = 'leaderboard'" :class="{ active: currentView === 'leaderboard' }">Leaderboard</div>
      <div class="winners__tab" @click="currentView = 'lastwins'" :class="{ active: currentView === 'lastwins' }">Last winners</div>
    </div>
    <div class="winners__content">
      <LastWins v-if="currentView === 'lastwins'"/>
      <Leaderboard v-if="currentView === 'leaderboard'" />
    </div>
  </div>
</template>

<script>
import LastWins from './LastWins.vue';
import Leaderboard from './Leaderboard.vue';

export default {
  name: 'WinnersWrapper',
  components: {
    LastWins,
    Leaderboard,
  },
  data() {
    return {
      currentView: 'leaderboard',
    };
  },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
  },
  watch: {
    isMobile() {
      if (this.$store.state.helpers.isMobile === false) this.currentView = 'leaderboard';
    },
  },
};
</script>

<style scoped lang="scss">
  .winners-wrapper {
    padding-top: .5rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    & .winners__tabs {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 300px;
      margin-bottom: 1rem;

      & .winners__tab {
        width: 50%;
        text-align: center;
        color: #fff;
        padding: 8px;
        font-size: 14px;
        border: 2px solid $blue;
        cursor: pointer;

        &:first-of-type {
          border-bottom-left-radius: 4px;
          border-top-left-radius: 4px;
        }
        &:last-of-type {
          border-bottom-right-radius: 4px;
          border-top-right-radius: 4px;
        }

        &:hover {
          background-color: rgba(13, 126, 232, 0.2);
        }

        &.active {
          background-color: $blue;
          font-weight: 600;
        }
      }
    }

    & .winners__content {
      width: 100%;
    }
  }
</style>
