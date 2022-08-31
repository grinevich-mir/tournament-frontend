<template>
  <div class="view-content">
    <div class="loader" v-if="isLoading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div v-else-if="content" v-html="content">
    </div>
  </div>
</template>

<script>
import sanity from '@/sanity';
import blocksToHtml from '@/helpers/blocks-to-html';

export default {
  name: 'ContentPage',
  data() {
    return {
      query: '',
      content: null,
      isLoading: true,
    };
  },
  created() {
    this.query = `*[_type == "content-page" && routeName == "${this.$route.name}"] {
      _id,
      content,
    }[0]
    `;
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.content = null;
      this.isLoading = true;

      sanity.fetch(this.query).then(
        (about) => {
          this.isLoading = false;
          this.content = blocksToHtml(about.content);
        },
        (error) => {
          console.error('SANITY ERR:', error);
        },
      );
    },
  },
};
</script>

<style scoped lang="scss">
</style>
