<template>
  <div class="prizes">
    <PrizeDescription :description="content.description"/>
    <PrizeSlider :prize-list="content.prizeList"/>
  </div>
</template>

<script>
import PrizeDescription from '@/components/home/prizes/PrizeDescription.vue';
import PrizeSlider from '@/components/home/prizes/PrizeSlider.vue';

export default {
  name: 'Prizes',
  props: ['content'],
  components: {
    PrizeDescription,
    PrizeSlider,
  },
};
</script>

<style scoped lang="scss">
  .prizes {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    position: relative;
    max-width: 1460px;
    width: 100%;
    z-index: 2;
  }
  @media (min-width: 1441px) {
    .prizes {
      justify-content: center;
      align-items: center;
    }
  }
  @media (min-width: 768px) {
    .prizes {
      padding: 0 60px;
    }
  }
</style>
