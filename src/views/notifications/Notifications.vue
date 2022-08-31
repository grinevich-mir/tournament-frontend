<template>
  <div class="notification-history-c">
    <h2>Notifications</h2>
    <div v-if="$store.getters.unreadNotificationCount" class="mark-as-read">
      <Button @clicked="$store.dispatch('markAllAsRead')" text="Mark all as read" variant="rounded-blue"/>
    </div>
    <div v-if="isLoading" key="loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div v-else-if="notifications.items.length > 0" class="notification-history" key="history">
      <RowPanel
        v-for="notification in notifications.items"
        :key="`notification-h-${notification.id}`"
        class="notification-history-item"
        :title="'It\'s a WIN 🏆'"
        :class="{ 'read': notification.read }"
      >
        <template v-slot:details>
          <div class="notification-date">
            {{ $dayjs(notification.createTime).format('MMM Do YYYY, h:mm:ss a') }} - {{ notification.data.tournamentName }}
          </div>
        </template>
        <template v-slot:badge >
          <div class="row-panel__right">
            <Badge v-if="isDiamondPrize(notification.data)" variant="emerald">
              <template v-slot:text>
                <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">
                {{getAmount(notification.data)}}
              </template>
            </Badge>
            <Badge v-else :text="getBadgeText(notification.data)" variant="emerald"/>
          </div>
        </template>
      </RowPanel>
    </div>
    <p v-else class="id-help" key="nohistory">Nothing found.</p>
  </div>
</template>

<script>
import Badge from '@/components/global/Badge.vue';
import Button from '@/components/global/Button.vue';
import RowPanel from '@/components/global/RowPanel.vue';

export default {
  name: 'Notifications',
  components: {
    Badge,
    Button,
    RowPanel,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    notifications() {
      return this.$store.state.notifications.notifications;
    },
  },
  watch: {
    //
  },
  async created() {
    this.isLoading = true;
    try {
      await this.getAllNotifications();
    } catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    getAllNotifications() {
      this.isLoading = true;
      return this.$store.dispatch('loadNotifications')
        .finally(() => { this.isLoading = false; });
    },
    getBadgeText(notification) {
      if (!notification.prizeTotal && notification.prizes.length) {
        return notification.prizes[0].name;
      }
      if (notification.prizeTotal && notification.prizeTotal.amount) {
        return this.formatMoney(notification.prizeTotal.amount, notification.prizeTotal.currencyCode);
      }
      if (notification.amount) {
        return this.formatMoney(notification.amount, notification.currencyCode || 'USD');
      }
      return 0;
    },
    isDiamondPrize(notification) {
      if (notification.prizeTotal && notification.prizeTotal.currencyCode) return notification.prizeTotal.currencyCode === 'DIA';
      if (notification.currencyCode) return notification.currencyCode === 'DIA';
      return false;
    },
    getAmount(notification) {
      if (notification.prizeTotal && notification.prizeTotal.amount) return notification.prizeTotal.amount;
      if (notification.amount) return notification.amount;
      return null;
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
.notification-history-c {
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
.notification {
  text-align: center;
}
.notification-history {
  margin-bottom: 1rem;
}
.notification-history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $navy;
  padding: .75rem 1rem;
  text-align: left;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &.read {
    opacity: 0.5;
    // &:hover {
    //   opacity: 1;
    // }
  }
  & .ticket-icon {
    margin-left: -2px;
    margin-bottom: -2px;
    // path {
    //   fill: #7CFF84;
    // }
  }
}
.notification-amount {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: .5rem;
}
.notification-date {
  font-size: 12px;
  font-weight: 500;
  color: $kimberly;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}
.notification-history-c {
  // margin-top: 3rem;
  text-align: center;
  h2 {
    margin-bottom: 1rem;
  }
  .id-help {
    margin-top: 0rem;
  }
}
.notification-history-right .badge:not(:last-child) {
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

.mark-as-read {
  text-align: left;
  margin-bottom: 1rem;
}

// @media (max-width: 1279px) {
//   .notification-history-c {
//     margin-top: 1rem;
//   }
// }
@media (max-width: 767px) {
  .badge {
    font-size: 12px;
  }
  .notification-date span {
    display: block;
    margin-bottom: 3px;
  }
}
</style>
