<template>
  <div class="referrals-list">
    <div class="total-revenue">
      <span class="label">Total Revenue:</span>
      <span class="amount">{{formatMoney(revenue)}}</span>
    </div>
    <div class="table">
      <div class="header">
        <div class="col-header">Date</div>
        <div class="col-header">Referee</div>
        <div class="col-header">Revenue</div>
      </div>
      <div class="table-row" v-for="(referral, index) in referrals.items" :key="index">
        <div class="table-col">{{$dayjs(referral.createTime).format('YYYY/MM/DD')}}</div>
        <div class="table-col">{{referral.displayName}}</div>
        <div class="table-col rev">{{formatMoney(referral.revenue)}}</div>
      </div>
      <div v-if="referrals.totalCount === 0">
        <p class="no-data">You don't have any referrals yet, start referring people now!</p>
      </div>
    </div>
    <Pagination
      v-if="referrals.items.length > 0 && referrals.pageCount > 1"
      :total="referrals.totalCount"
      :current.sync="referrals.page"
      :perPage="pageSize"
      :loading="paginationLoading"
      :range-before="1"
      :range-after="1"
      @change="handlePagination">
    </Pagination>
    <div v-if="referrals.totalCount" class="gradient"></div>
  </div>
</template>

<script>
import Pagination from '@/components/global/Pagination.vue';

export default {
  name: 'ReferralsList',
  components: {
    Pagination,
  },
  data() {
    return {
      pageSize: 20,
      paginationLoading: false,
    };
  },
  computed: {
    revenue() {
      return this.$store.getters.referralRevenue;
    },
    referrals() {
      return this.$store.state.referrals.referrals ? this.$store.state.referrals.referrals : {
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
      this.$store.dispatch('loadReferrals', { page, pageSize: this.pageSize }).finally(() => {
        this.paginationLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .referrals-list {
    background-color: $navy;
    width: 100%;
    border-radius: 8px;
    padding: 20px 30px;
    padding-bottom: 5px;
    position: relative;
    & .total-revenue {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 11px 35px;
      padding-right: 4rem;
      background-color: $light-navy;
      border-radius: 8px;
      margin-bottom: 30px;

      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }
    & .table {
      margin-bottom: 20px;
      & .header {
        display: flex;
        // gap: 1rem;
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
        & .table-col {
          flex: 1;
          text-align: center;
          color: #FFFFFF80;
          font-family: Montserrat;
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
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
      padding: 12px;
      & .total-revenue {
        padding: 10px !important;
      }
    }
    @media (max-width: 350px) {
      padding: 0;
      background-color: transparent;
      & .table {
        .table-row {
          & .table-col.rev {
            text-align: right;
          }
        }
      }
    }
  }
</style>
