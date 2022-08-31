<template>
  <Podium/>
</template>

<script>
import Podium from '@/components/panel/Podium.vue';

export default {
  name: 'LeaderboardPage',
  components: {
    Podium,
  },
};
</script>

<style scoped lang="scss">
  .col-middle--leaderboard {
    background: $light-navy-to-dark-vertical-gradient;
    position: relative;
    &::before {
      content: '';
      left: 0;
      top: 0;
      height: 100%;
      width: 6rem;
      position: absolute;
      background: linear-gradient(90deg, rgba(16,16,24,0.50) 0%, rgba(16,16,24,0) 75%);
    }
    &::after {
      content: '';
      right: 0;
      top: 0;
      height: 100%;
      width: 6rem;
      position: absolute;
      background: linear-gradient(270deg, rgba(16,16,24,0.50) 0%, rgba(16,16,24,0) 75%);
    }
  }
</style>
