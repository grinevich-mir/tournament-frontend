<template>
  <div class="diamonds__loading">
    <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
export default {
  name: 'PaymentSuccess',
  created() {
    if (this.$route.query.cancelled) {
      window.parent.postMessage('PaymentCancelled', '*');
    } else {
      window.parent.postMessage('PaymentSuccess', '*');
    }
  },
};
</script>

<style lang="scss" scoped>
  .diamonds__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: $navy;

    // & .game__loading-dots div {
    //   background: $light-navy;
    // }
  }
</style>
