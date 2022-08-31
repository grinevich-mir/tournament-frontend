<template>
  <div class="leaderboard-podium">
    <div v-if="scheduleLoading" class="podium-loader">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="podium-wrapper" :class="{ blurred : scheduleLoading }">
      <div class="podium-nav">
        <span @click="getGlobalLeaderboardSchedule('30days', true)" class="podium-nav-tab" :class="{ active: currentMode === '30days'}">Month</span>
        <span @click="getGlobalLeaderboardSchedule('lifetime', true)" class="podium-nav-tab" :class="{ active: currentMode === 'lifetime'}">All time</span>
        <!-- <span class="podium-nav-tab disabled">Year</span> -->
        <template v-if="leaderboardSchedule.endTime">
          <div v-if="timeCalculated" class="podium-nav__message">
            Season ends in <span>{{ timeLeft | fullTime}}</span>
          </div>
          <div v-else class="podium-nav__message">
            <div class="ldr" style="width: 85px; height: 13px"></div>
          </div>
        </template>
      </div>
      <div v-if="$store.state.showVip && this.userLevel <= 1" class="podium-btn">
        <Button @clicked="$router.push({ name: 'Upgrade' })" text="Join Leaderboard" variant="orange" />
      </div>
      <div class="podium-users">
        <div class="podium-user" :class="`rank-${index + 1}`" v-for="(entry, index) in firstThree.entries" :key="index">
          <UserPic/>
          <div class="podium-user-name" :class="{ active: entry.rank === 1 }">
            <div class="podium-user-name-short">{{ $options.filters.shorten(entry.displayName) }}</div>
            <div class="podium-user-name-full">{{ entry.displayName }}</div>
          </div>
          <div class="podium-user-points">
            <!-- {{ formatMoney(entry.points, 'USD') }} -->
            {{ formatMoney(entry.winnings, 'USD', true) }}
          </div>
        </div>
      </div>
      <div class="podium">
        <img src="@/assets/podium.png" alt="podium">
      </div>
    </div>
    <div class="podium-after" :class="{ blurred : scheduleLoading }">
      <div class="podium-bottom-part"></div>
      <div v-if="firstCallMade === false" class="podium-after__list podium-list-placeholder">
        <div v-for="n in 10" :key="n" class="podium-after__user">
          <div class="podium-after-rank">{{ n + 3 }}</div>
          <div class="podium-after-avatar"><img class="user-pic__thumbnail" src="@/assets/logo-round.png" alt="tournament user"></div>
          <div class="podium-after-name">Username</div>
          <div class="podium-after-points">{{ formatMoney(99999, 'USD') }}</div>
        </div>
      </div>
      <div v-else class="podium-after__list" :class="{ loading: loadingList }">
        <div v-if="loadingList" class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
        <!-- <div v-for="(entry, index) in leaderboardSchedule.leaderboard.entries" :key="index" class="podium-after__user" :class="{ hidden: entry.rank < 4 }"> -->
        <div v-for="(entry, index) in leaderboardSchedule" :key="index" class="podium-after__user" :class="{ hidden: entry.rank < 4 }">
          <div class="podium-after-rank">{{ entry.rank }}</div>
          <div class="podium-after-avatar"><img class="user-pic__thumbnail" src="@/assets/logo-round.png" alt="tournament user"></div>
          <div class="podium-after-name">{{ entry.displayName }}</div>
          <!-- <div class="podium-after-points">{{ formatMoney(entry.points, 'USD') }}</div> -->
          <div class="podium-after-points">{{ formatMoney(entry.winnings, 'USD', true) }}</div>
        </div>
        <div v-for="n in placeholderCount" :key="`ph${n}`" class="podium-after__user">
          <div class="podium-after-rank">--</div>
          <div class="podium-after-avatar"><img class="user-pic__thumbnail" src="@/assets/logo-round.png" alt="tournament user"></div>
          <div class="podium-after-name">--</div>
          <div class="podium-after-points">$0</div>
        </div>
      </div>
      <div v-if="this.count > 13" class="podium-list-nav">
        <div class="podium-list-nav-item" v-if="this.skip !== 0" @click="navigateSchedule('top')">Top Competitors <img svg-inline class="arrow-icon arrow-icon--top" src="@/assets/arrow.svg" alt="go to top" /></div>
        <div class="podium-list-nav-item" v-if="this.skip !== 0" @click="navigateSchedule('previous')">Previous <img svg-inline class="arrow-icon arrow-icon--prev" src="@/assets/arrow.svg" alt="previous" /></div>
        <div class="podium-list-nav-item" v-if="this.skip + 10 < this.count" @click="navigateSchedule('next')">Next <img svg-inline class="arrow-icon arrow-icon--next" src="@/assets/arrow.svg" alt="next" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import UserPic from '@/components/global/UserPic.vue';
import Button from '@/components/global/Button.vue';

export default {
  name: 'Podium',
  components: {
    UserPic,
    Button,
  },
  data() {
    return {
      firstCallMade: false,
      timeLeft: 0,
      polling: null,
      intervalInitiated: false,
      timeCalculated: false,
      currentMode: 'lifetime',
      skip: 0,
      count: 0,
      placeholderCount: 0,
      loadingList: false,
      firstThree: {
        entries: [
          {
            avatarUrl: null,
            displayName: 'Username',
            points: 0,
          },
          {
            avatarUrl: null,
            displayName: 'Username',
            points: 0,
          },
          {
            avatarUrl: null,
            displayName: 'Username',
            points: 0,
          },
        ],
      },
      leaderboardSchedule: {},
      scheduleLoading: true,
    };
  },
  computed: {
    userLevel() {
      return this.$store.getters.userLevel;
    },
  },
  methods: {
    getGlobalLeaderboardSchedule(name, clicked = false) {
      if (name === this.currentMode && clicked) return;
      this.currentMode = name;
      this.scheduleLoading = true;
      this.intervalInitiated = false;
      clearInterval(this.polling);
      this.$api
        // .get(`/leaderboard/schedule/${name}/?take=13`)
        .get(`/statistics/winners/${name}/?take=13`)
        .then((response) => response.data)
        .then((leaderboardSchedule) => {
          this.leaderboardSchedule = leaderboardSchedule;
          // this.count = leaderboardSchedule.leaderboard.entryCount;
          this.count = leaderboardSchedule.length;
          // this.count = 5;
          this.placeholderCount = this.count < 11 ? 10 - this.count : 0;
          this.firstCallMade = true;
          // this.firstThree.entries = leaderboardSchedule.leaderboard.entries.slice(0, 3);
          this.firstThree.entries = leaderboardSchedule.slice(0, 3);
          if (!this.intervalInitiated) {
            this.polling = setInterval(() => {
              this.calcSeasonTime();
            }, 1000);
            this.intervalInitiated = true;
          }
        })
        .catch((err) => {
          console.log(err.message || err);
        })
        .finally(() => {
          this.scheduleLoading = false;
        });
    },
    navigateSchedule(dir = 'top') {
      this.loadingList = true;
      let take = 10;
      if (dir === 'next') {
        this.skip += 10;
      } else if (this.skip === 10 && dir === 'previous') {
        take = 13;
        this.skip -= 10;
      } else if (dir === 'previous') {
        this.skip -= 10;
      } else {
        this.skip = 0;
        take = 13;
      }

      this.$api
        // .get(`/leaderboard/schedule/${this.currentMode}?take=${take}&skip=${this.skip}`)
        .get(`/statistics/winners/${this.currentMode}/?take=${take}&skip=${this.skip}`)
        .then((response) => response.data)
        .then((leaderboardSchedule) => {
          this.leaderboardSchedule = leaderboardSchedule;
          this.loadingList = false;
        })
        .catch((err) => {
          console.log(err.message || err);
        });
    },
    calcSeasonTime() {
      if (!this.leaderboardSchedule.endTime) return;
      // game start time
      let targetTime;
      if (this.leaderboardSchedule.endTime !== undefined) {
        targetTime = this.$dayjs(this.leaderboardSchedule.endTime);
      }
      // current time
      const nowTime = this.$dayjs.utc();
      // season time left
      this.timeLeft = targetTime.diff(nowTime, 'seconds');
      this.timeCalculated = true;
    },
  },
  created() {
    this.getGlobalLeaderboardSchedule(this.currentMode);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
};
</script>

<style scoped lang="scss">
  .ldr {
    background-color: $navy;
    margin: 0 auto;
    &::after {
      animation-name: loader85;
      background: linear-gradient(to right, rgba(29,29,48,1) 8%,rgba(35,35,56,1) 18%,rgba(29,29,48,1) 33%);
    }
  }
  .podium-btn {
    text-align: center;
    margin-top: 1.5rem;
    margin-bottom: -2rem;
  }

  @media (max-width: 767px) {
    .podium-btn {
      margin-bottom: 1.5rem;
    }
  }
</style>
