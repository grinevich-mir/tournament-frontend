<template>
  <div class="404">
    <User404 @tap-winner="$emit('tap-winner')" v-if="user"/>
    <Guest404 v-else />
  </div>
</template>

<script>
import User404 from '@/views/User404.vue';
import Guest404 from '@/views/Guest404.vue';

export default {
  name: 'user404',
  components: {
    User404,
    Guest404,
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
};
</script>

<style scoped lang="scss">

</style>
