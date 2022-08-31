<template>
  <div class="row-panel">
    <div class="row-panel__left">

      <div class="title">
        <slot v-if="!title" name="title"></slot>
        <template v-else>{{title}}</template>
      </div>

      <div class="details">
        <slot name="details"></slot>
      </div>
    </div>

    <slot name="badge">
      <div v-if="badgeText" class="row-panel__right">
        <Badge v-if="!badgeAction"
          :text="badgeText"
          :variant="badgeVariant || 'emerald'"

        />
        <Badge v-else
          :text="badgeText"
          :variant="badgeVariant || 'emerald'"
          @click.native="callBadgeAction"
          class="clickable"
          rounded
        />
      </div>
    </slot>
    <slot name="after"></slot>
  </div>
</template>

<script>
import Badge from '@/components/global/Badge.vue';

export default {
  name: 'RowPanel',
  props: ['title', 'badgeText', 'badgeVariant', 'badgeAction', 'badgeActionParam'],
  components: {
    Badge,
  },
  methods: {
    callBadgeAction() {
      if (!this.badgeAction) return;
      this.badgeAction(this.badgeActionParam);
      // Note: if action needs multiple parameters it might be preferable to just create an action slot
    },
  },
};
</script>

<style scoped lang="scss">
  .row-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $navy;
    padding: .75rem 1rem;
    flex-wrap: wrap;
    text-align: left;
    border-radius: 8px;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  .row-panel__left {
    flex: 1;
  }

  .row-panel__right {
    padding-left: .5rem;
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: .5rem;
  }

  .details {
    font-size: 12px;
    font-weight: 500;
    color: $kimberly;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
  }

  .clickable {
    cursor: pointer;
    transition: 0.15s transform ease-in-out;
  }

  .clickable:hover {
    transform: scale(1.1);
  }

  @media (max-width: 767px) {
    .badge {
      font-size: 12px;
    }
    .details span {
      display: block;
      margin-bottom: 3px;
    }
  }

</style>
