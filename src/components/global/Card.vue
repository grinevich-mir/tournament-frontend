<template>
  <div class="card">
    <slot name="badge">
      <Badge v-if="badge" class="overlay-badge" :text="badge" variant="blue" :class="`overlay-badge--${badgePosition}`"></Badge>
    </slot>
    <div class="card__thumbnail" v-if="image">
      <slot name="thumbnail">
        <img :src="image">
      </slot>
    </div>

    <div class="card__content">
      <slot name="body"></slot>
      <div class="card__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/global/Badge.vue';

export default {
  name: 'Card',
  components: {
    Badge,
  },
  props: {
    image: {
      type: [String, Object],
    },
    badge: String,
    badgePosition: String,
  },
};
</script>

<style lang="scss" scoped>
  .card {
    display: flex;
    flex-direction: column;
    background-color: $navy;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    & .badge {
      position: absolute;
      width: fit-content;
      top: 8px;
      left: 8px;
      min-width: 90px;
      text-align: center;
      &.overlay-badge--right {
        left: unset;
        right: 8px;
      }
    }
    & .card__thumbnail {
      width: 100%;
      & img {
        width: 100%;
      }
    }
    & .card__content {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>
