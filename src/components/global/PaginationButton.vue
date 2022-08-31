<template>
  <button
    role="button"
    :disabled="isDisabled"
    class="button button-pagination"
    :class="{ 'is-current': page.isCurrent, [page.class]: true }"
    v-bind="$attrs"
    @click.prevent="page.click">
    <slot>{{ page.number }}</slot>
  </button>
</template>

<script>

export default {
  name: 'BPaginationButton',
  props: {
    page: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isDisabled() {
      return this.disabled || this.page.disabled;
    },
  },
};
</script>
