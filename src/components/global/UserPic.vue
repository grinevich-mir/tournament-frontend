<template>
  <div class="user-pic" @click="$emit('tap-user-pic')" :class="[{ 'no-border': noBorder }, borderVariant ? `border--${borderVariant}` : '']">
    <!-- <img v-if="avatar && userLevel > 1" class="user-pic__thumbnail" :src="avatar" alt="tournament user"> -->
    <img v-if="avatar" class="user-pic__thumbnail" :src="avatar" alt="tournament user">
    <img v-else-if="lpUserIndex" class="user-pic__thumbnail" :src="require(`@/assets/faces/${lpUserIndex}_200.jpg`)" alt="tournament user">
    <img v-else class="user-pic__thumbnail" src="@/assets/logo-round.png" alt="tournament user">
  </div>
</template>

<script>
export default {
  name: 'UserPic',
  components: {
  },
  props: ['avatar', 'lpUserIndex', 'userLevel', 'borderVariant', 'noBorder'],
};
</script>

<style scoped lang="scss">
  .user-pic {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0px 0px 0px 3px $gradient-light-blue;
    border: 5px solid transparent;
    &.no-border {
      box-shadow: none;
      border: none;
    }
    &.border--gold {
      box-shadow: 0px 0px 0px 3px $gradient-light-gold;
    }
    &.border--silver {
      box-shadow: 0px 0px 0px 3px #cdcdcd;
    }
    &.border--bronze {
      box-shadow: 0px 0px 0px 3px #c4a77f;
    }
  }
  .user-pic__thumbnail {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>
