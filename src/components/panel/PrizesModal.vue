<template>
  <Modal
    v-model="value"
    :title="modalTitle"
    mode="simple"
    :btn-action="enterGame"
    btn-text="Let's Play"
    btn-variant="rounded-blue"
    class="prizes-modal"
  >
    <template v-slot:body>
      <template v-if="!Object.keys(prizes).length && jackpots.length > 0">
        <div class="tournament-description-above">
          <p>
            Play your cards right and have a chance to win one of the following <strong>Mega Prizes</strong>!
          </p>
        </div>
        <div class="modal-jackpots">
          <div v-for="jackpot in jackpots" class="jackpot-item" :class="jackpot.label.toLowerCase()" :key="`jackpot-${jackpot.id}`">
            <div class="jackpot-label">
              {{ jackpot.label }}
            </div>
            <div class="jackpot-amount">
              {{ formatMoney(jackpot.balance, 'USD', true) }}
            </div>
          </div>
        </div>
      </template>
      <div v-if="introContent || staticIntroContent" class="tournament-description-above" v-html="desc('top')"></div>
      <div v-else-if="gameData.description" class="tournament-description-above" v-html="gameData.description"></div>
      <template v-if="prizes">
        <div class="prizes">
          <div class="prize" v-for="(prize, i) in prizes" :key="`prize-${i}`" :style="i > 5 ? 'display: none' : ''">
            <div class="prize-col prize-col--label">
              {{ formatPrizeName(i) }}
            </div>
            <div v-if="!prize.amount && prize.name" class="prize-col prize-col--value">
              {{ prize.name }}
            </div>
            <div v-else-if="prize.currencyCode === 'DIA'" class="prize-col prize-col--value">
              <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">
              {{prize.amount}}
            </div>
            <div v-else class="prize-col prize-col--value">
              {{ formatMoney(prize.amount, prize.currencyCode) }}
            </div>
          </div>
        </div>
      </template>
      <div v-if="introContent || staticIntroContent" class="tournament-description-above" v-html="desc('bottom')"></div>
    </template>
  </Modal>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import Modal from '@/components/global/Modal.vue';

export default {
  name: 'PrizesModal',
  props: ['value', 'gameData', 'prizes', 'jackpots'],
  components: {
    Modal,
  },
  data() {
    return {
      introContent: null,
    };
  },
  computed: {
    modalTitle() {
      // if (this.jackpots.length > 0 && this.modalShowJackpots) return 'Jackpots';
      if (this.prizes) return this.gameData.name;
      return null;
    },
    staticIntroContent() {
      if (this.gameData) {
        return this.$store.getters.getDescriptionByGameID(this.gameData.game.id);
      }
      return null;
    },
  },
  created() {
    if (this.gameData && this.gameData.introId) {
      this.$api.get(`/tournament/${this.gameData.id}/intro`)
        .then((response) => response.data)
        .then((intro) => {
          this.introContent = intro;
        });
    }
  },
  methods: {
    enterGame() {
      EventBus.$emit('enterGame');
    },
    desc(section) {
      if (this.introContent) return this.introContent[`${section}Content`];
      if (this.staticIntroContent) {
        return this.staticIntroContent[section](this.gameData);
      }
      return null;
    },
    formatPrizeName(position) {
      if (this.gameData.type === 'Bingo') {
        switch (position) {
          case '1':
            return 'Full House';

          case '2':
            return 'Two Lines';

          case '3':
            return 'One Line';

          default:
            return this.$options.filters.numberWithOrdinal(position);
        }
      }
      return this.$options.filters.numberWithOrdinal(position);
    },
  },
};
</script>

<style lang="scss" scoped>
  .prizes-modal {
    .tournament-title {
      margin-bottom: 1rem;
      color: #fff;
      font-size: 28px;
    }
    .prize {
      color: #fff;
      background: #101018;
      border-top: 2px solid #3d70e6;
      border-bottom: 2px solid #3D7CE6;
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 1rem;
      font-weight: 800;
      margin-left: 1rem;
      margin-right: 1rem;
    }
    .prize:not(:last-child) {
      margin-bottom: .5rem;
    }
    .prize:nth-child(1) {
      border-color: #FD9841;
    }
    .prize:nth-child(2) {
      border-color: #3D7CE6;
    }
    .prize:nth-child(3) {
      border-color: #71DDB9;
    }
    .prize:nth-child(1), .prize:nth-child(2), .prize:nth-child(3) {
      margin-left: 0;
      margin-right: 0;
      font-size: 18px;
    }
    .prizes {
      margin-bottom: 1.5rem;
      width: 400px;
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;

      & .ticket-icon {
        width: 18px;
        height: 18px;
        margin-bottom: -2px;
        path {
          fill: #7CFF84;
        }
      }
    }
    .tournament-description-above {
      margin-bottom: 1.5rem;
    }
    .modal-jackpots {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .jackpot-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      margin-bottom: .5rem;
      padding: .5rem 1rem;
      color: #fff;
      font-weight: 800;
      font-size: 15px;
      border-radius: 3px;
      width: 400px;
      position: relative;

      &::before,
      &::after {
        content: '';
        position: absolute;
        content: '';
        width: 300px;
        height: 3px;
        background: #fff;
        border-radius: 50%;
        left: 50%;
        transform: translateX(-50%);
        background: radial-gradient(circle, #87bfff 0%, rgba(255, 255, 255, 0) 100%);
        -webkit-filter: blur(2px);
        filter: blur(2px);
        mix-blend-mode: hard-light;
      }
      &::before {
        top: -1.5px;
      }
      &::after {
        bottom: -1.5px;
      }

      &.mega {
        background: $gold-gradient-diagonal;
        border-top: 2px solid $gradient-gold;
        border-bottom: 2px solid $gradient-gold;
        color: #000;
      }
      &.maxi {
        background: $silver-gradient-diagonal-double;
        border-top: 2px solid #A9A9A9;
        border-bottom: 2px solid #A9A9A9;
        color: #000;
      }
      &.mini {
        background: $orange-gradient-diagonal-double;
        border-top: 2px solid #9b623c;
        border-bottom: 2px solid #9b623c;
        color: #000;
      }
    }
  }
  .modal-inner-scroll-outer {
    &::before,
    &::after {
      position: absolute;
      content: '';
      height: 150px;
      width: 6px;
      background: #fff;
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
      background: radial-gradient(circle, #70b3ff 0%, rgba(112, 179, 255, 0) 100%);
      filter: blur(3px);
      mix-blend-mode: hard-light;
    }
    &::before {
      left: -3px;
    }
    &::after {
      right: -3px;
    }

    // gradients
    .prize {
      position: relative;
    }
    .prize:nth-child(-n+3):before,
    .prize:nth-child(-n+3):after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      mix-blend-mode: hard-light;
    }
    .prize:nth-child(-n+3):before {
      top: -3px;
    }
    .prize:nth-child(-n+3):after {
      bottom: -3px;
    }
    .prize:nth-child(1):before,
    .prize:nth-child(1):after {
      background: linear-gradient(90deg, rgba(246,218,184,0) 0%, rgba(246,218,184,1) 50%, rgba(246,218,184,0) 100%);
    }
    .prize:nth-child(2):before,
    .prize:nth-child(2):after {
      background: linear-gradient(90deg, rgba(246,218,184,0) 0%, #87bfff 50%, rgba(246,218,184,0) 100%);
    }
    .prize:nth-child(3):before,
    .prize:nth-child(3):after {
      background: linear-gradient(90deg, rgba(246,218,184,0) 0%, #bdfbe1 50%, rgba(246,218,184,0) 100%);
    }

    .prize:nth-child(-n+3) .prize-col.prize-col--label:before,
    .prize:nth-child(-n+3) .prize-col.prize-col--label:after {
      position: absolute;
      content: '';
      width: 150px;
      height: 5px;
      background: #fff;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
      background: radial-gradient(circle, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%);
      filter: blur(3px);
      mix-blend-mode: hard-light;
    }
    .prize:nth-child(-n+3) .prize-col.prize-col--label:before {
      top: -4px;
    }
    .prize:nth-child(-n+3) .prize-col.prize-col--label:after {
      bottom: -4px;
    }
    .prize:nth-child(1) .prize-col.prize-col--label:before,
    .prize:nth-child(1) .prize-col.prize-col--label:after {
      background: radial-gradient(circle, rgb(237, 192, 130) 0%, rgba(255, 255, 255, 0) 100%);
    }
    .prize:nth-child(2) .prize-col.prize-col--label:before,
    .prize:nth-child(2) .prize-col.prize-col--label:after {
      background: radial-gradient(circle, rgb(133, 206, 250) 0%, rgba(255, 255, 255, 0) 100%);
    }
    .prize:nth-child(3) .prize-col.prize-col--label:before,
    .prize:nth-child(3) .prize-col.prize-col--label:after {
      background: radial-gradient(circle, rgb(129, 237, 206) 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
  @media (max-width: 767px) {
    .prize:nth-child(1), .prize:nth-child(2), .prize:nth-child(3) {
      margin-left: 0;
      margin-right: 0;
      font-size: 15px;
    }
    .jackpot-item {
      padding: .2rem 1rem;
      font-size: 14px;
      width: 100%;
      &::before,
      &::after {
        width: 150px;
      }
      &::before {
        top: -1.5px;
      }
      &::after {
        bottom: -1.5px;
      }
    }
  }
</style>
