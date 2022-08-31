<template>
  <div class="faq">
    <div class="t-divider">
      <img src="@/assets/t-divider.svg">
      <template v-if="content">
        <h3>{{content.heading}}</h3>
        <p>{{content.subheading}}</p>
      </template>
    </div>

    <!-- <div class="loader" v-if="isLoading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div> -->
    <div v-if="content" class="questions">
      <div v-for="(q, index) in content.questions" :key="index" class="collapser">
        <div class="question" @click="collapser[index] = !collapser[index]">
          {{q.question}}
          <img svg-inline src="@/assets/close.svg" alt="Expand" :class="{ active: collapser[index] }">
        </div>
        <div :class="{ expanded: collapser[index] }" class="collapsed">
          <div v-html="q.answer"></div>
        </div>
      </div>

      <!-- <Button v-if="isMobileSmall" class="gtm-lpclick gtm-click" @clicked="$router.push({ name: 'Register' })" text="Get Started" variant="rounded-blue" large /> -->
      <div v-if="!isMobileSmall && !isLoggedIn" class="home__join">
        <!-- <p>Ready to play? Enter your email to create or restart your membership.</p> -->
        <p class="join__text">Ready to win? Enter your email to create your account.</p>
        <div class="join__button">
          <input class="join__input" placeholder="Email address" type="email" v-model="email">
          <div class="join__clickable gtm-lpclick gtm-click" v-if="!isMobileSmall" @click="$router.push({ name: 'Register', params: { email: email } })">Get Started &gt;</div>
        </div>
      </div>
    </div>
    <img src="@/assets/home-bg-print.svg" class="bg-element right">
    <img src="@/assets/home-bg-grid.svg" class="bg-element left">
  </div>
</template>

<script>
export default {
  name: 'HomeFAQ',
  props: ['content'],
  data() {
    return {
      email: '',
      collapser: {
        0: false,
        1: false,
        2: false,
      },
    };
  },
  computed: {
    isMobileSmall() {
      return this.$store.state.helpers.isMobileSmall;
    },
    isLoggedIn() {
      return this.$store.state.auth.user !== null;
    },
  },
};
</script>

<style lang="scss" scoped>
  .faq {
    padding: 20px;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1460px;
    width: 100%;
    .loader {
      text-align: center;
    }
    & .questions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    & .collapser {
      background-color: $light-navy;
      border-radius: 4px;
      margin-top: 1rem;
      z-index: 1;
      &:first-of-type {
        margin-top: 0;
      }
      & .question {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        & svg {
          width: 14px;
          height: 14px;
          transform: rotate(45deg);
          fill: #fff;
          transition: transform 0.15s ease-in-out;
          &.active {
            transform: none;
            transition: transform 0.15s ease-in-out;
          }
        }
      }
      & .collapsed {
        font-size: 14px;
        color: #A7A7A7;
        line-height: 1.5;

        max-height: 0;
        transition: max-height 0.2s ease-out;
        overflow: hidden;

        &.expanded {
          max-height: 400px;
          transition: max-height 0.3s ease-in;
        }

        & div {
          padding: 20px;
          padding-top: 10px;
        }
      }
    }

    .button {
      margin-top: 2rem;
    }
    & .home__join {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 4rem;
      margin-bottom: 20px;
      & .join__text {
        margin-bottom: 2rem;
      }
      & .join__button {
        display: flex;
        justify-content: center;
        width: 620px;
        height: 52px;
        border-radius: 8px;
        overflow: hidden;
        & .join__input {
          padding: 17px 13px;
          flex-grow: 1;
        }
        & .join__clickable {
          width: 40%;
          font-size: 18px;
          font-weight: 600;
          text-transform: uppercase;
        }
      }
      & .join__clickable {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $blue;
        font-size: 14px;
        &.is-mobile {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          padding: 10px 18px;
          border-radius: 5px;
        }
        &:hover {
          background-color: $dark-blue;
          cursor: pointer;
        }
      }
    }
    & .bg-element {
      position: absolute;
      z-index: 0;
      display: none;
      &.left {
        left: 10rem;
      }
      &.right {
        right: 0;
      }
    }
  }

  @media (min-width: 1440px) {
    .home {
      .bg-element {
        display: block;
      }
    }
  }
  @media (min-width: 1023px) {
    .faq {
      .collapser {
        width: 900px;
      }
    }
  }
  @media (min-width: 767px) {
    .faq {
      padding: 0 60px 20px 60px;
    }
  }
</style>
