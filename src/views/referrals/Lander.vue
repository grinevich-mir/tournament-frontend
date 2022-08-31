<template>
  <div class="referrals">
    <div class="ref--header">
      <img svg-inline @click="$router.push({ name: 'Home' })" class="site-logo" src="@/assets/tournament-logo-gold.svg" alt="tournament-logo" />
    </div>
    <div class="form--loading-overlay" v-if="loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="ref--body" v-else>
      <div class="ref--content">
        <div class="banner">
          <img svg-inline class="pattern top-left" src="@/assets/referrals/pattern-topleft.svg">
          <img svg-inline class="pattern bottom-right" src="@/assets/referrals/pattern-bottomright.svg">
        </div>
        <UserPic :avatar="user.avatarUrl" no-border="true"/>
        <p class="display-name">{{user.displayName}}</p>
        <p class="description" v-html="description"></p>
        <div class="ref-stats">
          <div class="ref-stat tournament-count">
            <p class="amount"><img svg-inline class="icon" src="@/assets/trophy-icon.svg" alt="Tickets">{{tournamentCount}}</p>
            <p class="label">Tournaments</p>
          </div>
          <div class="ref-stat total-winnings">
            <p class="amount"><img svg-inline class="icon" src="@/assets/dollar-sign-icon.svg" alt="Tickets">{{ formatMoney(totalWinnings).replace('$', '') }}</p>
            <p class="label">Total winnings</p>
          </div>
          <div class="ref-stat free-tickets">
            <p class="amount"><img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">60</p>
            <p class="label">Free tickets</p>
          </div>
        </div>
        <Button class="gtm-lpclick gtm-click" large @clicked="$router.push({ name: 'Register' })" text="SIGN UP NOW" variant="rounded-blue"/>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';
import UserPic from '@/components/global/UserPic.vue';

import sanity from '@/sanity';
import blocksToHtml from '@/helpers/blocks-to-html';

const query = `*[_type == "referrals" && name == "Lander description"] {
  _id,
  content,
}[0]
`;

export default {
  name: 'ReferralLander',
  components: {
    Button,
    UserPic,
  },
  data() {
    return {
      loading: true,
      user: null,
      totalWinnings: null,
      description: null,
    };
  },
  computed: {
    tournamentCount() {
      if (!this.$store.getters.groupedTournaments) return null;
      return this.$store.getters.groupedTournaments.length;
    },
  },
  created() {
    Promise.all([
      this.$api.get(`/referral/public/slug/${this.$route.params.slug}`).then((response) => {
        this.user = response.data;
        this.$cookies.set('referredCode', this.user.code, 60 * 60 * 24 * 30);
      }).catch((err) => {
        if (err.response.status === 404) {
          this.$router.push({ name: '404', params: [this.$route.path] });
        }
      }),
      this.$api.get('/tournament/winner/total').then((response) => {
        this.totalWinnings = response.data.amount;
      }),
      this.fetchData(),
    ]).finally(() => {
      this.loading = false;
    });
  },
  methods: {
    fetchData() {
      this.description = null;
      this.isLoading = true;

      sanity.fetch(query).then(
        (lander) => {
          this.isLoading = false;
          this.description = blocksToHtml(lander.content);
        },
        (error) => {
          console.error('SANITY ERR:', error);
        },
      );
    },
  },
};
</script>

<style scoped lang="scss">
.referrals {
  color: #fff;
  width: 100%;
  padding-bottom: 32px;
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);

  & .ref--header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 28px;
    width: 100%;
    border: 2px solid #1D1D30;
    & .site-logo {
      cursor: pointer;
      width: 200px;
    }
  }

  & .ref--body {
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    & .ref--content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      max-width: 850px;
      padding: 32px;
      border-radius: 32px;

      background: rgba(29, 29, 48, 0.25);
      border: 2px solid #1D1D30;
      backdrop-filter: blur(16px);

      & .banner {
        position: absolute;
        width: 100%;
        height: 140px;
        left: 0px;
        right: 0px;
        top: 0px;
        z-index: 0;
        background: rgba(29, 29, 48, 0.25);
        box-shadow: 0px 4px 10px -4px rgba(0, 0, 0, 0.1);
        border-bottom: 2px solid #1D1D30;
        & .pattern {
          &.bottom-right {
            bottom: 0;
            right: 0;
            position: absolute;
          }
        }
      }
      & .user-pic {
        width: 150px;
        height: 150px;
        z-index: 1;
      }
      & .display-name {
        font-size: 20px;
        font-weight: 700;
        line-height: 24px;
        margin-top: 28px;
        margin-bottom: 22px;
      }
      & .description {
        font-size: 16px;
        font-weight: 400;
        line-height: 26px;
        color: #9494B2;

        text-align: center;
        max-width: 670px;
        margin-bottom: 32px;
      }
      & .ref-stats {
        display: flex;
        // width: 70%;
        // justify-content: space-around;
        width: 80%;
        justify-content: center;
        margin-bottom: 32px;
        gap: 15px;
        flex-wrap: wrap;
        & .ref-stat {
          background: #1D1D30;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          & .amount {
            font-size: 16px;
            font-weight: 500;
            line-height: 26px;
            letter-spacing: 0.002em;
            color: #FFFFFF;
            margin: 0;
            & .icon {
              margin-right: 8px;
              margin-bottom: -3px;

              &.ticket-icon {
                margin-right: 5px;
                margin-bottom: -1px;
                path {
                  fill: #9494B2;
                }
              }
            }
          }
          & .label {
            font-weight: 500;
            font-size: 12px;
            line-height: 22px;
            color: #77779D;
          }
        }
      }
      & .button {
        padding: 16.5px 35.5px;
      }
    }
  }

  .loader {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
  }

  @media (max-width: 767px) {
    & .ref--body {
      & .ref--content {
        padding: 20px;
        & .ref-stats {
          width: 100%;
          & .ref-stat {
            flex: 0 47%;
            &.total-winnings {
              order: 0;
              flex: 0 100%;
              width: 100%;
            }
            &.tournament-count {
              order: 1;
            }
            &.free-tickets {
              order: 2;
            }
          }
        }
        & .button {
          padding: 16px;
          width: 100%;
        }
      }
    }
  }
  @media (max-width: 350px) {
    & .ref--body {
      & .ref--content {
        padding: 10px;
      }
    }
  }
}
</style>
