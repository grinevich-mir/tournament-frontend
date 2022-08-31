<template>
  <div>
    <Games/>
    <!-- <VipModal v-if="$store.state.vip.showVip && $store.state.vip.vipActive" /> -->
    <EnterDiamondGameModal />
  </div>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import Games from '@/components/panel/Games.vue';
import EnterDiamondGameModal from '@/components/diamond-store/EnterDiamondGameModal.vue';

export default {
  name: 'Lobby',
  components: {
    Games,
    EnterDiamondGameModal,
  },
  data() {
    return {
      polling: null,
    };
  },
  async created() {
    EventBus.$on('goToGame', this.goToGame);
    // this.$store.dispatch('loading_tournament_on');
    try {
      await this.$store.dispatch('loadTournaments');
    } catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    }
    // finally {
    //   this.$store.dispatch('loading_tournament_off');
    // }
    this.loadNewTournaments();
  },
  mounted() {
    if (this.$route.query.startTour) this.$tours.onboarding.start();
  },
  beforeDestroy() {
    document.body.classList.remove('vip-modal-opened');
    // clear the tournaments fetching interval
    clearInterval(this.polling);
    EventBus.$off('goToGame');
  },
  computed: {
    diamondBalance() {
      return this.$store.getters.diamondBalance;
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
  },
  methods: {
    // fetch a fresh batch of tournaments every 10 seconds
    loadNewTournaments() {
      this.polling = setInterval(async () => {
        await this.$store.dispatch('loadTournaments');
      }, 10000);
    },
    hasCost(tournament) {
      return tournament.playerEntryCost && (!tournament.playerJoined || tournament.playerAllocations === tournament.playerAllocationsComplete);
    },
    getCutOffTime(tournament) {
      // game cut off  time
      const gameCutOffTime = this.$dayjs(tournament.entryCutOffTime);
      // current time
      const nowTime = this.$dayjs.utc();
      // time difference
      return gameCutOffTime.diff(nowTime, 'seconds');
    },
    goToGame(tournament, skipEnterModal = false) {
      const hasCost = this.hasCost(tournament);

      if (hasCost && tournament.playerEntryCost > this.diamondBalance) {
        // game has cost and user doesnt have enough diamonds
        this.$store.dispatch('setGameClicked', tournament);
        EventBus.$emit('showTicketStore', false, tournament.playerEntryCost);
      } else if ((this.getCutOffTime(tournament) > 0 || tournament.playerJoined) && this.userLevel >= tournament.minLevel) {
        // no cost OR user has enough diamonds

        if (skipEnterModal || !hasCost) { // no cost OR user coming from diamond store => skips confirm dialog
          this.$store.dispatch('setGameClicked', null);
          this.$router.push({ name: 'Play', params: { id: tournament.id } });
        } else { // has cost AND user has enough diamonds => show confirm dialog
          this.$store.dispatch('setGameClicked', tournament);
          EventBus.$emit('showEnterModal', tournament.playerAllocations > 0);
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
