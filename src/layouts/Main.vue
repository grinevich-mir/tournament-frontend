<template>
  <div class="main-layout">
    <div class="panel">
      <div class="mobile-nav">
        <MobileNavBar/>
      </div>
      <div class="panel__col col-left" :class="{ overflow: step7Overflow }">
        <UserControls/>
      </div>
      <div class="panel__col col-middle">
        <div class="main-view">

          <slot/>

          <div class="footer">
            <Footer/>
          </div>
        </div>
      </div>
      <div class="panel__col col-right">
        <WinnersFeed v-if="!isMobile || (isMobile && $route.name !== 'Winners')" @tap-winner="$emit('tap-winner')"/>
      </div>
    </div>
    <Modal
      v-model="showIntroModal"
      mode="simple"
      title="Welcome to Tournament!"
      class="intro-modal"
    >
      <template v-slot:body>
        <div class="body">
          <p>Nice to meet you <b>{{displayName}}</b>,</p>
          <p>We recommend that you take our quick 30 second tour to learn how to play all of the awesome games on Tournament..</p>
        </div>
      </template>
      <template v-slot:buttons v-if="isMobileSmall">
        <Button text="Let's go!" variant="rounded-blue" @clicked="startTour"/>
        <br>
        <Button text="Skip tour" variant="rounded-blue" @clicked="skipTour" class="outlined multiline"/>
      </template>
      <template v-slot:buttons v-else>
        <Button text="Skip tour" variant="rounded-blue" @clicked="skipTour" class="outlined inline"/>
        <Button text="Let's go!" variant="rounded-blue" @clicked="startTour"/>
      </template>
    </Modal>
    <v-tour name="onboarding" :steps="steps" :options="{ highlight: true }" :class="{ overlay: isMobileOverlay }" :callbacks="stepCallbacks"></v-tour>
  </div>
</template>

<script>
import UserControls from '@/components/panel/UserControls.vue';
import WinnersFeed from '@/components/global/WinnersFeed.vue';
import Footer from '@/components/global/Footer.vue';
import MobileNavBar from '@/components/navigation/MobileNavBar.vue';
import Modal from '@/components/global/Modal.vue';
import Button from '@/components/global/Button.vue';

import sanity from '@/sanity';
import blocksToHtml from '@/helpers/blocks-to-html';

const query = `*[_type == "onboarding-step" && step >= 0] | order(step) {
  _id,
  step,
  heading,
  content,
}[0..10]`;

export default {
  name: 'MainLayout',
  components: {
    UserControls,
    WinnersFeed,
    Footer,
    MobileNavBar,
    Modal,
    Button,
  },
  data() {
    return {
      steps: [],
      stepCallbacks: {
        onPreviousStep: this.onPreviousStep,
        onNextStep: this.onNextStep,
        onSkip: this.finishTour,
        onFinish: this.finishTour,
      },
      showIntroModal: false,
      isMobileOverlay: true,
      step7Overflow: false,
    };
  },
  created() {
    if (this.$route.query.showTutorial) this.showIntroModal = true;

    this.fetchData();
  },
  mounted() {
    if (!this.isMobile) this.isMobileOverlay = false;
  },
  // beforeDestroy() {
  //   EventBus.$off('start-tour');
  // },
  computed: {
    isMobile() {
      return this.$store.state.helpers.isMobile;
    },
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    displayName() {
      return this.$store.getters.displayName;
    },
    hasCompletedTour() {
      return this.$store.getters.completedTour;
    },
  },
  methods: {
    fetchData() {
      // this.isLoading = true;

      sanity.fetch(query).then(
        (steps) => {
          this.mapSteps(steps);
          // this.isLoading = false;
        },
        (error) => {
          console.error('SANITY ERR:', error);
        },
      );
    },
    mapSteps(steps) {
      this.steps = [
        {
          target: '.v-step-0',
          header: {
            title: blocksToHtml(steps[0].heading),
          },
          content: blocksToHtml(steps[0].content),
          params: {
            enableScrolling: false,
            placement: 'right-start',
          },
          // offset: 10,
        },
        {
          target: '.v-step-1',
          header: {
            title: blocksToHtml(steps[1].heading),
          },
          content: blocksToHtml(steps[1].content),
          params: {
            enableScrolling: false,
          },
        },
        {
          target: '.v-step-2',
          content: blocksToHtml(steps[2].content),
          params: {
            enableScrolling: false,
          },
        },
        {
          target: '.v-step-3',
          content: blocksToHtml(steps[3].content),
          params: {
            enableScrolling: false,
          },
        },
        {
          target: '.v-step-4',
          content: blocksToHtml(steps[4].content),
          params: {
            enableScrolling: false,
          },
        },
        {
          target: '.v-step-5',
          content: blocksToHtml(steps[5].content),
          params: {
            enableScrolling: false,
          },
        },
        // {
        //   target: '.v-step-6',
        //   content: 'This game has no entry cost. You can play 50 times for free for your chance to win a brand new iPhone 13 Pro!',
        //   params: {
        //     enableScrolling: this.isMobile,
        //   },
        // },
        {
          target: '.v-step-6',
          // target: '.v-step-7',
          content: blocksToHtml(steps[6].content),
        },
      ];
    },
    onPreviousStep(currentStep) {
      if (currentStep - 1 === 0) this.isMobileOverlay = true;
      else this.isMobileOverlay = false;
      if (currentStep - 1 === 6) this.step7Overflow = true;
      else this.step7Overflow = false;
    },
    onNextStep(currentStep) {
      if (currentStep + 1 === 0) this.isMobileOverlay = true;
      else this.isMobileOverlay = false;
      if (currentStep + 1 === 6) this.step7Overflow = true;
      else this.step7Overflow = false;
    },
    startTour() {
      this.showIntroModal = false;
      this.$tours.onboarding.start();
    },
    finishTour() {
      this.step7Overflow = false;
      this.$api.post('/user/metadata', {
        completedTour: true,
      });
    },
    skipTour() {
      this.finishTour();
      this.showIntroModal = false;
    },
  },
};
</script>

<style scoped lang="scss">
  .footer {
    margin-top: auto;
  }
  .main-view {
    padding: 1rem;
    height: 100%;
    flex: 1;
    justify-content: space-between;
  }
  .col-left.overflow {
    z-index: 2;
  }
  @media (max-width: 1279px) {
    .panel {
      display: flex;
      flex-direction: column;
    }
    .main-view {
      padding: 1rem 0;
    }
    .mobile-nav {
      order: 1;
    }
    .col-right {
      order: 2;
    }
    .col-left {
      order: 3;
    }
    // .col-middle {
    //   order: 4;
    // }

    .col-middle {
      order: 3;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  @media (max-width: 767px) {
    /deep/ .winner__timeago {
      display: none;
    }
  }
</style>

<style lang="scss">
  .intro-modal {
    .modal-inner-scroll {
      font-size: 14px !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .body {
        max-width: 80%;
        margin: 1rem 0;
        & p {
          line-height: 1.7;
        }
      }
    }

    .button.outlined {
      font-size: 12px;
      border: 2px solid transparent;
      &:hover {
        background: transparent !important;
        border-color: #fff !important;
      }
    }
    .button.inline {
      margin-right: 2rem;
    }
    .button.multiline {
      margin-top: 1rem;
    }
  }
  .v-tour {
    &.overlay .v-step {
      top: unset !important;
      bottom: 1rem !important;
      left: 50% !important;
      transform: translate(-50%, 0) !important;
      width: 100% !important;
      position: fixed !important;
      & .v-step__arrow {
        display: none !important;
      }
    }
    & .v-step {
      min-width: 200px;
      border-radius: 8px !important;
      // background: $blue-gradient-diagonal !important;
      background: $blue !important;
      // border: 1px solid $blue;

      & .v-step__header {
        padding-top: 16px;
        background: $blue !important;
        // background: $blue-gradient-diagonal-reversed !important;
        border-top-left-radius: 8px !important;
        border-top-right-radius: 8px !important;
      }

      & .v-step__content {
        line-height: 1.35;
        font-size: 14px;
        opacity: 0.9;
        & p:not(:last-of-type) {
          margin-bottom: 1rem;
        }
      }

      & .v-step__buttons {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & .v-step__button {
        border-radius: 50px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
      }
    }
  }
  .v-tour__target--highlighted {
    box-shadow: 0 0 0 99999px rgba(0,0,0,.6) !important;
  }
  .v-step-0.v-tour__target--highlighted {
    border-radius: 12.5px;
    border: 2px dashed $blue;
  }
  .v-step-1.v-tour__target--highlighted,
  .v-step-2.v-tour__target--highlighted {
  // .v-step-6.v-tour__target--highlighted {
    border: 2px dashed $blue;
  }
  .v-step-4.v-tour__target--highlighted,
  .v-step-5.v-tour__target--highlighted {
    border-bottom: 2px dashed $blue;
    padding-bottom: 2px;
  }
  .v-step__arrow,
  .v-step__arrow.dark {
    background: $blue !important;
    &::before {
      background: $blue !important;
    }
  }
</style>
