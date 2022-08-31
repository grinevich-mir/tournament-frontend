<template>
  <div class="amoe-page">
    <div v-if="isLoading" class="body-loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="profile__main-body" :class="{'is-loading': isLoading}">
      <div class="content has-content amoe-c">
        <h1 class="text-has-gradient">Alternate Method of Entry</h1>
        <p>Here is your unique 16 digit code:</p>
        <template v-if="codeObj">
          <p class="code">{{ codeObj.code }}</p>
          <div class="expires">Expires in {{ hour }}:{{ min }}:{{ sec }}</div>
        </template>
        <template v-else>
          <p class="code">Generating code...</p>
        </template>
        <div class="text-content" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import sanity from '@/sanity';
import blocksToHtml from '@/helpers/blocks-to-html';

export default {
  name: 'Amoe',
  data() {
    return {
      isLoading: false,
      codeObj: null,
      now: new Date(),
      timer: null,
      endDate: null,
      content: null,
    };
  },
  computed: {
    hour() {
      if (!this.endDate) {
        return '00';
      }
      const h = Math.trunc((this.endDate - this.now) / 1000 / 3600);
      return h > 9 ? h : `0${h}`;
    },
    min() {
      if (!this.endDate) {
        return '00';
      }
      const m = Math.trunc((this.endDate - this.now) / 1000 / 60) % 60;
      return m > 9 ? m : `0${m}`;
    },
    sec() {
      if (!this.endDate) {
        return '00';
      }
      const s = Math.trunc((this.endDate - this.now) / 1000) % 60;
      return s > 9 ? s : `0${s}`;
    },
  },
  watch: {
    endDate: {
      immediate: true,
      handler(newVal) {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          this.now = new Date();
          if (this.now > newVal) {
            this.now = newVal;
            this.$emit('endTime'); // TODO: test end time !!!
            clearInterval(this.timer);
          }
        }, 1000);
      },
    },
  },
  created() {
    this.query = `*[_type == "content-page" && routeName == "${this.$route.name}"] {
      _id,
      content,
    }[0]
    `;
    this.fetchData();
    this.generateCode();
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
    generateCode() {
      this.isLoading = true;
      this.$api.get('/upgrade/code')
        .then((response) => {
          this.codeObj = response.data;
          this.endDate = new Date(response.data.expireTime);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.profile__main-body {
  height: 100%;
  padding: 2rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  color: #fff;
}
.profile__footer {
  margin-top: auto;
}
.amoe-c {
  text-align: center;

  h1 {
    font-size: 2.6rem;
  }
  p.code {
    color: #fff;
    font-weight: 800;
    font-size: 20px;
    margin: 1.5rem 0 1.3rem;
  }
  .expires {
    background: #1d1d30;
    margin-bottom: 1.5rem;
    padding: .5rem;
    font-size: 12px;
    width: 250px;
    margin-left: auto;
    margin-right: auto;
  }
  ol {
    list-style-position: inside;
  }
  ol ul {
    list-style: none;
  }
  ul, ol {
    p {
      display: inline;
    }
    margin-left: 0;
    margin-right: 0;
    // width: 400px;
    // text-align: left;
    // margin-left: auto;
    // margin-right: auto;
  }
}

.amoe-addresses li:not(:last-child) {
  margin-bottom: 1rem;
}
@media (max-width: 1279px) {
  .panel {
    display: flex;
    flex-direction: column;
  }
  .col-left {
    display: none;
  }
  .mobile-nav {
    order: 1;
  }
  .col-middle {
    order: 3;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .col-right {
    order: 2;
  }
  .profile__main-body {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-left: 0;
    padding-right: 0;
  }
}
@media (max-width: 767px) {
  /deep/ .winner__timeago {
    display: none;
  }
  .amoe-c h1 {
    font-size: 2rem;
  }
}
</style>

<style lang="scss">
  .amoe-page {
    .text-content {
      h5 {
        color: #fff !important;
        font-weight: normal !important;
      }
      ul, li {
        text-align: left;
      }
    }
  }
</style>
