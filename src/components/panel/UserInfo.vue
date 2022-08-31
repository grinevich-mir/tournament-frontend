<template>
  <div class="user-info">
    <div class="user-info__pic">
      <UserPic @tap-user-pic="showAvatarModal" :userLevel="userLevel" :avatar="avatar"/>
      <div v-if="showControls && userLevel > 1" class="dots-edit" @click="showAvatarModal">
        <div>.</div><div>.</div><div>.</div>
      </div>
    </div>
    <div @click="$emit('tap-name')" class="user-info__name">
      <div v-if="fromUserControls === undefined || (fromUserControls === true && isMobile === true)" @click="goToProfile">{{ displayName }}</div>
      <div class="shortened-name" v-else>
        <div class="shortened-name__tooltip" @click="goToProfile">
          {{ displayName }}
        </div>
        {{ $options.filters.shorten(displayName) }}
      </div>
      <div v-if="!displayName" class="ldr" style="width: 85px; height: 23px"></div>
    </div>
    <div v-if="balance !== false" class="user-info__cash">
      {{ balance }}
    </div>
    <div v-if="balance !== false" class="user-info__cash diamonds" @click="openStore">
      <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">{{ diamonds }}
    </div>
    <div v-if="balance === false" class="ldr" style="width: 85px; height: 23px"></div>
    <transition name="fade">
      <div v-if="showControls && showAvailableAvatarsModal" class="modal modal--avatars">
        <div class="modal-title">
          <h2>Select an avatar</h2>
          <img svg-inline class="close-modal" src="@/assets/close.svg" alt="close modal" @click="showAvailableAvatarsModal = false" />
        </div>
        <div class="modal-body">
          <div v-if="this.availableAvatars.length > 0" class="avatars-available">
            <button v-for="avatar in availableAvatars" class="avatar-button" :class="{ selected: selectedAvatarID === avatar.id }" @click="selectedAvatarID = avatar.id" :key="avatar.id"><img :src="avatar.url"></button>
          </div>
          <div v-else class="avatars-available-null">
            Nothing found :(
          </div>
        </div>
        <div class="modal-footer">
          <button class="save-avatar" :disabled="!selectedAvatarID" @click="saveAvatar">Save</button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showControls && showAvatarUploadModal" class="modal modal--avatars modal--avatars-upload">
        <div class="modal-title">
          <h2>Upload an avatar</h2>
          <img svg-inline class="close-modal" src="@/assets/close.svg" alt="close modal" @click="showAvatarUploadModal = false" />
        </div>
        <div class="modal-body">
          <div class="upload-avatar">
            <Button v-if="!selectedLocalFile" id="pick-avatar" text="Select an image" variant="rounded-blue" />
            <avatar-cropper
              @changed="handleChanged"
              @uploading="handleUploading"
              @uploaded="handleUploaded"
              @submit="handleSubmit"
              :upload-headers="uploadHeaders"
              :output-options="{width: 320, height: 320}"
              :output-quality="outputQuality"
              :withCredentials="false"
              output-mime="image/jpeg"
              upload-form-name="avatar"
              trigger="#pick-avatar"
              :upload-url="uploadEnpoint"
              :labels="{ submit: 'submit', cancel: 'cancel'}" />
            <div v-if="showLoader" class="avatar__loading">
              <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import UserPic from '@/components/global/UserPic.vue';
import AvatarCropper from 'vue-avatar-cropper';
import Button from '@/components/global/Button.vue';

export default {
  name: 'UserInfo',
  components: {
    UserPic,
    AvatarCropper,
    Button,
  },
  props: ['avatar', 'displayName', 'balance', 'showControls', 'fromUserControls', 'isMobile', 'diamonds'],
  data() {
    return {
      avatarsUploadOnlyMode: true,
      availableAvatars: [],
      showAvailableAvatarsModal: false,
      selectedAvatarID: false,
      showAvatarUploadModal: false,
      selectedLocalFile: false,
      outputQuality: 0.6,
      showLoader: true,
    };
  },
  computed: {
    uploadEnpoint() {
      return `${process.env.VUE_APP_API_HOST}/user/avatar`;
    },
    uploadHeaders() {
      return {
        authorization: `Bearer ${this.$store.getters.token}`,
      };
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
  },
  methods: {
    openStore() {
      EventBus.$emit('showTicketStore', true, null);
    },
    goToProfile() {
      if (this.$route.name === 'Profile') return;
      this.$router.push({ name: 'Profile' });
    },
    showAvatarModal() {
      if (this.userLevel < 1) return;
      if (this.avatarsUploadOnlyMode) {
        this.showAvatarUpload();
      } else {
        this.showAvailableAvatars();
      }
    },
    showAvailableAvatars() {
      if (this.availableAvatars.length > 0) {
        this.showAvailableAvatarsModal = true;
        return;
      }
      this.$api
        .get(`/user/avatar/available`)
        .then((response) => response.data)
        .then((availableAvatarsData) => {
          this.availableAvatars = availableAvatarsData;
          this.showAvailableAvatarsModal = true;
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          console.log('finally showAvailableAvatars()');
        });
    },
    saveAvatar() {
      if (this.selectedAvatarID >= 0) {
        this.$api
          .put('/user/avatar', {
            id: this.selectedAvatarID,
          })
          .then(() => {
            this.showAvailableAvatarsModal = false;
            this.selectedAvatarID = false;
            this.$store.dispatch('loadUserData');
          })
          .catch((err) => {
            console.log(err.message || err);
          })
          .finally(() => {
            console.log('finally saveAvatar()');
          });
      }
    },
    showAvatarUpload() {
      this.showLoader = false;
      this.selectedLocalFile = false;
      this.showAvatarUploadModal = true;
    },
    handleSubmit() {
      this.showLoader = true;
    },
    handleUploading() {
      //
    },
    handleUploaded() {
      this.showAvatarUploadModal = false;
      this.$store.dispatch('loadUserData');
    },
    handleChanged() {
      this.selectedLocalFile = true;
    },
    handleCompleted() {
      this.showLoader = false;
    },
  },
};
</script>

<style scoped lang="scss">
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .user-info__name {
    margin: .75rem 0 .5rem;
    font-size: 20px;
    color: #fff;
    font-weight: 700;
    text-align: center;
  }
  .user-info__cash {
    background-color: $navy;
    font-size: 15px;
    font-weight: 700;
    color: $kimberly;
    padding: .25rem 1.5rem;
    border-radius: 3px;

    &.diamonds {
      cursor: pointer;
      margin-top: 10px;
      color: #7CFF84;

      & .ticket-icon {
        margin-right: 4px;
        height: auto;
        margin-bottom: -2px;
        & path {
          fill: #7CFF84;
        }
      }
    }

  }
  // each loader has unique dimensions [inline] and color; the animation itself is on global.scss
  .ldr {
    background-color: $navy;
    &::after {
      animation-name: loader85;
      background: linear-gradient(to right, rgba(29,29,48,1) 8%,rgba(35,35,56,1) 18%,rgba(29,29,48,1) 33%);
    }
  }
  .user-info__pic {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dots-edit {
    width: 2rem;
    text-align: center;
    line-height: 0.6;
    font-weight: 900;
    padding-bottom: .5rem;
    cursor: pointer;
    margin-left: 4px;
    margin-right: calc(-2rem - 4px);
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  .modal--avatars {
    position: absolute;
    top: -1rem;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
    background-color: $navy;
    padding: 2rem;
    z-index: 999;
    h2 {
      margin: 0;
    }
  }
  .modal-title {
    position: relative;
  }
  .close-modal {
    position: absolute;
    width: 15px;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    fill: #fff;
    display: block;
    cursor: pointer;
  }
  .avatars-available {
    display: flex;
    flex-wrap: wrap;
  }
  .avatar-button {
    width: 12.5%;
    padding: .25rem;
    cursor: pointer;
    border-radius: 50%;
    &:focus {
      outline: none !important;
      img {
        box-shadow: 0px 0px 0px 3px $blue;
      }
    }
    img {
      display: block;
      border-radius: 50%;
      border: 5px solid transparent;
    }
  }
  .modal-body {
    margin: 1rem 0;
  }
  .shortened-name__tooltip {
    position: absolute;
    left: 0;
    top: -0.35rem;
    background-color: $light-navy;
    padding: .35rem 1rem .35rem 0;
    border-radius: 2px;
    visibility: collapse;
    opacity: 0;
    max-width: 0;
    transition: 0.2s ease-in-out all;
  }
  .shortened-name {
    cursor: pointer;
    position: relative;
    &:hover .shortened-name__tooltip {
      visibility: visible;
      opacity: 1;
      max-width: 1000px;
    }
  }
  .save-avatar {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    &:not([disabled]) {
      cursor: pointer;
    }
    &[disabled] {
      opacity: .5;
    }
  }
  .modal-footer {
    text-align: right;
  }
  // upload !!
  /deep/ .avatar-cropper .avatar-cropper-mark {
    display: none;
  }
  /deep/ .avatar-cropper .avatar-cropper-overlay {
    position: relative;
  }
  .modal.modal--avatars.modal--avatars-upload {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    .modal-body {
      text-align: center;
      margin-top: auto !important;
      margin-bottom: auto !important;
    }
  }
  .upload-avatar .button {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  @media (max-width: 1599px) {
    .user-info__name,
    .user-info__cash {
      font-size: 14px;
    }
  }
  @media (max-width: 767px) {
    .user-info__name {
      font-size: 16px;
    }
    .modal--avatars {
      padding: 1rem;
      h2 {
        font-size: 16px;
      }
    }
    .avatar-button {
      width: 25%;
    }
  }
</style>
