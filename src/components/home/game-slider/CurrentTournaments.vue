<template>
  <div class="current-tournaments">
    <div class="section-header">
      <img src="@/assets/tournament-tree.svg">
      <p>Current Tournaments</p>
      <div class="stroke"></div>
    </div>
    <div class="loader" v-if="isLoading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div v-else class="card-wrapper">
      <TournamentCard v-for="(item, index) in groupedTournaments" :key="index" :tournament="item.tournament"/>
    </div>
  </div>
</template>

<script>
import TournamentCard from '@/components/home/game-slider/TournamentCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'CurrentTournaments',
  components: {
    TournamentCard,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters(['groupedTournaments']),
  },
  created() {
    this.$store.dispatch('loadTournaments').finally(this.isLoading = false);
    this.polling = setInterval(async () => {
      await this.$store.dispatch('loadTournaments');
    }, 10000);
  },
};
</script>

<style lang="scss">
  .current-tournaments {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    & .loader {
      text-align: center;
    }
    & .card-wrapper {
      display: flex;
      overflow-x: scroll;
      padding-bottom: 10px;
      margin-bottom: 10px;
      & .tournament-card {
        min-width: 90%;
      }
    }
  }

  @media (min-width: 767px) {
    .current-tournaments {
      padding: 0 60px;
      max-width: 1460px;
      width: 100%;
      & .card-wrapper {
        // position: relative;
        // &:after {
        //   content: '';
        //   position: absolute;
        //   right: 0;
        //   height: 100%;
        //   width: 2rem;
        //   background: linear-gradient(to left,
        //     $dark 20%,
        //     rgba(0,0,0, 0) 80%
        //   );
        //   pointer-events: none;
        // }
        & .tournament-card {
          min-width: 320px;
        }
      }
    }
  }
</style>
