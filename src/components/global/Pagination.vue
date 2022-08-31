<template>
  <ul class="pagination" :class="{ 'is-loading': loading }">
    <!-- Prev -->
    <li class="pagination-li-prev">
      <PaginationButton
        class="pagination-previous"
        :disabled="!hasPrev"
        :page="getPage(current - 1)">
        &lsaquo;
      </PaginationButton>
    </li>
    <li v-if="hasFirst">
      <PaginationButton :page="getPage(1)" />
    </li>
    <li v-if="hasFirstEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>
    <!-- Pages -->
    <li v-for="page in pagesInRange" :key="page.number">
      <PaginationButton :page="page" />
    </li>
    <!-- Last -->
    <li v-if="hasLastEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>
    <li v-if="hasLast">
      <PaginationButton :page="getPage(pageCount)" />
    </li>
    <li class="pagination-li-next">
      <!-- Next -->
      <PaginationButton
        class="pagination-next"
        :disabled="!hasNext"
        :page="getPage(current + 1)">
        &rsaquo;
      </PaginationButton>
    </li>
  </ul>
</template>

<script>
import PaginationButton from '@/components/global/PaginationButton.vue';

export default {
  name: 'Pagination',
  components: {
    PaginationButton,
  },
  props: {
    total: [Number, String],
    perPage: {
      type: [Number, String],
      default: 20,
    },
    current: {
      type: [Number, String],
      default: 1,
    },
    rangeBefore: {
      type: [Number, String],
      default: 1,
    },
    rangeAfter: {
      type: [Number, String],
      default: 1,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    beforeCurrent() {
      return parseInt(this.rangeBefore, 10);
    },
    afterCurrent() {
      return parseInt(this.rangeAfter, 10);
    },
    /**
    * Total page size (count).
    */
    pageCount() {
      return Math.ceil(this.total / this.perPage);
    },
    /**
    * First item of the page (count).
    */
    firstItem() {
      const firstItem = this.current * this.perPage - this.perPage + 1;
      return firstItem >= 0 ? firstItem : 0;
    },
    /**
    * Check if previous button is available.
    */
    hasPrev() {
      return this.current > 1;
    },
    /**
    * Check if first page button should be visible.
    */
    hasFirst() {
      return this.current >= (2 + this.beforeCurrent);
    },
    /**
    * Check if first ellipsis should be visible.
    */
    hasFirstEllipsis() {
      return this.current >= (this.beforeCurrent + 4);
    },
    /**
    * Check if last page button should be visible.
    */
    hasLast() {
      return this.current <= this.pageCount - (1 + this.afterCurrent);
    },
    /**
    * Check if last ellipsis should be visible.
    */
    hasLastEllipsis() {
      return this.current < this.pageCount - (2 + this.afterCurrent);
    },
    /**
    * Check if next button is available.
    */
    hasNext() {
      return this.current < this.pageCount;
    },
    /**
    * Get near pages, 1 before and 1 after the current.
    * Also add the click event to the array.
    */
    pagesInRange() {
      let left = Math.max(1, this.current - this.beforeCurrent);
      if (left - 1 === 2) {
        left -= 1; // Do not show the ellipsis if there is only one to hide
      }
      let right = Math.min(this.current + this.afterCurrent, this.pageCount);
      if (this.pageCount - right === 2) {
        right += 1; // Do not show the ellipsis if there is only one to hide
      }
      const pages = [];
      for (let i = left; i <= right; i += 1) {
        pages.push(this.getPage(i));
      }
      return pages;
    },
  },
  watch: {
    /**
    * If current page is trying to be greater than page count, set to last.
    */
    pageCount(value) {
      if (this.current > value) this.last();
    },
  },
  methods: {
    /**
    * Previous button click listener.
    */
    prev(event) {
      this.changePage(this.current - 1, event);
    },
    /**
    * Next button click listener.
    */
    next(event) {
      this.changePage(this.current + 1, event);
    },
    /**
    * First button click listener.
    */
    first(event) {
      this.changePage(1, event);
    },
    /**
    * Last button click listener.
    */
    last(event) {
      this.changePage(this.pageCount, event);
    },
    changePage(num, event) {
      if (this.current === num || num < 1 || num > this.pageCount) return;
      this.$emit('update:current', num);
      this.$emit('change', num);
      // Set focus on element to keep tab order
      if (event && event.target) {
        this.$nextTick(() => event.target.focus());
      }
    },
    getPage(num, options = {}) {
      return {
        number: num,
        isCurrent: this.current === num,
        click: (event) => this.changePage(num, event),
        disabled: options.disabled || false,
        class: options.class || '',
      };
    },
  },
};
</script>

<style lang="scss">
ul.pagination {
  display: flex;
  justify-content: center;
  list-style-type: none;
  align-items: center;
  color: #fff;
  padding: 0;
  margin-bottom: 1rem;
}
.button-pagination {
  transition: 0.2s all ease-in-out;
  color: #fff;
  margin: 3px;
  outline: none !important;
  border: 0 !important;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 2px;
  width: 20px;

  &.is-current {
    background: $light-navy;
    box-shadow: inset 0px 10px 10px 20px rgba(255, 255, 255, 0.4);
    // border-bottom-left-radius: 0;
    // border-bottom-right-radius: 0;
  }
  &:hover:not([disabled]) {
    background: rgba(255, 255, 255, 0.4);
  }
}
span.pagination-ellipsis {
  margin: 0 10px;
}
@keyframes spinner-grow {
  0% {
    transform: scale(0);
  }
  50% {
    opacity: 1;
  }
}
.is-loading {
  button.button.button-pagination {
    cursor: not-allowed;
    -webkit-filter: brightness(0.5) grayscale(0.8);
    filter: brightness(0.5) grayscale(0.8);
    pointer-events: none;
  }
  button.button.button-pagination.is-current {
    color: transparent!important;
  }
  button.button.button-pagination.is-current:after {
    color: #fff !important;
    display: block;
    width: 1em;
    height: 1em;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0;
    -webkit-animation: spinner-grow .75s linear infinite;
    animation: spinner-grow .75s linear infinite;
    content: '';
    position: absolute;
    left: calc(50% - 0.5em);
    top: calc(50% - 0.5em);
    position: absolute!important;
  }
}
@media (max-width: 500px) {
  li.pagination-li-prev, li.pagination-li-next {
    display: none;
  }
  .button-pagination {
    padding: 4px 8px;
  }
  span.pagination-ellipsis {
    margin: 0 6px;
  }
}
</style>
