<template>
  <div class="home">
    <div v-if="isFederatedLoading || !content" class="form--loading-overlay federated-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <template v-else>
      <!-- tournament -->
      <ReferralLander v-if="$route.name === 'ReferralLander'" />
      <Hero v-else :content="content.hero"/>
      <!-- prizes -->
      <Prizes :content="content.prizes"/>
      <!-- leaderboard -->
      <Leaderboard :content="content.leaderboard"/>
      <!-- winners -->
      <Winners :content="content.winners"/>
      <!-- chat -->
      <Community :content="content.chat"/>
      <!-- people -->
      <People :content="content.community"/>
      <!-- FAQ -->
      <FAQ :content="content.faq"/>
    </template>
    <!-- footer -->
    <div class="footer-home">
      <div class="container">
        <Footer/>
        <Copyright/>
      </div>
    </div>
  </div>
</template>

<script>
import Hero from '@/components/home/hero/Hero.vue';
import Prizes from '@/components/home/prizes/Prizes.vue';
import Leaderboard from '@/components/home/leaderboard/Leaderboard.vue';
import Winners from '@/components/home/winners/Winners.vue';
import Community from '@/components/home/community/Community.vue';
import People from '@/components/home/people/People.vue';
import FAQ from '@/components/home/faq/FAQ.vue';
import Footer from '@/components/global/Footer.vue';
import Copyright from '@/components/global/Copyright.vue';
import ReferralLander from '@/views/referrals/Lander.vue';

import sanity from '@/sanity';
import blocksToHtml from '@/helpers/blocks-to-html';

const query = `*[_type == "home" && _id == "home"] {
  _id,
  hero,
  prizes,
  prizes {
    description,
    prizeList {
      heading,
      subheading,
      prizes[]->
    }
  },
  leaderboard,
  winners,
  chat,
  community,
  faq
}[0]`;

export default {
  name: 'Home',
  components: {
    Hero,
    Prizes,
    Leaderboard,
    Winners,
    Community,
    People,
    FAQ,
    Footer,
    Copyright,
    ReferralLander,
  },
  data() {
    return {
      isFederatedLoading: false,
      isLoading: false,
      content: null,
    };
  },
  created() {
    if (typeof this.$route.query.code !== 'undefined' && typeof this.$route.query.state !== 'undefined') {
      this.isFederatedLoading = true;
    }
    this.isLoading = true;
    Promise.all([
      this.$store.dispatch('loadJackpots'),
      this.fetchData(),
    ]).finally(() => {
      this.isLoading = false;
    });
  },
  methods: {
    async fetchData() {
      this.content = null;

      return sanity.fetch(query).then(
        (home) => {
          this.content = {
            ...home,
            hero: {
              ...home.hero,
              heading: blocksToHtml(home.hero.heading),
            },
            prizes: {
              ...home.prizes,
              description: {
                ...home.prizes.description,
                content: blocksToHtml(home.prizes.description.content),
              },
            },
          };

          this.content.faq.questions.forEach((q, index) => {
            this.content.faq.questions[index].answer = blocksToHtml(q.answer);
          });
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
  .home {
    // max-width: 1440px;
    margin: 0 auto;
    color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    /deep/ .button--rounded-blue.large {
      padding: 12px 2rem;
      font-size: 18px;
      width: calc(100vw - 3rem);
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  .footer-home {
    min-width: 1320px;
    .copyright {
      margin: 2rem 0;
    }
  }
</style>

<style lang="scss">
  .home {
    & .gold {
      background: linear-gradient(115.15deg, #D7AF58 3.55%, #FFDE95 58.01%, #D7AF58 96.38%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    & .t-divider {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      & img {
        margin: 40px 0;
      }
      & h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 29px;
      }
      & p {
        margin-bottom: 20px;
        font-weight: 500;
        font-size: 12px;
        line-height: 19px;
      }
    }
    .footer-home .footer {
      margin-top: 10px !important;
    }
  }
  @media (min-width: 768px) {
    .home {
      & .t-divider {
        & img {
          margin-bottom: 30px;
        }
        & h3 {
          font-size: 26px;
          line-height: 42px;
        }
        & p {
          font-size: 16px;
          line-height: 26px;
          margin-bottom: 30px;
        }
      }
    }
  }
</style>
