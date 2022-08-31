<template>
  <div class="community">
    <div class="t-divider">
      <img src="@/assets/t-divider.svg">
      <template v-if="content">
        <h3>{{content.heading}}</h3>
        <p>{{content.subheading}}</p>
      </template>
    </div>
    <img v-if="content" class="chat" :src="imageUrlFor(content.image)" alt="Chat">
  </div>
</template>

<script>
import sanity from '@/sanity';
import imageUrlBuilder from '@sanity/image-url';

const imageBuilder = imageUrlBuilder(sanity);

export default {
  name: 'Community',
  props: ['content'],
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    },
  },
};
</script>

<style lang="scss">
  .community {
    padding: 0 20px;
    & .chat {
      max-width: 500px;
      width: 100%;
    }
  }
</style>
