<template>
  <div class="home">
    <div v-if="isFederatedLoading" class="form--loading-overlay federated-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="hero">
      <div class="hero__header" v-if="isMobile">
        <img svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" @click="goBack" />
        <Button v-if="!isLoggedIn" class="to-login gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Login', query: { redirect: `/play/${tournamentId}` } })">
          <template v-slot:text>
            LOG IN<img svg-inline src="@/assets/user-icon.svg">
          </template>
        </Button>
        <Button v-else style="flex: none; margin-right: 0;" @clicked="$router.push({ name: 'Lobby' })" text="BACK TO LOBBY" variant="outlined-white"/>
      </div>
      <div class="join">
        <div class="join__overlay">
          <div class="hero__header" v-if="!isMobile">
            <img svg-inline class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" @click="goBack" />
            <div class="dskt-btns">
              <template v-if="!isLoggedIn">
                <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Register', query: { redirect: `/play/${tournamentId}` } })" text="SIGN UP" variant="rounded-blue"/>
                <Button class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Login', query: { redirect: `/play/${tournamentId}` } })" text="LOG IN" variant="outlined-white"/>
              </template>
              <Button v-else style="margin-right: 0;" @clicked="$router.push({ name: 'Lobby' })" text="BACK TO LOBBY" variant="outlined-white"/>
            </div>
          </div>
          <p class="h5">WORLD HEAVYWEIGHT CHAMPIONSHIP</p>
          <p class="h1">WIN 2 VIP</p>
          <p class="h3">TICKETS TO SEE</p>
          <img svg-inline src="@/assets/hero-fury-vs.svg" class="fury-vs" alt="FURY vs WILDER">
          <p class="sub-h">RETURN FLIGHTS &amp; 5* LAS VEGAS HOTEL INCLUDED</p>
          <Button class="gtm-lpclick gtm-click" @clicked="goToGame" text="ENTER NOW" variant="rounded-blue button--enter"/>
        </div>
      </div>
      <img src="@/assets/home-bg-elements/home-bg-rect-2-left.svg" class="bg-element left">
      <img src="@/assets/home-bg-elements/home-bg-rect-3-right.svg" class="bg-element right">
      <img src="@/assets/home-bg-grid.svg" class="bg-element grid left">
      <img src="@/assets/home-bg-grid.svg" class="bg-element grid right">
    </div>
    <div class="prize__body" :class="{ mobile: isMobile }">
      <img v-if="!isMobile" class="prize__img" :src="prize.x2">
      <div class="prize__content">
        <p class="game">{{prize.game}}</p>
        <h3>{{prize.title}}</h3>
        <div class="details">
          <span v-if="prize.amount !== null" class="prize-amount"><img src="@/assets/icon-trophy.svg"> {{formatMoney(prize.tournament ? prize.tournament.prizeTotal : prize.amount)}}</span>
          <span><img src="@/assets/icon-ticket.svg" class="ticket-icon"> {{prize.tournament ? prize.tournament.entryCosts[0] : prize.entryPrice}}</span>
          <span><img src="@/assets/icon-stopwatch.svg"> Ending {{prize.tournament ? $dayjs(prize.tournament.endTime).startOf('day').format('MMM Do, YYYY') : prize.endDate}}</span>
        </div>
        <p class="prize-desc" v-html="prize.description"></p>
        <Button class="gtm-lpclick gtm-click" @clicked="goToGame" text="ENTER NOW" variant="rounded-blue"/>
        <Button class="gtm-lpclick gtm-click" @clicked="goToGame" text="BUY TICKETS" variant="outlined-white"/>
        <div class="dates">
          <div class="date">
            <p>CLOSES</p>
            <p>{{prize.tournament ? $dayjs(prize.tournament.endTime).startOf('day').format('MMM Do, YYYY') : prize.endDate}}</p>
          </div>
          <div class="date">
            <p>WINNER ANNOUNCED</p>
            <p>{{prize.tournament ? $dayjs(prize.tournament.endTime).startOf('day').format('MMM Do, YYYY') : prize.resultsDate}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- winners -->
    <Winners/>
    <!-- FAQ -->
    <FAQ/>
    <div v-if="isMobile" class="button-container">
      <Button class="gtm-lpclick gtm-click mt-2" @clicked="goToGame" text="ENTER NOW" variant="rounded-blue button--enter"/>
    </div>
    <!-- footer -->
    <div class="footer-home">
      <div class="container">
        <Footer/>
        <Copyright/>
      </div>
    </div>
  </div>
</template>

<script>
import Winners from '@/components/home/winners/Winners.vue';
import FAQ from '@/components/home/faq/FAQ.vue';
import Footer from '@/components/global/Footer.vue';
import Copyright from '@/components/global/Copyright.vue';
import Button from '@/components/global/Button.vue';
import championship1x from '@/assets/championship-tickets-1x.png';
import championship2x from '@/assets/championship-tickets-2x.png';
import { mapGetters } from 'vuex';

export default {
  name: 'LandingPageFury',
  components: {
    Winners,
    FAQ,
    Footer,
    Copyright,
    Button,
  },
  data() {
    return {
      isFederatedLoading: false,
      isLoading: false,
      prize: {
        x1: championship1x,
        x2: championship2x,
        game: 'Vegas Showdown',
        prizeLabel: '2x TICKETS + FLIGHT & HOTEL',
        title: 'Win 2x VIP Tickets, Return Flights & 5* Luxury Las Vegas Suite!',
        description: `
          <p>YOU AND A FRIEND WILL:</p>
          <ul>
            <li>Experience the trip of a lifetime with this fantastic prize for heavyweight boxing fans.</li>
            <li>Be the envy of your friends as you fly to the World Championship and stay in a top hotel, all expenses paid.</li>
            <li>Watch Fury and Wilder in their hotly anticipated trilogy fight. Savour being at the heart of the action as the winner of the world title is revealed.</li>
          </ul>
        `,
        amount: null,
        entryPrice: 7,
        endDate: 'Oct 3, 2021',
        resultsDate: 'October 4, 2021',
        endMonth: 'October',
      },
    };
  },
  computed: {
    ...mapGetters(['groupedTournaments']),
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    tournamentId() {
      if (!this.groupedTournaments) return null;
      const vegasShowdown = this.groupedTournaments.find((t) => t.tournament.name === 'Vegas Showdown');
      return vegasShowdown ? vegasShowdown.tournament.id : null;
    },
    isLoggedIn() {
      return this.$store.state.auth.user !== null;
    },
  },
  created() {
    if (typeof this.$route.query.code !== 'undefined' && typeof this.$route.query.state !== 'undefined') {
      this.isFederatedLoading = true;
    }
    this.isLoading = true;
    this.$store.dispatch('loadTournaments');
    this.$store.dispatch('loadJackpots').finally(() => {
      this.isLoading = false;
    });
  },
  methods: {
    goToGame() {
      if (this.isLoggedIn) {
        this.$router.push({ path: `/play/${this.tournamentId}` });
      } else {
        this.$router.push({ name: 'Register', query: { redirect: `/play/${this.tournamentId}` } });
      }
    },
    goBack() {
      if (this.isLoggedIn) {
        this.$router.push({ name: 'Lobby' });
      } else {
        this.$router.push({ name: 'Home' });
      }
    },
  },
};
</script>

<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  .home {
    margin: 0 auto;
    color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    /deep/ .button--rounded-blue.large {
      padding: 12px 2rem;
      font-size: 18px;
      width: calc(100vw - 3rem);
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  .footer-home {
    min-width: 1320px;
    .copyright {
      margin: 2rem 0;
    }
  }
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: relative;
    .hero__header {
      width: 100%;
      // max-width: 1440px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;

      .to-login {
        display: flex;
        align-items: center;
        background: transparent;
        color: #fff;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 12px;
        line-height: 26px;
        padding: 0;
        flex: unset !important;
        box-shadow: none;
        & svg {
          margin-left: 10px;
          flex: 1;
        }
      }
    }
    .site-logo {
      display: block;
      margin: 0;
      width: 162px;
      height: auto;
    }

    .dskt-btns {
      .button {
        flex: none;
        padding: 6px 30px 6px 30px;
        font-size: 14px;
        font-weight: 600;
        line-height: 26px;
        // &:first-of-type {
        //   margin-right: 16px;
        // }
      }
    }
    .bg-element {
      position: absolute;
      transform: scale(1.3);
      opacity: 0;
      &.left {
        left: 0;
        transform-origin: left;
        bottom: -600px;
      }
      &.right {
        right: 0;
        transform-origin: right;
        bottom: -800px;
      }
      &.grid {
        opacity: 0 !important;
        transform: scale(2);
        &.left {
          bottom: -600px;
          left: 20vw;
        }
        &.right {
          bottom: -250px;
          right: 20vw;
        }
      }
    }
  }

  .prize__body.mobile {
    flex-direction: column;
    align-items: center;
    position: relative;
    max-width: 700px;
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
  .prize__body {
    display: flex;
    justify-content: space-between;
    max-width: 1024px;
    padding: 20px;
    & .prize__img {
      border-radius: 5px;
      margin-right: 40px;
      object-fit: cover;
      width: 500px;
    }
    & .prize__content {
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      align-items: flex-start;
      text-align: left;
      color: #fff;
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
        font-weight: 600;
        line-height: 26px;
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

  .details span:first-child img {
    margin-left: 0 !important;
  }
  .site-logo {
    cursor: pointer;
  }

  @media (min-width: 2700px) {
    .hero {
      .bg-element.grid {
        opacity: 1 !important;
      }
    }
  }
  @media (min-width: 1599px) {
    .hero {
      .hero__header {
        justify-content: center;
        position: relative;
        svg {
          min-width: 225px;
        }
        .dskt-btns {
          position: absolute;
          right: 60px;
        }
      }
      .bg-element {
        opacity: 1;
      }
    }
  }
  @media (min-width: 767px) {
    .hero {
      .hero__header {
        padding: 26px 60px;
        .site-logo {
          width: 200px;
        }
      }
    }
  }

  .join {
    margin-bottom: 20px;
    background-image: url('~@/assets/hero-fury-mobile.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    display: flex;
    & .join__overlay {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      height: 100%;
      background: transparent;
      padding: 40px 20px;
      position: relative;
      & .hero__header {
        width: 100%;
        max-width: 1440px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        position: absolute;
        top: 0;
        .site-logo {
          display: block;
          margin: 0;
          width: 200px;
          height: auto;
        }
        .dskt-btns {
          .button {
            flex: none;
            padding: 6px 30px 6px 30px;
            font-size: 14px;
            font-weight: 600;
            line-height: 26px;
            width: fit-content;
            &:first-of-type {
              margin-right: 16px;
            }
          }
        }
      }
      p.h5 {
        margin-bottom: 0;
        line-height: 1.5;
        font-style: italic;
        font-weight: 600;
        font-size: 16px;
        letter-spacing: 2px;
        @media (max-width: 768px) {
          font-size: 12px;
          margin-bottom: 5px;
        }
      }
      p.h1 {
        font-size: 139px;
        line-height: 0.95;
        @media (max-width: 768px) {
          font-size: 100px;
        }
      }
      p.h3 {
        font-size: 74px;
        margin-top: -21px;
        letter-spacing: 4px;
        @media (max-width: 768px) {
          font-size: 50px;
          margin-top: -10px;
          margin-bottom: -6px;
        }
      }
      p.sub-h {
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 36px;
        letter-spacing: 2px;
        margin-bottom: 25px;
        @media (max-width: 768px) {
          font-weight: 400;
          font-size: 12px;
          line-height: 1.4;
          letter-spacing: 0.5px;
          margin-left: -10px;
          margin-right: -10px;
        }
      }
      svg.fury-vs {
        width: 290px;
        height: 235px;
        @media (max-width: 768px) {
          width: 200px;
          height: 175px;
        }
      }
      p.h1, p.h3 {
        font-family: 'Bebas Neue', 'Montserrat', BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
        font-weight: 400;
      }
    }
  }
  .button--enter {
    font-size: 14px;
    font-weight: 600;
    line-height: 26px;
    padding: 11px 33px;
    width: 230px;
    flex: none;
  }
  .prizes {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    position: relative;
    max-width: 1460px;
    width: 100%;
    z-index: 2;
  }
  .prize-description {
    text-align: center;
    z-index: 1;
    max-width: 855px;
    margin-top: 20px;

    & h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      line-height: 29px;
    }

    & p {
      margin: 20px 0;
      font-weight: 500;
      font-size: 12px;
      line-height: 19px;
      margin-bottom: 0;
    }

    & .button {
      font-weight: 600;
      font-size: 14px;
      line-height: 26px;
      padding: 8px 40px;
    }

  }
  .mt-2 {
    margin-top: 2rem !important;
  }
  @media (min-width: 768px) {
    .prizes {
      padding: 0 60px;
      justify-content: center;
      align-items: center;
    }
    .prize-description {
      margin-top: 20px;
      & h3 {
        font-size: 26px;
        font-weight: 700;
        line-height: 42px;
        text-transform: uppercase;
      }
      & p {
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        margin-top: 40px;
      }
    }
  }
  @media (min-width: 1599px) {
    .join {
      background-image: url('~@/assets/hero-fury.jpg');
    }
  }
  @media (min-width: 768px) {
    .join {
      background-image: url('~@/assets/hero-fury.jpg');
      & .join__overlay {
        min-height: 860px;
      }
    }
  }
  /deep/ h3 {
    text-transform: uppercase !important;
  }
</style>

<style lang="scss">
  ul {
    padding-left: 20px !important;
    li {
      font-size: 14px;
      font-weight: 600;
      line-height: 26px;
      color: #FFFFFF99;
      margin-bottom: 20px;
    }
  }
  .home {
    & .gold {
      background: linear-gradient(115.15deg, #D7AF58 3.55%, #FFDE95 58.01%, #D7AF58 96.38%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    & .t-divider {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      & img {
        margin: 40px 0;
      }
      & h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 29px;
      }
      & p {
        margin-bottom: 20px;
        font-weight: 500;
        font-size: 12px;
        line-height: 19px;
      }
    }
    .footer-home .footer {
      margin-top: 10px !important;
    }
  }
  @media (min-width: 768px) {
    .home {
      & .t-divider {
        & img {
          margin-bottom: 30px;
        }
        & h3 {
          font-size: 26px;
          line-height: 42px;
        }
        & p {
          font-size: 16px;
          line-height: 26px;
          margin-bottom: 30px;
        }
      }
    }
  }
</style>
