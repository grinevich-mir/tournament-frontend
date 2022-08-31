<template>
  <div class="notifications-wrapper">
    <div class="notifications__tabs">
      <div class="notifications__tab" @click="currentView = 'notifications'" :class="{ active: currentView === 'notifications' }">Notifications</div>
      <div class="notifications__tab" @click="currentView = 'gifts'" :class="{ active: currentView === 'gifts' }">My gifts</div>
    </div>
    <div class="notifications__content">
      <Notifications v-if="currentView === 'notifications'"/>
      <MyGifts v-if="currentView === 'gifts'" />
    </div>
  </div>
</template>

<script>
import Notifications from './Notifications.vue';
import MyGifts from './MyGifts.vue';

export default {
  name: 'NotificationsWrapper',
  components: {
    Notifications,
    MyGifts,
  },
  data() {
    return {
      currentView: 'notifications',
    };
  },
};
</script>

<style scoped lang="scss">
  .notifications-wrapper {
    padding-top: .5rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    & .notifications__tabs {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 400px;

      & .notifications__tab {
        width: 50%;
        text-align: center;
        color: #fff;
        // padding: 10px;
        border: 2px solid $blue;
        padding: 8px;
        font-size: 14px;
        cursor: pointer;

        &:first-of-type {
          border-bottom-left-radius: 4px;
          border-top-left-radius: 4px;
        }
        &:last-of-type {
          border-bottom-right-radius: 4px;
          border-top-right-radius: 4px;
        }

        &:hover {
          background-color: rgba(13, 126, 232, 0.2);
        }

        &.active {
          background-color: $blue;
          font-weight: 600;
        }
      }
    }

    & .notifications__content {
      width: 100%;
    }
  }
</style>
