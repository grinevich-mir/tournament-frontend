<template>
  <Modal
    v-model="show"
    :btn-action="close"
    :title="title"
    mode="simple"
    no-buttons
    close-button
  >
    <template v-slot:body>
      <div class="enter-modal">
        <p class="enter__disclaimer">Pay {{gameClicked.playerEntryCost}} Ticket{{gameClicked.playerEntryCost > 1 ? 's' : ''}} to enter the Tournament {{ reEnter ? ' again' : '' }}</p>
        <img class="enter__option-image" svg-inline src="@/assets/ticket-icon.svg" alt="Tickets">
        <Button class="enter__option-button" text="Play" variant="rounded-blue" @clicked="startGame" />
        <p class="enter__click-full" @click="close">Back to lobby</p>
      </div>
    </template>
  </Modal>
</template>

<script>
import EventBus from '@/helpers/event-bus';
import Modal from '@/components/global/Modal.vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'EnterDiamondGameModal',
  components: {
    Modal,
    Button,
  },
  data() {
    return {
      show: false,
      reEnter: false,
    };
  },
  created() {
    EventBus.$on('showEnterModal', (reEnter = false) => {
      this.show = true;
      document.body.classList.toggle('no-scroll');
      this.reEnter = reEnter;
    });
  },
  beforeDestroy() {
    EventBus.$off('showEnterModal');
  },
  computed: {
    gameClicked() {
      return this.$store.state.diamonds.gameClicked;
    },
    title() {
      if (!this.gameClicked) return null;
      return this.reEnter ? 'Play again?' : `Play ${this.gameClicked.name}`;
    },
  },
  methods: {
    startGame() {
      this.show = false;
      EventBus.$emit('goToGame', this.gameClicked, true);
    },
    close() {
      this.$store.dispatch('setGameClicked', null);
      this.show = false;
      document.body.classList.remove('no-scroll');
    },
  },
};
</script>

<style lang="scss">

  .modal-title {
    margin-top: 1rem;
  }

  .enter-modal {
    color: #fff;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    padding-top: 0;

    & img {
      height: 135px;
    }

    & .enter__click-full {
      font-size: 12px;
      color: #fff;
      font-weight: normal;
      cursor: pointer;
      margin-top: 1rem;
      &:hover {
        opacity: 1;
      }
    }

    & .enter__disclaimer {
      text-align: center;
      font-size: 12px;
      font-weight: normal;
      color: #7487AD;
    }
    & .enter__option-image {
      margin: 20px 0;
      filter: drop-shadow(0 0 15px rgba(237, 73, 195, 0.4));
    }

    & .button {
      width: 220px;
      margin-top: 1rem;
    }
  }

</style>
