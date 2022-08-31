<template>
  <div class="vip-timer">
    <div class="vip-timer__countdown">
      16:12:56
    </div>
    <div class="vip-timer__message">
      Become a Member before the end of the countdown and get a free month of access to all our exclusive content.
    </div>
  </div>
</template>

<script>
export default {
  name: 'VipTimer',
  components: {
  },
};
</script>

<style scoped lang="scss">
  .vip-timer__countdown {
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    background: $orange-gradient;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .vip-timer__message {
    text-align: center;
    font-size: 12px;
    color: $kimberly;
    margin-top: 1rem;
  }
  @media (max-width: 1599px) {
    .vip-timer__countdown {
      font-size: 26px;
    }
  }
  @media (max-width: 767px) {
    .vip-timer__countdown {
      font-size: 30px;
    }
    .vip-timer__message {
      margin-top: .5rem;
    }
  }
</style>
