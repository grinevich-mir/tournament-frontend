<template>
  <div class="referrals-rewards">
    <template v-if="isMobileSmall">
      <div v-for="(reward, index) in rewards.items" :key="index" class="collapser">
        <div class="reward-row" @click="collapser[index] = !collapser[index]" :class="{ active: collapser[index] }">
          <div class="display-name"><UserPic no-border="true"/>{{reward.referral.displayName}}</div>
          <img svg-inline src="@/assets/chevron.svg" alt="Expand">
        </div>
        <div :class="{ expanded: collapser[index] }" class="collapsed">
          <div class="collapsed--container">
            <div class="collapsed--data">
              <span class="label">Date:</span>
              <span class="data">{{$dayjs(reward.createTime).format('YYYY/MM/DD')}}</span>
            </div>
            <div class="collapsed--data">
              <span class="label">Revenue:</span>
              <span  class="data" v-if="reward.type === 'Diamonds'"><img svg-inline class="ticket-icon" src="@/assets/white-ticket-icon.svg" />{{reward.amount}}</span>
              <span  class="data" v-else>{{ formatMoney(reward.commission)}}</span>
            </div>
            <div class="collapsed--data">
              <span class="label">Type:</span>
              <span class="data">{{reward.type}}</span>
            </div>
            <div class="collapsed--data">
              <span class="label">Percent:</span>
              <span class="data">{{reward.rate ? reward.rate : '-'}}</span>
            </div>
            <div class="collapsed--data">
              <span class="label">Level:</span>
              <span class="data">{{reward.level ? reward.level : '-'}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="table" v-else>
      <div class="header">
        <div class="col-header"><div class="display-name"><UserPic no-border="true"/>Username</div></div>
        <div class="col-header">Date</div>
        <div class="col-header">Type</div>
        <div class="col-header">Revenue</div>
        <div class="col-header">Percent</div>
        <div class="col-header">Level</div>
      </div>
      <div class="table-row" v-for="(reward, index) in rewards.items" :key="index">
        <div class="table-col"><div class="display-name"><UserPic no-border="true"/>{{reward.referral.displayName}}</div></div>
        <div class="table-col">{{$dayjs(reward.createTime).format('YYYY/MM/DD')}}</div>
        <div class="table-col">{{reward.type}}</div>
        <div v-if="reward.type === 'Diamonds'" class="table-col"><img svg-inline class="ticket-icon" src="@/assets/white-ticket-icon.svg" />{{reward.amount}}</div>
        <div v-else class="table-col">{{ formatMoney(reward.commission)}}</div>
        <div class="table-col">{{ reward.rate ? reward.rate : '-' }}</div>
        <div class="table-col">{{ reward.level ? reward.level : '-' }}</div>
      </div>
      <div v-if="rewards.totalCount === 0">
        <p class="no-data">You don't have any rewards yet, start referring people now!</p>
      </div>
    </div>
    <Pagination
      v-if="rewards.items.length > 0 && rewards.pageCount > 1"
      :total="rewards.totalCount"
      :current.sync="rewards.page"
      :perPage="pageSize"
      :loading="paginationLoading"
      :range-before="1"
      :range-after="1"
      @change="handlePagination">
    </Pagination>
    <div v-if="rewards.totalCount" class="gradient"></div>
  </div>
</template>

<script>
import UserPic from '@/components/global/UserPic.vue';
import Pagination from '@/components/global/Pagination.vue';

export default {
  name: 'ReferralsRewards',
  components: {
    UserPic,
    Pagination,
  },
  data() {
    return {
      pageSize: 20,
      paginationLoading: false,
      collapser: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
        19: false,
      },
    };
  },
  computed: {
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    rewards() {
      return this.$store.state.referrals.rewards ? this.$store.state.referrals.rewards : {
        items: [],
        page: 1,
        pageSize: this.pageSize,
        totalCount: 0,
        pageCount: 1,
      };
    },
  },
  methods: {
    handlePagination(page) {
      this.paginationLoading = true;
      this.$store.dispatch('loadReferralRewards', { page, pageSize: this.pageSize })
        .then(() => {
          this.collapser = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
            10: false,
            11: false,
            12: false,
            13: false,
            14: false,
            15: false,
            16: false,
            17: false,
            18: false,
            19: false,
          };
        })
        .finally(() => {
          this.paginationLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
  .referrals-rewards {
    background-color: $navy;
    width: 100%;
    border-radius: 8px;
    padding: 20px 30px;
    padding-bottom: 5px;
    position: relative;

    & .collapser {
      background-color: $light-navy;
      border-radius: 4px;
      margin-bottom: 5px;
      z-index: 1;
      &:first-of-type {
        margin-top: 0;
      }
      &:last-of-type {
        margin-bottom: 1rem;
      }
      & .reward-row {
        padding: 14px 18px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        color: #FFFFFF80;
        font-family: Montserrat;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.5px;

        &.active {
          color: #fff;
          & svg {
            transform: rotate(180deg);
            transition: transform 0.15s ease-in-out;
          }
        }
        & .display-name {
          display: flex;
          align-items: center;
          & .user-pic {
            width: 25px;
            height: 25px;
            flex: none;
            margin-right: 10px;
          }
        }
        & svg {
          width: 18px;
          fill: #fff;
          transition: transform 0.15s ease-in-out;
        }
      }
      & .collapsed {
        font-size: 14px;
        color: #A7A7A7;
        line-height: 1.5;
        max-height: 0;
        transition: max-height 0.2s ease-out;
        overflow: hidden;
        background-color: $navy;

        & .collapsed--container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 10px;
          gap: 1rem;

          & .collapsed--data {
            background-color: $light-navy;
            border-radius: 2px;
            padding: 5px 10px;
            margin-bottom: 5px;
            flex: 1;
            @media (min-width: 392px) and (max-width: 500px) {
              flex: 0 47%;
            }
            & .label {
              color: #fff;
              font-size: 14px;
              line-height: 17px;
              letter-spacing: 0.5px;
              margin-right: 10px;
            }
            & .data {
              font-size: 13px;
              font-weight: 400;
              line-height: 20px;
              color: #FFFFFF80;
              & .ticket-icon {
                height: 14px;
                margin-right: 2px;
                margin-bottom: -2px;
                opacity: 0.6;
              }
            }
          }
        }

        &.expanded {
          max-height: 400px;
          transition: max-height 0.3s ease-in;
        }
      }
    }
    & .table {
      margin-bottom: 20px;
      & .header {
        display: flex;
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
        & .col-header {
          flex: 1;
          background-color: $light-navy;
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          padding: 10px;
          & .display-name {
            display: flex;
            align-items: center;
            & .user-pic {
              width: 25px;
              height: 25px;
              margin-right: 10px;
            }
          }
        }
      }

      & > .table-row ~ .table-row {
        border-radius: 0;
      }
      & .no-data {
        text-align: center;
        padding-top: 20px;
      }
      & .table-row {
        background-color: $light-navy;
        display: flex;
        gap: 1rem;
        padding: 10px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        & .table-col {
          flex: 1;
          text-align: center;
          color: #FFFFFF80;
          font-family: Montserrat;
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
          & .display-name {
            display: flex;
            align-items: center;
            & .user-pic {
              width: 25px;
              height: 25px;
              margin-right: 10px;
            }
          }
          & .ticket-icon {
            height: 14px;
            margin-right: 2px;
            margin-bottom: -2px;
            opacity: 0.6;
          }
        }
        &:last-of-type {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }
    & .gradient {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 100%);
      z-index: 1;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30%;
      pointer-events: none;
    }
    @media (max-width: 767px) {
      padding: 0;
      background-color: transparent;
    }
  }
</style>
