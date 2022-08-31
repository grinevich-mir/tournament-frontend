<template>
  <div class="profile__main-body">
    <div class="payment-history-c">
      <h2>Purchase History</h2>
      <div v-if="isLoading" key="loading">
        <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
      <div v-else-if="orders.items.length > 0" class="payment-history" key="history">
        <RowPanel
          v-for="order in orders.items.filter((o) => o.status !== 'Expired')"
          :key="`payment-h-${order.id}`"
          class="payment-history-item"
          :badge-text="order.status"
          :badge-variant="getBadgeVariant(order.status)"
        >
          <template v-slot:title>
            <img v-if="order.description.toLowerCase().includes('diamonds')" svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">
            <span class="payment-amount">
              {{order.description}} - {{ formatMoney(order.priceTotal, order.currencyCode) }}
            </span>
          </template>
          <template v-slot:details>
            <div class="payment-date">
              <span>Date:</span> {{ $dayjs(order.createTime).format('MMM Do YYYY, h:mm:ss a') }}
            </div>
            <div class="payment-date">
              <span>Payment Method:</span> {{ getCardType(order) }} &bull;&bull;&bull;&bull; {{ getLastFour(order) }} | {{ getExpiryMonth(order) }}/{{ getExpiryYear(order) }}
            </div>
          </template>
        </RowPanel>
      </div>
      <p v-else class="id-help" key="nohistory">Nothing found.</p>
    </div>
    <Pagination
      v-if="orders.items.length > 0 && orders.pageCount > 1"
      :total="orders.totalCount"
      :current.sync="orders.page"
      perPage="20"
      :loading="isLoading"
      :range-before="1"
      :range-after="1"
      @change="getAllPayments">
    </Pagination>
  </div>
</template>

<script>
import RowPanel from '@/components/global/RowPanel.vue';
import Pagination from '@/components/global/Pagination.vue';

export default {
  name: 'PaymentHistory',
  components: {
    RowPanel,
    Pagination,
  },
  data() {
    return {
      isLoading: true,
      orders: {
        items: [],
      },
    };
  },
  created() {
    this.getAllPayments()
      .catch((ex) => {
        console.error('inner', ex.message);
        throw ex;
      }).finally(() => {
        this.isLoading = false;
      });
  },
  methods: {
    getAllPayments(page) {
      console.log(page);
      this.isLoading = true;
      return this.$api.get(`/order`, { params: { page } })
        .then((response) => response.data)
        .then((orders) => {
          this.orders = orders;
          this.isLoading = false;
        });
    },
    getBadgeVariant(status) {
      if (status === 'Successful' || status === 'Complete') {
        return 'emerald';
      }
      if (status === 'Cancelled') {
        return 'red';
      }
      return 'bingo';
    },
    getCardType(order) {
      if (!order.payments.length) return null;
      return order.payments[0].paymentMethod.cardType;
    },
    getLastFour(order) {
      if (!order.payments.length) return null;
      return order.payments[0].paymentMethod.lastFour;
    },
    getExpiryMonth(order) {
      if (!order.payments.length) return null;
      return order.payments[0].paymentMethod.expiryMonth;
    },
    getExpiryYear(order) {
      if (!order.payments.length) return null;
      return order.payments[0].paymentMethod.expiryYear;
    },
  },
};
</script>

<style scoped lang="scss">
.form--loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 2rem);
  height: calc(100% + 2rem);
  background-color: rgba(16, 16, 24, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.t-form:not(.is-loading) {
  &+.form--loading-overlay {
    display: none;
  }
}
.t-form:not(.is-loading) {
  &+.form--loading-overlay {
    display: none;
  }
}
.profile__main-body {
  height: 100%;
  padding: 2rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  color: #fff;
}
.profile__footer {
  margin-top: auto;
}
.ldr {
  background-color: $light-navy;
  &::after {
    animation-name: loader500;
    background: linear-gradient(to right, rgba(29,29,48,1) 8%,rgba(35,35,56,1) 18%,rgba(29,29,48,1) 33%);
  }
}
.id-help {
  font-size: 14px;
  color: #7474AD;
  line-height: 1.5;
}
.payment {
  text-align: center;
}
.payment-history {
  margin-bottom: 1rem;
}
.payment-history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $navy;
  padding: .75rem 1rem;
  text-align: left;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
.payment-amount {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: .5rem;
}
.payment-date {
  font-size: 12px;
  font-weight: 500;
  color: $kimberly;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}
.payment-history-c {
  text-align: center;
  h2 {
    margin-bottom: 1rem;
  }
  .id-help {
    margin-top: 1rem;
  }
}
.payment-history-right .badge:not(:last-child) {
  margin-right: .5rem;
}
.amount-available {
  margin: 1rem 0 1rem;
  font-weight: 700;
  background: $orange-gradient;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.clickable {
  cursor: pointer;
  transition: 0.15s transform ease-in-out;
}
.clickable:hover {
  transform: scale(1.1);
}
.minimum-text {
  margin-top: 1rem;
}
.game__loading-dots {
  margin: 2rem 0;
}

.acc-inputs {
  margin: 1rem auto;
  width: 500px;
  max-width: 100%;
}
.acc-input-wrap__inner {
  position: relative;
}
.acc-input {
  font-size: 12px;
  font-weight: 500;
  padding: 1rem;
  width: 100%;
  background-color: $light-navy;
  color: $kimberly;
  border-radius: 0 !important;
  &:not([readonly]) {
    color: #fff;
  }
  &[disabled] {
    opacity: 1 !important;
    -webkit-text-fill-color: $kimberly;
  }
}
.acc-input-wrap {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
ul.errors {
  color: $red;
  font-size: 12px;
  padding-left: 2rem;
  margin-bottom: 2rem;
  text-align: left;
}
.error {
  .acc-input {
    outline: 1px solid $red;
  }
}

.ticket-icon path {
  fill: #7CFF84;
}

@media (max-width: 1279px) {
  .payment-history-c {
    margin-top: 1rem;
  }
}
@media (max-width: 767px) {
  .badge {
    font-size: 12px;
  }
  .payment-date span {
    display: block;
    margin-bottom: 3px;
  }
}
</style>
