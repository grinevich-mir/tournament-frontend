<template>
  <div class="refer-a-friend">
    <div class="content">
      <div class="banner">
        <img svg-inline class="pattern top-left" src="@/assets/referrals/pattern-topleft.svg">
        <img svg-inline class="pattern bottom-right" src="@/assets/referrals/pattern-bottomright.svg">
      </div>
      <img class="ref--info" @click="openModal" src="@/assets/info-icon.svg"/>
      <UserPic :avatar="userAvatar" :border-variant="referralGroup.name.toLowerCase()"/>
      <div v-if="referralGroup" class="ref--group-badge" :class="`ref--group-badge--${referralGroup.name.toLowerCase()}`"></div>
      <p class="display-name">{{userData.displayName}}</p>
      <h2 class="heading">Refer a Friend</h2>
      <p class="subheading">Ask your friends to signup with your<br>referral code and make an initial payment. Once done, both you and your friend each earn 20x tickets. </p>
      <div class="ref-stats">
        <div class="ref-stat revenue">
          <p class="amount">{{revenue}}</p>
          <p class="label">Amount earned</p>
        </div>
        <div class="ref-stat ref-count">
          <p class="amount">{{referralCount}}</p>
          <p class="label">Total Referrals</p>
        </div>
      </div>
      <div class="ref-code">
        <p class="code-label">YOUR REFERRAL CODE</p>
        <div class="code" @click="copyToClipboard(referralCode)" v-tooltip="tooltipOptions">
          <span>{{referralCode}}</span>
          <img svg-inline src="@/assets/copy-icon.svg" alt="Copy">
        </div>
      </div>
      <div class="ref-code">
        <p class="code-label">YOUR REFERRAL LINK</p>
        <div class="code link" @click="copyToClipboard(referralUrl)" v-tooltip="tooltipOptions2">
          <span>{{referralUrl}}</span>
          <img class="copy-btn" svg-inline src="@/assets/copy-icon.svg" alt="Copy">
        </div>
      </div>
      <Button v-if="canShare" class="share-btn" @clicked="share" variant="rounded-blue" text="Share referral link" large></Button>
    </div>
    <Modal
      v-model="showInfo"
      title="How does it work?"
      mode="simple"
      no-buttons
      close-button
    >
      <template v-slot:body>
        <div class="loader" v-if="isLoading">
          <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        </div>
        <div class="ref--modal-content" v-else-if="modalContent" v-html="modalContent"></div>
      </template>
    </Modal>
  </div>
</template>

<script>
import UserPic from '@/components/global/UserPic.vue';
import Button from '@/components/global/Button.vue';
import Modal from '@/components/global/Modal.vue';

import sanity from '@/sanity';
import blocksToHtml from '@/helpers/blocks-to-html';

const query = `*[_type == "referrals" && name == "Info"] {
  _id,
  content,
}[0]
`;

export default {
  name: 'ReferAFriend',
  components: {
    UserPic,
    Button,
    Modal,
  },
  data() {
    return {
      tooltipOptions: {
        content: 'Copied!',
        placement: 'bottom-end',
        trigger: 'click',
        autoHide: false,
        showGroup: 'code',
      },
      tooltipOptions2: {
        content: 'Copied!',
        placement: 'bottom-end',
        trigger: 'click',
        autoHide: false,
        showGroup: 'link',
      },
      showInfo: false,
      isLoading: false,
      modalContent: null,
    };
  },
  computed: {
    canShare() {
      return typeof navigator.share !== 'undefined';
    },
    userData() {
      return this.$store.state.auth.userData;
    },
    userAvatar() {
      return this.userData !== null ? this.userData.avatarUrl : '';
    },
    revenue() {
      return this.formatMoney(this.$store.getters.referralRevenue, 'USD');
    },
    referralCount() {
      return this.$store.getters.referralCount;
    },
    referralCode() {
      return this.$store.getters.referralCode;
    },
    referralUrl() {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      return `${baseUrl}/r/${this.$store.getters.referralSlug}`;
    },
    referralGroup() {
      return this.$store.getters.referralGroup;
    },
  },
  methods: {
    copyToClipboard(data) {
      navigator.clipboard.writeText(data);
    },
    share() {
      if (navigator.share) {
        navigator.share({
          title: 'Join me on Tournament!',
          text: 'Join me on Tournament.com and win life changing experiences and cash prizes! ',
          url: this.referralUrl,
        }).then(() => {
          console.log('Thanks for sharing!');
        }).catch((err) => {
          console.log(`Couldn't share because of`, err.message);
        });
      } else {
        console.log('web share not supported');
      }
    },
    openModal() {
      this.showInfo = true;
      if (!this.modalContent) this.fetchData();
    },
    fetchData() {
      this.modalContent = null;
      this.isLoading = true;

      sanity.fetch(query).then(
        (info) => {
          if (info) {
            this.modalContent = blocksToHtml(info.content);
          } else {
            this.$noty.error('Something went wrong :( please try again later');
            this.showInfo = false;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('SANITY ERR:', error);
          this.$noty.error('Something went wrong :( please try again later');
          this.isLoading = false;
          this.showInfo = false;
        },
      );
    },
  },
};
</script>

<style lang="scss" scoped>
  .refer-a-friend {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: $navy;
    width: 100%;
    // height: 100%;
    border-radius: 8px;
    padding: 40px;
    position: relative;
    & .content {
      max-width: 471px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & .banner {
        position: absolute;
        width: 100%;
        height: 140px;
        left: 0px;
        right: 0px;
        top: 0px;
        background: $light-navy;
        z-index: 0;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        & .pattern {
          &.bottom-right {
            bottom: 0;
            right: 0;
            position: absolute;
          }
        }
      }
      & .ref--info {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1;
        text-decoration: underline;
        opacity: 0.7;
        font-size: 12px;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }
      & .user-pic {
        width: 150px;
        height: 150px;
        z-index: 1;
      }
      & .ref--group-badge {
        position: absolute;
        top: 155px;
        left: 54%;
        z-index: 1;
        width: 36px;
        height: 36px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        &--bronze {
          background-image: url('~@/assets/referrals/badge-bronze.svg');
        }
        &--silver {
          background-image: url('~@/assets/referrals/badge-silver.svg');
        }
        &--gold {
          background-image: url('~@/assets/referrals/badge-gold.svg');
        }
        @media (max-width: 767px) {
          top: 65px;
          left: 53%;
          width: 24px;
          height: 24px;
        }
      }
      & .display-name {
        font-size: 20px;
        font-weight: 700;
        line-height: 24px;
        margin-top: 12px;
        margin-bottom: 14px;
      }
      & .heading {
        font-size: 25px;
        font-weight: 600;
        line-height: 40px;
        margin: 0;
      }
      & .subheading {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        color: #9494B3;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 40px;
      }
      & .ref-stats {
        display: flex;
        width: 100%;
        margin-bottom: 40px;
        & .ref-stat {
          background: #232338;
          border-radius: 8px;
          width: 100%;
          padding: 8px 10px;
          &.revenue {
            margin-right: 10px;
          }
          &.ref-count {
            margin-left: 10px;
          }
          & .amount {
            font-weight: bold;
            font-size: 16px;
            line-height: 24px;
            color: #FFFFFF;
            margin: 0;
          }
          & .label {
            font-weight: 500;
            font-size: 12px;
            line-height: 22px;
            color: #7C7C7C;
          }
        }
      }
      & .ref-code {
        margin-bottom: 20px;
        width: 100%;
        & .code-label {
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
          text-align: center;
        }
        & .code {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 8px;
          padding: 10px 20px;
          padding-right: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          & span {
            font-size: 14px;
            font-weight: 600;
            line-height: 24px;
            letter-spacing: 2px;
          }
          &.link span {
            letter-spacing: 0;
            font-weight: 500;
          }
        }
      }
      & .share-btn {
        margin-top: 30px;
        margin-bottom: 40px;
      }
    }
    & .ref--modal-content {
      color: #8E8E98;
    }
    @media (max-width: 767px) {
      padding: 12px 23px;
      & .content {
        width: 100%;
        & .user-pic {
          width: 70px;
          height: 70px;
        }
        & .display-name {
          z-index: 2;
          margin-top: 20px;
        }
        & .heading {
          margin-top: 20px;
        }
        & .subheading {
          font-size: 14px;
          padding: 0 20px;
          margin-bottom: 20px;
        }
        & .ref-stats {
          padding: 0 20px;
          justify-content: center;
          margin-bottom: 30px;
          & .ref-stat {
            &.revenue {
              margin-right: 5px;
            }
            &.ref-count {
              margin-left: 5px;
            }
          }
        }
        & .code-label {
          margin-bottom: 10px;
        }
        & .code {
          span {
            text-overflow: ellipsis;
            max-width: 90%;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .tooltip {
    &[x-placement^="bottom-end"] {
      margin-top: 8px;

      .tooltip-inner {
        background: $blue;
        color: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0px;
      }

      .tooltip-arrow {
        border-color: $blue;
        right: 0;
        left: unset !important;
      }
    }
  }
</style>
