<template>
  <div class="games">
    <div v-if="groupedTournaments.length === 0" class="area__loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <!-- TODO code up filter functionality and maybe update styling -->
    <div v-if="false" class="games__filter-row">
      <div class="games__filter-select">
        <select class="games__filter">
          <option value="0">Filters</option>
          <option value="1">Slot</option>
          <option value="2">Hi-Lo</option>
          <option value="3">Bingo</option>
        </select>
      </div>
    </div>
    <!-- <Button v-if="isMobile" text="Buy Tickets" class="tickets-cta" :class="{ 'v-step-6': isMobile }" @clicked="openStore" variant="overlay-green"/> -->
    <transition name="fade">
      <div v-if="groupedTournaments.length > 0" class="games__list v-step-0">
        <template v-for="(tournament, index) in groupedTournaments">
        <!-- <template v-for="(tournament, index) in groupedTournaments">
          <div
            v-if="canUpgradeToVip && index === groupedTournaments.findIndex((t) => t.tournament.minLevel > 0)"
            class="game-area-upgrade-btn"
            :key="`upgrade-btn-${tournament.tournament.id}`">
            <Button @clicked="$router.push({ name: 'Upgrade' })" text="Start Membership" variant="green"/>
          </div> -->
          <Game
            :key="tournament.tournament.id"
            :tournament="tournament.tournament"
            :userLevel="userLevel"
            :index="index"
          />
        </template>
      </div>
    </transition>
    <PrizeModal v-if="prizeDetails" v-model="show" :close="close" :prize="prizeDetails" :enter-now="emitGoToGame" :buy-tickets="openStore"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Game from '@/components/panel/Game.vue';
// import Button from '@/components/global/Button.vue';
import PrizeModal from '@/components/home/prizes/PrizeModal.vue';
import { mapGetters } from 'vuex';
import EventBus from '@/helpers/event-bus';

import sanity from '@/sanity';
import blocksToHtml from '@/helpers/blocks-to-html';

const query = `*[_type == "prize" && lobby == true] {
  _id,
  tournamentName,
  heading,
  description,
  imageMobile,
  imageDesktop,
}[0..50]
`;

export default {
  name: 'Games',
  components: {
    Game,
    // Button,
    PrizeModal,
  },
  data() {
    return {
      show: false,
      prizeDetails: null,
      prizes: [],
    };
  },
  computed: {
    // get a filtered and sorted batch of tournaments,
    // get current user's level
    ...mapGetters(['groupedTournaments', 'userLevel', 'canUpgradeToVip']),
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
  },
  created() {
    this.fetchData();
    EventBus.$on('showPrizeDetails', (tournamentId, tournamentName) => {
      const prize = this.prizes.find((p) => p.tournamentName === tournamentName);
      const tournament = this.groupedTournaments.find((t) => t.tournament.id === tournamentId);
      this.prizeDetails = {
        ...prize,
        description: blocksToHtml(prize.description),
        tournament: tournament.tournament,
      };
      this.show = true;
      if (!document.body.classList.contains('no-scroll')) {
        document.body.classList.add('no-scroll');
      }
    });
  },
  beforeDestroy() {
    EventBus.$off('showPrizeDetails');
  },
  methods: {
    fetchData() {
      this.prizes = [];
      this.isLoadingCMS = true;

      sanity.fetch(query).then(
        (prizes) => {
          this.isLoadingCMS = false;
          this.prizes = prizes;
        },
        (error) => {
          console.error('SANITY ERR:', error);
        },
      );
    },
    openStore() {
      EventBus.$emit('showTicketStore', true, null);
    },
    close() {
      this.show = false;
      document.body.classList.remove('no-scroll');
    },
    emitGoToGame() {
      EventBus.$emit('goToGame', this.prizeDetails.tournament);
    },
  },
};
</script>

<style scoped lang="scss">
  .games__list {
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    column-gap: 1rem;
    row-gap: 1rem;
  }
  .games__filter-row {
    margin-bottom: 1rem;
    display: flex;
  }
  .games__filter-select {
    position: relative;
    &::after {
      right: 1.125em;
      z-index: 4;
      border: 3px solid $kimberly;
      border-radius: 2px;
      border-right: 0;
      border-top: 0;
      content: " ";
      display: block;
      height: .625em;
      margin-top: -.4375em;
      pointer-events: none;
      position: absolute;
      top: 50%;
      transform: rotate(-45deg);
      transform-origin: center;
      width: .625em;
    }
  }
  select.games__filter {
    cursor: pointer;
    display: block;
    font-size: 1em;
    max-width: 100%;
    outline: 0;
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background-color: $light-navy;
    color: $kimberly;
    padding: .5rem 2.5rem .5rem 1.5rem;
    font-weight: 600;
  }
  .game-area-upgrade-btn {
    display: none;
  }
  @media (min-width: 1280px) {
    // temporary
    .games__filter-row {
      margin-bottom: 0;
    }
  }
  @media (max-width: 1920px) {
    .games__list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 1279px) {
    .games__filter-row {
      justify-content: space-between;
    }
  }
  @media (max-width: 767px) {
    .games__list {
      grid-template-columns: repeat(1, 1fr);
    }
    .games__filter-select {
      margin-right: 1rem;
    }
    .game-area-upgrade-btn {
      display: block;
      .button {
        display: block;
        width: 100%;
      }
    }
  }
</style>
