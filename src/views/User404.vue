<template>
  <Main>
    <div class="message-404">
      <h1>404</h1>
      <p>The page you are looking for is missing…</p>
      <div class="button-404">
        <Button @clicked="goLobby" variant="rounded-blue" text="Go back"/>
      </div>
    </div>
  </Main>
</template>

<script>
import Main from '@/layouts/Main.vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'User404',
  components: {
    Main,
    Button,
  },
  data() {
    return {
      //
    };
  },
  methods: {
    goLobby() {
      this.$router.push({ name: 'Lobby' });
    },
  },
};
</script>

<style scoped lang="scss">
  .message-404 {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: 700;
    h1 {
      color: #fff;
      font-size: 150px;
      line-height: 1;
      margin: 0;
    }
    p {
      color: #fff;
      margin-bottom: 3rem;
      font-size: 12px;
    }
  }
  .button-404 {
    width: 200px;
    display: flex;
  }
  @media (max-width: 1279px) {
    .message-404 {
      margin-top: auto;
    }
  }
  @media (max-width: 1023px) {
    .lobby__footer {
      margin-top: auto !important;
    }
  }
  @media (max-width: 767px) {
    .message-404 h1 {
      font-size: 100px;
    }
  }
</style>
