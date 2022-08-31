<template>
  <div class="history__main-body">
    <h2>Game History</h2>
    <div v-if="!historyLoaded" class="area__loading">
      <div class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
    </div>
    <transition name="fade">
      <div v-if="historyData.items.length > 0" class="history__games">
        <RowPanel
          v-for="game in historyData.items"
          :key="`history-${game.id}`"
          class="history__game"
        >
          <template v-slot:title>
            {{game.name}}
            <div class="game-results" v-if="game.leaderboardMode === 'Visible'" @click="viewResults(game.id, game.leaderboardId, clickedGameId)">
              <div v-if="clickedGameId === game.id && loadingData" class="game__loading-dots"><div></div><div></div><div></div><div></div></div>
              <span :class="{ hidden: clickedGameId === game.id && loadingData}">Game Results</span>
            </div>
          </template>
          <template v-slot:details>
            <div class="game-played-date">
              <div class="game-played-details">
                <div>{{ $dayjs(game.startTime).format('dddd, MMMM Do YYYY') }}</div>
                <div>(Game ID: {{ game.id }})</div>
                <div v-if="game.playerTotalCost">
                  Spend: <img svg-inline class="ticket-icon icon green" src="@/assets/white-ticket-icon.svg" alt="Tickets">{{game.playerTotalCost}}</div>
              </div>
              <div class="history-game-right">
                <Badge v-if="game.userPrize !== undefined && game.currencyCode === 'DIA'" variant="emerald">
                  <template v-slot:text>
                    <img svg-inline class="ticket-icon icon" src="@/assets/white-ticket-icon.svg" alt="Tickets">
                    {{game.userPrize.amount}}
                  </template>
                </Badge>
                <Badge v-else :text="checkForWinnings(game)" variant="emerald"/>
              </div>
            </div>
          </template>
          <template v-slot:after>
            <div :id="`game-${game.id}`" class="history__leaderboard" :class="{ active: clickedGameId === game.id}">
              <transition name="collapse">
                <div v-if="leaderboardData.entries.length > 0 && clickedGameId === game.id && leaderboardDataReady" class="history__leaderboard-entries">
                  <div v-for="(entry, index) in leaderboardData.entries" :key="entry.displayName" class="history__lb-entry" :class="{ me: entry.isPlayer }">
                    <span class="history_lb-pos">{{ index + 1 }}</span>
                    <span class="history_lb-username">{{ entry.displayName }}</span>
                    <span class="history_lb-points">{{ entry.points }}</span>
                  </div>
                  <div v-for="n in 10 - leaderboardData.entries.length" :key="`placeholder-${n}`" class="history__lb-entry">
                    <span class="history_lb-pos">-</span>
                    <span class="history_lb-username">--</span>
                    <span class="history_lb-points">-</span>
                  </div>
                  <transition name="fade">
                    <div v-if="leaderboardData.userEntry !== undefined" class="history__lb-entry me-after-10">
                      <span class="history_lb-pos">{{ leaderboardData.userEntry.rank }}</span>
                      <span class="history_lb-username">{{ leaderboardData.userEntry.displayName }}</span>
                      <span class="history_lb-points">{{ leaderboardData.userEntry.points }}</span>
                    </div>
                  </transition>
                </div>
              </transition>
            </div>
          </template>
        </RowPanel>
      </div>
      <div v-else-if="historyData.items.length === 0 && historyLoaded" class="history__none">
        <div class="history__none-inner">
          <div class="history__dice">🎲</div>
          <div class="history__message">
            <p>You haven&apos;t played any games on Tournament.</p>
            <p>After playing a game, it will appear here.</p>
          </div>
          <Button text="Play now" variant="orange" @clicked="$router.push({ name: 'Lobby' })"/>
        </div>
      </div>
    </transition>
    <Pagination
      v-if="historyData.items.length > 0 && historyData.pageCount > 1"
      :total="historyData.totalCount"
      :current.sync="historyData.page"
      :range-before="1"
      :range-after="1"
      :loading="paginationLoading"
      @change="handlePagination">
    </Pagination>
  </div>
</template>

<script>
import Button from '@/components/global/Button.vue';
import Pagination from '@/components/global/Pagination.vue';
import Badge from '@/components/global/Badge.vue';
import RowPanel from '@/components/global/RowPanel.vue';

export default {
  name: 'History',
  components: {
    Pagination,
    Button,
    Badge,
    RowPanel,
  },
  data() {
    return {
      historyData: {
        items: [],
      },
      historyLoaded: false,
      paginationLoading: false,
      clickedGameId: null,
      leaderboardData: {
        entries: [],
      },
      leaderboardDataReady: false,
      loadingData: false,
    };
  },
  async created() {
    try {
      await this.fetchHistory();
    } catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    }
  },
  methods: {
    viewResults(gameId, leaderboardId, previouslyClickedGameId) {
      // check the user is toggling the same game results
      if (gameId === previouslyClickedGameId) {
        this.$el.querySelector(`#game-${gameId}`).classList.toggle('active');
        return;
      }
      this.loadingData = true;
      this.leaderboardDataReady = false;
      this.clickedGameId = gameId;
      this.leaderboardMyPos = null;
      // fetch leaderboard for the clicked game
      this.$api
        .get(`/leaderboard/${leaderboardId}?take=10`)
        .then((response) => response.data)
        .then((leaderboard) => {
          this.leaderboardData = leaderboard;
          this.leaderboardDataReady = true;
          this.loadingData = false;
        }).catch(() => {
          //
        });
    },
    // look for the amount property in prizes array
    checkForWinnings(game) {
      let amountWon = this.formatMoney(0, game.currencyCode);
      if (game.userPrize !== undefined) {
        if (game.userPrize.type === 'Tangible') {
          return game.userPrize.shortName;
        }
        amountWon = this.formatMoney(game.userPrize.amount, game.userPrize.currencyCode);
      }
      return amountWon;
    },
    fetchHistory(page = 1) {
      return this.$api
        .get(`/tournament/history/me`, {
          params: {
            page,
          },
        })
        .then((response) => response.data)
        .then((historyData) => {
          this.historyData = historyData;
          this.historyLoaded = true;
        })
        .finally(() => {
          this.paginationLoading = false;
        });
    },
    handlePagination(page) {
      this.paginationLoading = true;
      this.fetchHistory(page);
    },
  },
};
</script>

<style scoped lang="scss">
  .history__main-body {
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;

    h2 {
      text-align: center;
      margin-bottom: 1rem;
      color: #fff;
    }
  }
  .history-game-right {
    & .ticket-icon {
      width: 18px;
      margin-bottom: -2px;
      margin-right: 0;
      margin-left: -4px;
    }
  }
  .history__footer {
    margin-top: auto;
  }
  .history__games {
    margin-bottom: 1rem;
  }
  .history__leaderboard {
    width: 100%;
    flex: none;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    visibility: collapse;
    transition: .5s ease-in-out all;
    padding: 0;
    &.active {
      opacity: 1;
      max-height: 1000px;
      visibility: visible;
    }
  }
  .history__leaderboard-entries {
    padding-top: 1rem;
  }
  .game-results {
    color: $emerald;
    margin-left: .5rem;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    display: inline-block;
    position: relative;
    .hidden {
      opacity: 0;
    }
    .game__loading-dots {
      position: absolute;
      top: calc(50% - 1px);
      transform: translateY(-50%) scale(.7);
      left: -1rem;
    }
  }
  .history__lb-entry {
    color: #fff;
    font-size: 16px;
    justify-content: space-between;
    display: flex;
    padding: .25rem .5rem;
    font-weight: 700;
    &:nth-child(1) {
      background: $lb-rank-1;
    }
    &:nth-child(2) {
      background: $lb-rank-2;
    }
    &:nth-child(3) {
      background: $lb-rank-3;
    }
    &:nth-child(4) {
      background: $lb-rank-4;
    }
    &:nth-child(5) {
      background: $lb-rank-5;
    }
    &:nth-child(6) {
      background: $lb-rank-6;
    }
    &:nth-child(7) {
      background: $lb-rank-7;
    }
    &:nth-child(8) {
      background: $lb-rank-8;
    }
    &:nth-child(9) {
      background: $lb-rank-9;
    }
    &:nth-child(10) {
      background: $lb-rank-10;
    }
    &.me-after-10,
    &.me {
      background-color: $dark;
      border-top: 1px solid $blue;
      border-bottom: 1px solid $blue;
    }
  }
  .history_lb-username {
    flex: 1;
    padding: 0 1rem;
    text-align: center;
  }
  .history__none {
    margin: 6rem 0;
    text-align: center;
    p {
      color: $kimberly;
      line-height: 1.5;
    }
    .button {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
  .history__message {
    margin: 1rem 0;
  }
  .history__dice {
    font-size: 2.5rem;
  }
  .game-played-date {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .game-played-details {
    line-height: 1.5;
    display: flex;
    flex-direction: column;

    > div * {
      display: inline-block;
    }
  }
  .ticket-icon {
    margin-right: 2px;
    margin-bottom: -2px;
    &.green {
      path {
        fill: #7CFF84;
      }
    }
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
    .history__main-body {
      padding: 1rem 0;
    }
  }
  @media (max-width: 767px) {
    /deep/ .winner__timeago {
      display: none;
    }
    .game-name {
      font-size: 12px;
    }
    .history__message p {
      font-size: 12px;
    }
    .history__lb-entry {
      font-size: 12px;
    }
  }
</style>
