<template>
  <div class="winners">
    <div class="t-divider">
      <img src="@/assets/t-divider.svg">
      <template v-if="content">
        <h3>{{content.heading}}</h3>
        <p>{{content.subheading}}</p>
      </template>
    </div>
    <div class="t-winners__feed">
      <div class="loader" v-if="isLoading">
        <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
      <template v-else>
        <Winner
          v-for="winner in winners"
          :key="winner.id"
          :variant="getWinVariant(winner)"
          :user="winner.displayName"
          :prize="getPrizeAmount(winner)"
          :game="winner.tournamentName || winner.jackpotName"
          :date="winner.date"
          :country="winner.country"
          :jackpot="winner.jackpotId ? true : false"
          home-view
        />
      </template>
    </div>
  </div>
</template>

<script>
import Winner from '@/components/global/Winner.vue';

export default {
  name: 'Winners',
  components: {
    Winner,
  },
  props: ['content'],
  data() {
    return {
      isLoading: true,
      polling: null,
    };
  },
  computed: {
    winners() {
      if (!this.$store.state.tournaments.lastWins) return [];
      return this.$store.state.tournaments.lastWins.slice(0, 5);
    },
  },
  created() {
    this.$store.dispatch('loadLastWins', 5).then(() => { this.loadLastWins(); })
      .finally(() => {
        this.isLoading = false;
      });
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    loadLastWins() {
      this.polling = setInterval(async () => {
        await this.$store.dispatch('loadLastWins', 15); // load 15 wins, default 10
      }, 75000);
    },
    getWinVariant(win) {
      return win.jackpotId ? win.jackpotLabel.toLowerCase() : win.tournamentType.toLowerCase();
    },
    getPrizeAmount(win) {
      if (win.prize) {
        return this.formatMoney(win.prize.amount, win.prize.currencyCode || 'USD');
      }
      return this.formatMoney(win.amount, 'USD');
    },
  },
};
</script>

<style scoped lang="scss">
  .winners {
    width: 100%;
    padding: 0 20px;
    max-width: 1460px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & .t-winners__feed {
      max-width: 700px;
      width: 100%;
      & .loader {
        text-align: center;
      }
    }
  }
</style>

<style lang="scss">
  @media (min-width: 768px) {
    .winners .t-winners__feed .winner__marque {
      font-size: 14px;
    }
  }
</style>
