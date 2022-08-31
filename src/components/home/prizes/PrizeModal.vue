<template>
  <div v-if="isMobile">
    <div v-if="value" class="prize__mobile-overlay" @click="close"></div>
    <div class="prize-details modal-slide-up" :class="{ closed: !value }">
      <div class="prize__body">
        <div class="prize__header">
          <img svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
          <img svg-inline class="close-button" @click="close" src="@/assets/close.svg" alt="Close">
        </div>
        <img class="prize__img" :src="imageUrlFor(prize.imageMobile)">
        <div class="prize__content">
          <p class="game">{{prize.game}}</p>
          <h3>{{prize.heading}}</h3>
          <div class="details">
            <span v-if="prize.tournament.prizeTotal" class="prize-amount"><img src="@/assets/icon-trophy.svg"> {{formatMoney(prize.tournament ? prize.tournament.prizeTotal : prize.tournament.prizeTotal)}}</span>
            <span><img src="@/assets/icon-ticket.svg" class="ticket-icon"> {{entryCost}}</span>
            <span><img src="@/assets/icon-stopwatch.svg"> Ending {{prize.tournament ? $dayjs(prize.tournament.endTime).startOf('day').format('MMM Do, YYYY') : prize.endDate}}</span>
          </div>
          <p class="prize-desc" v-html="prize.description"></p>
          <Button class="gtm-lpclick gtm-click" @clicked="enterNow" text="ENTER NOW" variant="rounded-blue"/>
          <Button v-if="$route.name !== 'Lobby' && entryCost" class="gtm-lpclick gtm-click" @clicked="buyTickets" text="BUY TICKETS" variant="outlined-white"/>
          <div class="dates">
            <div class="date">
              <p>CLOSES</p>
              <p>{{ endDate }}</p>
            </div>
            <div class="date">
              <p>{{ prize.tournament.prizes.length === 1 ? 'WINNER ANNOUNCED' : 'WINNERS ANNOUNCED' }}</p>
              <p>{{ endDate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal
    v-else
    v-model="value"
    mode="simple"
    class="prize__modal"
    no-buttons
    close-button
    :close-btn-action="close"
  >
    <template v-slot:body>
      <div class="prize-details" v-if="prize">
        <div class="prize__body">
          <img class="prize__img" :src="imageUrlFor(prize.imageDesktop)">
          <div class="prize__content">
            <div class="top">
              <p class="game">{{prize.game}}</p>
              <h3>{{prize.heading}}</h3>
              <div class="details">
                <span v-if="prize.tournament.prizeTotal" class="prize-amount"><img src="@/assets/icon-trophy.svg"> {{formatMoney(prize.tournament.prizeTotal)}}</span>
                <span><img src="@/assets/icon-ticket.svg"> {{entryCost}}</span>
                <span><img src="@/assets/icon-stopwatch.svg"> Ending {{ typeof prize.tournament !== 'undefined' ? $dayjs(prize.tournament.endTime).startOf('day').format('MMM Do, YYYY') : prize.endDate }}</span>
              </div>
              <p class="prize-desc" v-html="prize.description"></p>
            </div>
            <div class="bottom">
              <Button class="gtm-lpclick gtm-click" @clicked="enterNow" text="ENTER NOW" variant="rounded-blue"/>
              <Button v-if="$route.name !== 'Lobby' && entryCost" class="gtm-lpclick gtm-click" @clicked="buyTickets" text="BUY TICKETS" variant="outlined-white"/>
              <div class="dates">
                <div class="date">
                  <p>CLOSES</p>
                  <p>{{ endDate }}</p>
                </div>
                <div class="date">
                  <p>{{ prize.tournament.prizes.length === 1 ? 'WINNER ANNOUNCED' : 'WINNERS ANNOUNCED' }}</p>
                  <p>{{ endDate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Button from '@/components/global/Button.vue';
import Modal from '@/components/global/Modal.vue';

import sanity from '@/sanity';
import imageUrlBuilder from '@sanity/image-url';

const imageBuilder = imageUrlBuilder(sanity);

export default {
  name: 'PrizeModal',
  components: {
    Modal,
    Button,
  },
  props: ['value', 'prize', 'close', 'enterNow', 'buyTickets'],
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    entryCost() {
      if (this.prize.tournament) {
        if (this.$route.name === 'Home' && !this.prize.tournament.playerEntryCost && this.nextEntryCost) {
          return this.nextEntryCost;
        }
        return this.prize.tournament.playerEntryCost;
      }
      return 0;
    },
    nextEntryCost() {
      return this.prize.tournament.entryCosts.find((c) => c > 0);
    },
    endDate() {
      if (!this.prize.tournament) return null;
      const tz = this.$dayjs.tz.guess();
      if (tz) {
        return this.$dayjs(this.prize.tournament.endTime)
          .subtract(5, 'hour')
          .tz(tz)
          .startOf('day')
          .format('MMM Do, YYYY');
      }
      return this.$dayjs(this.prize.tournament.endTime).startOf('day').format('MMM Do, YYYY');
    },
  },
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },
  },
};
</script>

<style lang="scss">
  .prize__mobile-overlay {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .prize-details {
    &.modal-slide-up {
      background-color: $light-navy;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 9999 !important;
      padding: 20px;
      overflow: hidden;
      width: 100%;
      display: flex;
      justify-content: center;
      max-height: 80vh;
      transform: translateY(0);
      transition: transform 0.3s ease-in-out;
      &.closed {
        overflow: hidden;
        transform: translateY(100%);
        transition: transform 0.3s ease-in-out;
      }
      & .prize__body {
        flex-direction: column;
        align-items: center;
        position: relative;
        overflow: scroll;
        height: 75vh;
        max-width: 500px;
        & .prize__img {
          margin-right: 0;
          width: 100%;
          margin-bottom: 20px;
        }
        & .details {
          flex-wrap: wrap;
          width: 100%;
          & .ticket-icon {
            width: 20px;
          }
        }
        & .dates {
          flex-direction: column;
          & .date:first-of-type {
            margin-bottom: 20px;
          }
        }
      }
      & .prize__header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        & .site-logo {
          width: 162px;
          height: 18px;
        }
        & .close-button {
          height: 18px;
          width: 18px;
          cursor: pointer;
          // position: fixed;
          // top: 20px;
          // right: 20px;
          &:hover path {
            fill: #fff;
          }
          & path {
            fill: #efefef;
          }
        }
      }
    }
    & .prize__body {
      display: flex;
      justify-content: space-between;
      & .prize__img {
        border-radius: 5px;
        margin-right: 40px;
        object-fit: cover;
        width: 500px;
      }
      & .prize__content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        text-align: left;
        color: #fff;
        & .top, & .bottom {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }
        & .game {
          font-size: 12px;
          font-weight: 600;
          line-height: 19px;
          margin: 0;
          color: #ED49C3;
        }
        & h3 {
          font-size: 25px;
          font-weight: 700;
          line-height: 40px;
          text-align: left;
          margin-bottom: 20px;
        }
        & .details {
          padding: 12px;
          border: 1px solid #FFFFFF;
          border-radius: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          & span {
            text-align: left;
            font-size: 12px;
            font-weight: 500;
            line-height: 15px;
            & img {
              margin-left: 20px;
              margin-right: 6px;
              margin-bottom: -3px;
            }
          }
           & .prize-amount {
            font-size: 14px;
            font-weight: 600;
            line-height: 14px;
            & img {
              margin-left: 0;
              margin-bottom: -2px;
            }
           }
        }
        & .prize-desc {
          font-size: 14px;
          font-weight: 400;
          line-height: 26px;
          letter-spacing: -0.35px;
          text-align: justify;
          & ul {
            padding-left: 20px;
            li {
              font-size: 14px;
              font-weight: 600;
              line-height: 26px;
              color: #FFFFFF99;
              margin-bottom: 20px;
            }
          }
        }
        & .button {
          flex: none;
          padding: 17px;
          font-size: 16px;
          width: 100%;
          margin-top: 20px;
        }
        & .dates {
          margin-top: 30px;
          width: 100%;
          display: flex;
          justify-content: space-around;
          & .date {
            text-align: center;
            & p {
              font-size: 14px;
              font-weight: 500;
              line-height: 26px;
              margin: 0;
              &:first-of-type {
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }

  .prize__modal {
    & .modal {
      width: auto !important;
      max-width: 1100px;
    }
  }
  .details span:first-child img {
    margin-left: 0 !important;
  }
</style>
