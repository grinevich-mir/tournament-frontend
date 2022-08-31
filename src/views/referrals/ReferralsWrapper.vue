<template>
  <div class="referrals">
    <div class="loader" v-if="isLoading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <template v-else>
      <div class="tabs">
        <div class="tab raf" @click="goToRoute('ReferAFriend')" :class="{ active: $route.name === 'ReferAFriend' }">REFER A FRIEND</div>
        <div class="tab raf-xs" @click="goToRoute('ReferAFriend')" :class="{ active: $route.name === 'ReferAFriend' }">REFER</div>
        <div class="tab" @click="goToRoute('ReferralsList')" :class="{ active: $route.name === 'ReferralsList' }">REFERRALS</div>
        <div class="tab" @click="goToRoute('ReferralsRewards')" :class="{ active: $route.name === 'ReferralsRewards' }">REWARDS</div>
        <span class="tab-slider" :class="`tab-selected--${$route.name.toLowerCase()}`"></span>
      </div>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ReferralsWrapper',
  data() {
    return {
      isLoading: true,
    };
  },
  created() {
    Promise.all([
      this.$store.dispatch('loadReferralUser'),
      this.$store.dispatch('loadReferrals'),
      this.$store.dispatch('loadReferralRewards'),
      this.$store.dispatch('loadReferralCommissionRates'),
    ]).finally(() => {
      this.isLoading = false;
    });
  },
  methods: {
    goToRoute(routeName) {
      if (this.$route.name === routeName) return;
      this.$router.push({ name: routeName });
    },
  },
};
</script>

<style scoped lang="scss">
  .referrals {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #fff;

    & .loader {
      height: 100vh;
      display: flex;
      align-items: center;
    }
    & .tabs {
      display: flex;
      justify-content: space-around;
      width: 100%;
      background-color: $navy;
      border-radius: 8px;
      padding: 10px 1rem;
      margin-bottom: 20px;
      gap: 5px;
      position: relative;
      & .tab {
        flex: 1;
        padding: 16px;
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        line-height: 13px;
        letter-spacing: 0.5px;
        color: #7474AD;
        cursor: pointer;
        max-width: 285px;
        z-index: 1;
        transition: 0.25s ease-out;
        &:hover,
        &.active {
          color: #fff;
          font-weight: 600;
        }
        &.raf-xs {
          display: none;
        }
      }
      & .tab-slider {
        position: absolute;
        z-index: 0;
        background-color: $light-navy;
        box-shadow: 0px 4px 22px -7px #101018;
        border-radius: 8px;
        transition: all 0.25s ease-out;
        top: 10px;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        height: 45px;
        width: 30%;
        &.tab-selected--referafriend {
          left: 16%;
        }
        &.tab-selected--referralsrewards {
          left: 84%;
        }
      }
      @media (max-width: 392px) {
        & .tab {
          padding: 10px !important;
          border-radius: 8px;
          &:hover, &.active {
            background-color: $light-navy;
            box-shadow: 0px 4px 22px -7px #101018;
          }
          &.raf {
            display: none;
          }
          &.raf-xs {
            display: block;
          }
        }
        & .tab-slider {
          display: none;
        }
      }
    }

    @media (max-width: 767px) {
      .tabs {
        gap: 5px;
        padding: 7px 14px;
        & .tab {
          font-size: 14px;
          line-height: 21px;
          padding: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
        }
        & .tab-slider {
          top: 10px;
          bottom: 10px;
          height: 35px;
          left: 55.6%;
          width: 112px;
          &.tab-selected--referafriend {
            left: 21.5%;
            width: 152px;
          }
          &.tab-selected--referralsrewards {
            left: 83.7%;
            width: 97px;
          }
        }
      }
    }
  }
</style>
