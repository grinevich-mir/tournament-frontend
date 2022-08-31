<template>
  <div class="support-icon" v-tooltip="options"></div>
</template>

<script>
export default {
  name: 'SupportIcon',
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    options() {
      return {
        content: 'Tournament Support',
        trigger: this.isMobile ? 'click' : 'hover',
      };
    },
  },
};
</script>

<style scoped lang="scss">
.support-icon {
  background-image: url('~@/assets/logo-round.png');
  background-position: center 84.394%;
  background-repeat: no-repeat;
  display: inline-block;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
  box-sizing: content-box;
  background-size: 120%;
  background-clip: content-box;
  border-radius: 50%;
  height: 12px;
  width: 12px;
}
</style>
