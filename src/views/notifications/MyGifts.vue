<template>
  <div>
    <div v-if="isLoading" class="body-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="profile__main-body" :class="{'is-loading': isLoading}">
      <div class="gifts-c">
        <h2>My gifts</h2>
        <div v-if="inventory && inventory.items.length > 0" class="gifts">
          <div v-for="gift in inventory.items" class="gift" :class="{ 'mute' : giftExpired(gift) || gift.claimed, 'hide' : userLevel >= gift.level && !(giftExpired(gift) || gift.claimed) }" :key="`gift-h-${gift.id}`">
            <div class="gift-left">
              <div class="gift-label" v-if="gift.type === 'Diamonds'">
                <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">
                <span class="payment-amount">
                  {{ gift.amount }}
                </span>
              </div>
              <div class="gift-label" v-else>
                {{ gift.validDays * 24 }}H Membership
              </div>
              <div v-if="gift.claimed" class="gift-desc">
                Claimed <span v-if="(typeof gift.claimedTime !== 'undefined')">{{ $dayjs(gift.claimedTime).fromNow() }}</span>
              </div>
              <div v-else-if="(typeof gift.expires !== 'undefined')" class="gift-desc">
                <span v-text="giftExpired(gift) ? 'Expired' : 'Expires'"></span> {{ $dayjs(gift.expires).fromNow() }}
              </div>
            </div>
            <div class="gift-right">
              <Button v-if="gift.claimed" text="Claimed" variant="orange" :disabled="true"/>
              <Button v-else-if="giftExpired(gift)" text="Expired" variant="rounded-blue" :disabled="true"/>
              <Button v-else text="Claim" variant="orange" @clicked="claimGift(gift)"/>
            </div>
          </div>
        </div>
        <p v-else class="id-help" key="nohistory">Nothing found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';
// import Badge from '@/components/global/Badge.vue';

export default {
  name: 'MyGifts',
  components: {
    Button,
    // Badge,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    inventory() {
      return this.$store.state.inventory.inventory;
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
  },
  watch: {
    //
  },
  async created() {
    this.isLoading = true;
    try {
      await this.$store.dispatch('loadInventory');
    } catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    } finally {
      this.isLoading = false;
    }
  },
  mounted() {
    //
  },
  beforeDestroy() {
    //
  },
  methods: {
    giftExpired(gift) {
      if (typeof gift.expires !== 'undefined' && this.$dayjs(gift.expires).isBefore()) {
        return true;
      }
      return false;
    },
    claimGift(gift = null) {
      if (!gift) {
        return;
      }
      this.isLoading = true;
      this.$api.post(`/inventory/${gift.id}/claim`)
        .then(async () => {
          this.$noty.success('Success!');
          try {
            await this.$store.dispatch('loadUserData');
            await this.$store.dispatch('loadInventory');
            // if (gift.type === 'Diamonds') {
            //  this.$store.dispatch('loadWallet');
            // }
          } catch (ex) {
            console.error('inner', ex.message);
            throw ex;
          } finally {
            this.isLoading = false;
          }
        })
        .catch((err) => {
          console.log(err.message || err);
          this.isLoading = false;
        });
      console.log('claim', gift.id);
    },
  },
};
</script>

<style scoped lang="scss">
// .gifts-c {
//   width: 500px;
//   max-width: 100%;
//   margin: 2rem auto 0 auto;
//   text-align: center;
//   position: relative;
// }

.gifts {
  margin-bottom: 1rem;
}
.gift {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $navy;
  padding: .75rem 1rem;
  text-align: left;
  border-radius: 8px;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
.gift-label {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: .5rem;
  &:last-child {
    margin-bottom: 0;
  }
}
.gift-desc {
  font-size: 12px;
  font-weight: 500;
  color: $kimberly;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}
.gifts-c {
  text-align: center;
  h2 {
    margin-bottom: 1rem;
  }
}
.gift-history-right .badge:not(:last-child) {
  margin-right: .5rem;
}
.gift.hide {
  display: none;
}

.id-help {
  font-size: 14px;
  margin-top: 1rem;
  color: #7474AD;
  line-height: 1.5;
}

.ticket-icon {
  width: 20px;
  height: 20px;
  margin-bottom: -2px;
  path {
    fill: #7CFF84;
  }
}

</style>
