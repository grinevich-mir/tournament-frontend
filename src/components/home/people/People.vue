<template>
  <div class="people">
    <div class="t-divider">
      <img src="@/assets/t-divider.svg">
      <template v-if="content">
        <h3>{{content.heading}}</h3>
        <p>{{content.subheading}}</p>
      </template>
    </div>
    <img v-if="content" class="chat" :src="imageUrlFor(content.image)" alt="People">
  </div>
</template>

<script>
import sanity from '@/sanity';
import imageUrlBuilder from '@sanity/image-url';

const imageBuilder = imageUrlBuilder(sanity);

export default {
  name: 'People',
  props: ['content'],
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },
  },
};
</script>

<style lang="scss">
  .people {
    padding: 0 20px;
    z-index: 1;
  }
</style>
