<template>
  <div class="prize-slider">
    <div class="t-divider">
      <img src="@/assets/t-divider.svg">
      <template v-if="prizeList">
        <h3>{{prizeList.heading}}</h3>
        <p>{{prizeList.subheading}}</p>
      </template>
    </div>
    <div class="loader" v-if="isLoading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div v-else class="card-wrapper">
      <PrizeCard v-for="(item, index) in prizes" :key="index" :prize="item" :index="index" :openModal="openModal" :isLoading="isLoading"/>
    </div>
    <PrizeModal v-if="currentPrize" v-model="show" :close="close" :prize="currentPrize" :enter-now="goToReg" :buy-tickets="goToReg"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PrizeCard from '@/components/home/prizes/PrizeCard.vue';
import PrizeModal from '@/components/home/prizes/PrizeModal.vue';

import blocksToHtml from '@/helpers/blocks-to-html';

export default {
  name: 'PrizeSlider',
  components: {
    PrizeCard,
    PrizeModal,
  },
  props: ['prizeList'],
  data() {
    return {
      show: false,
      currentPrize: null,
      isLoading: true,
      prizes: [],
    };
  },
  computed: {
    ...mapGetters(['groupedTournaments']),
    tournamentsWithPrize() {
      if (!this.groupedTournaments || !this.groupedTournaments.length) return [];
      const filteredTournaments = this.groupedTournaments.filter((t) => t.tournament.prizeTotal !== null);
      return filteredTournaments;
    },
    prizesData() {
      return {
        tournaments: this.tournamentsWithPrize,
        content: this.prizeList,
      };
    },
  },
  watch: {
    prizesData(newVal) {
      if (newVal.tournaments && newVal.content) {
        this.populateDynamicData();
      }
    },
  },
  created() {
    this.$store.dispatch('loadTournaments');
  },
  methods: {
    populateDynamicData() {
      if (!this.prizeList || !this.prizeList.prizes) return;
      this.prizes = [];
      this.prizeList.prizes.forEach((prize) => {
        const tp = this.tournamentsWithPrize.find((t) => t.tournament.name === prize.tournamentName);
        if (tp) {
          this.prizes.push({
            ...prize,
            tournament: tp.tournament,
            description: blocksToHtml(prize.description),
          });
        }
      });
      this.setCurrentPrize(this.prizes[0]);
      this.isLoading = false;
    },
    openModal(item) {
      this.show = true;
      this.setCurrentPrize(item);
      if (!document.body.classList.contains('no-scroll')) {
        document.body.classList.add('no-scroll');
      }
    },
    setCurrentPrize(prize) {
      this.currentPrize = prize;
    },
    close() {
      this.show = false;
      // this.currentPrize = null;
      document.body.classList.remove('no-scroll');
    },
    goToReg() {
      this.$router.push({ name: 'Register' });
    },
  },
};
</script>

<style lang="scss">
  .prize-slider {
    z-index: 1;
    & h3 {
      font-size: 18px;
      font-weight: 700;
      line-height: 29px;
      text-align: center;
    }
    & p.subheading {
      font-size: 12px;
      font-weight: 500;
      line-height: 19px;
      text-align: center;
    }
    & .loader {
      text-align: center;
    }
    & .card-wrapper {
      display: flex;
      overflow-x: scroll;
      padding-bottom: 10px;
      margin-bottom: 10px;
      margin-top: 20px;
      & .p-card {
        margin: 0 10px;
        min-width: 238px;
        max-width: 238px;
        &:first-of-type {
          margin-left: 0;
        }
        &:last-of-type {
          margin-right: 0;
        }
        & .card__thumbnail img {
          height: 220px;
          width: 100%;
          flex: none;
          object-fit: cover;
        }
        & .p-card__container {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          text-align: center;
          & p.label {
            font-size: 12px;
            font-weight: 800;
            line-height: 26px;
            margin: 0;
          }
          & p.game {
            font-size: 12px;
            font-weight: 600;
            line-height: 26px;
            color: #ED49C3;
            text-transform: uppercase;
          }
          & p.desc {
            font-size: 12px;
            font-weight: 500;
            line-height: 19px;
            text-transform: uppercase;
          }
          & .button {
            font-size: 12px;
            padding: 8px 22px;
            margin-top: 10px;
            margin-bottom: 20px;
          }
          & .read-more {
            font-size: 12px;
            font-weight: 400;
            line-height: 13px;
            text-decoration-line: underline;
            text-transform: uppercase;
            color: #efefef;
            cursor: pointer;
            &:hover {
              color: #fff;
            }
          }
        }
      }
    }
  }
  @media (min-width: 1120px) {
    .card-wrapper {
      justify-content: center !important;
    }
  }
  @media (min-width: 767px) {
    .prize-slider {
      & .card-wrapper {
        & .card {
          min-width: 315px;
          max-width: 315px;
          & .p-card__container {
            & p.label {
              font-size: 16px;
            }
            & p.game {
              font-size: 14px;
            }
            & .button {
              padding: 14px 32px;
            }
          }
        }
      }
    }
  }
</style>
