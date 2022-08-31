<template>
  <WinnersFeed/>
</template>

<script>
import WinnersFeed from '@/components/global/WinnersFeed.vue';

export default {
  name: 'LastWins',
  components: {
    WinnersFeed,
  },
  data() {
    return {
      //
    };
  },
};
</script>

<style scoped lang="scss">
  .winner {
    line-height: 1.5;
  }
  /deep/ .winner__timeago {
    display: block !important;
  }
  .winners__feed {
    background-color: transparent;
  }
  @media (max-width: 1279px) {
    .panel {
      display: flex;
      flex-direction: column;
    }
    .col-left {
      display: none;
    }
    .mobile-nav {
      order: 1;
    }
    .col-middle {
      order: 3;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .col-right {
      order: 2;
    }
    .winners__feed {
      padding: .5rem;
      margin-top: .5rem;
    }
    /deep/ .copyright {
      display: none;
    }
    .history__main-body {
      padding: 1rem 0;
    }
    /deep/ .winner:not(:first-child):not(:last-child) {
      margin: .5rem 0;
    }
    .area__loading--wins {
      padding: 1rem 0;
    }
  }
  @media (max-width: 767px) {
    /deep/ .winner__timeago {
      display: none;
    }
  }
</style>
