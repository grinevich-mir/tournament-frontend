<template>
  <div class="winners__feed" @click="goToWinners">
    <div class="winners__feed__wrapper">
      <div class="winners__big-wins" v-if="bigWins && (!isMobile || (isMobile && $route.name === 'Winners'))">
        <h2 class="winners__feed-title">Big Wins</h2>
        <div v-if="bigWins.length === 0" class="area__loading area__loading--wins">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
        <transition name="fade">
          <div class="winners__feed-list" v-if="bigWins.length > 0">
            <transition-group class="winners__feed-tg" name="list-complete" tag="div">
              <Winner
                v-for="(win, index) in bigWins"
                :key="`bw-${index}-${win.amount}`"
                @click="$emit('tap-winner')"
                :variant="getBigWinVariant(win)"
                :user="win.displayName"
                :prize="getPrizeAmount(win)"
                :game="win.name"
                :date="win.date"
                :country="win.country"
                jackpot
              />
            </transition-group>
          </div>
        </transition>
      </div>

      <div class="winners__recent-wins">
        <h2 class="winners__feed-title">Recent Winners</h2>
        <div v-if="wins.length === 0" class="area__loading area__loading--wins">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
        <transition name="fade">
          <div class="winners__feed-list" v-if="wins.length > 0">
            <transition-group class="winners__feed-tg" name="list-complete" tag="div">
              <Winner
                v-for="win in wins"
                :key="win.id"
                @click="$emit('tap-winner')"
                :variant="getWinVariant(win)"
                :user="win.displayName"
                :prize="getPrizeAmount(win)"
                :game="win.tournamentName || win.jackpotName"
                :date="win.date"
                :country="win.country"
                :jackpot="win.jackpotId ? true : false"
              />
            </transition-group>
          </div>
        </transition>
      </div>
    </div>
    <Copyright/>
  </div>
</template>

<script>
import Winner from '@/components/global/Winner.vue';
import Copyright from '@/components/global/Copyright.vue';

export default {
  name: 'WinnersFeed',
  components: {
    Copyright,
    Winner,
  },
  data() {
    return {
      polling: null,
      lastWinsCalled: false,
    };
  },
  computed: {
    isMobile() {
      this.loadLastWinsInit();
      return this.$store.state.helpers.isMobile;
    },
    lastWins() {
      return this.$store.state.tournaments.lastWins;
    },
    wins() {
      if (this.isMobile && this.$route.name !== 'Winners') {
        return this.$store.state.tournaments.allWins;
      }
      return this.$store.state.tournaments.lastWins;
    },
    bigWins() {
      return this.$store.state.tournaments.bigWins;
    },
  },
  created() {
    this.$store.dispatch('loadBigWins');
  },
  methods: {
    async loadLastWinsInit() {
      try {
        await this.$store.dispatch('loadLastWins', 15); // load 15 wins, default 10
      } catch (ex) {
        console.error('inner', ex.message);
        throw ex;
      } finally {
        if (!this.lastWinsCalled) {
          this.loadLastWins();
          this.lastWinsCalled = true;
        }
        if (this.isMobile === true && this.$route.name !== 'Winners') {
          // start removing from last wins array if mobile
          this.shiftWinner();
        } else if (this.isMobile === false) {
          // clearinterval to stop removing last wins if not mobile
          clearInterval(this.polling2);
        }
      }
    },
    // fetch a fresh batch of last wins every 75 seconds
    loadLastWins() {
      this.polling = setInterval(async () => {
        await this.$store.dispatch('loadLastWins', 15); // load 15 wins, default 10
      }, 75000);
    },
    // remove 1st winner from last wins array every 5 seconds
    shiftWinner() {
      this.polling2 = setInterval(() => {
        this.$store.dispatch('shiftAllWinners');
      }, 5000);
    },
    getBigWinVariant(win) {
      if (win.type === 'Jackpot') return 'mega';
      if (win.type === 'Tournament') return 'hilo';
      return 'hilo';
    },
    getWinVariant(win) {
      return win.jackpotId ? win.jackpotLabel.toLowerCase() : win.tournamentType.toLowerCase();
    },
    getPrizeAmount(win) {
      if (win.prize) {
        return this.formatMoney(win.prize.amount, win.prize.currencyCode || 'USD');
      }
      return this.formatMoney(win.amount, 'USD', false).split('.')[0];
    },
    goToWinners() {
      if (this.isMobile && this.$route.name !== 'Winners') this.$router.push({ name: 'Winners' });
    },
  },
  beforeDestroy() {
    // clear the tournaments fetching interval
    clearInterval(this.polling);
    // clear interval which removed winners from last wins array
    clearInterval(this.polling2);
  },
};
</script>

<style scoped lang="scss">
  .winners__big-wins {
    margin-bottom: 2rem;

    .winners__feed-title {
      font-weight: bold;
      background: $gold-gradient-diagonal;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
</style>
