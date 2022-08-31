export default {
  state: {
    tournaments: [],
    jackpots: [],
    jackpotsPolling: null,
    allWins: [],
    lastWins: [],
    jackpotWins: [],
    bigWins: [],
    gamesDescription: [
      {
        gameId: 2,
        top: (tournament) => {
          let chancesText = tournament.playerAllocationsRemaining === undefined ? 'unlimited' : tournament.playerAllocationsRemaining;
          const singular = tournament.playerAllocationsRemaining === 1;
          if (tournament.playerAllocationsRemaining === 0) {
            chancesText = 'no more';
          }

          if (tournament.prizes.length) {
            return `
              <p>
                You have ${chancesText} chance${singular ? '' : 's'} to build your high score.<br>
                Correctly choose HI or LO to win 1 point.<br>
                Losing uses one of your chances.
              </p>
              <p>
                When the tournament ends, the players with highest scores will win the prizes showns below.
              </p>
            `;
          }
          return `
            <p>
              You have ${chancesText} chance${singular ? '' : 's'} to build your high score.<br>
              Correctly choose HI or LO to win 1 point.<br>
              Losing uses one of your chances.
            </p>
            <p>
              When the tournament ends, the three lucky players who manage to get the listed scores will win the corresponding Mega Prize.
            </p>
          `;
        },
        bottom: () => `
          <p>
            When two or more players have identical high scores, the player that made their choice fastest wins.
          </p>
          <p>
            Choose quickly to increase your chance of winning!
          </p>
        `,
      },
      {
        gameId: 3,
        top: (tournament) => {
          let chancesText = tournament.playerAllocationsRemaining === undefined ? 'unlimited' : tournament.playerAllocationsRemaining;
          const singular = tournament.playerAllocationsRemaining === 1;

          if (tournament.playerAllocationsRemaining === 0) {
            chancesText = 'no more';
          }
          return `
          <p>
          You have ${chancesText} chance${singular ? '' : 's'} to build your high score.<br>
            Choose RED or BLACK and select a chip.<br>
            Points are your chip value multiplied by the inner wheel value.<br>
            Using up all your chips uses one of your chances.
          </p>
          <p>
            When the tournament ends, the players with highest scores will win the prizes showns below.
          </p>
        `;
        },
        bottom: () => `
          <p>
            When two or more players have identical high scores, the player that made their choice fastest wins.
          </p>
          <p>
            Choose quickly to increase your chance of winning!
          </p>
        `,
      },
      {
        gameId: (window.location.hostname === 'tournament.com' || window.location.hostname === 'qa.tournament.com') ? 5 : 6, // robin hood DEV ID 6 - PROD ID 5
        top: (tournament) => {
          let chancesText = tournament.playerAllocationsRemaining === undefined ? 'unlimited' : tournament.playerAllocationsRemaining;
          const singular = tournament.playerAllocationsRemaining === 1;

          if (tournament.playerAllocationsRemaining === 0) {
            chancesText = 'no more';
          }
          return `
            <p>
              You have ${chancesText} chance${singular ? '' : 's'} to build your high score.<br>
              Set your coin size and spin the reels.<br>
              Winning spins add points to your score.<br>
            </p>
            <p>
              When the tournament ends the players with the highest scores will win the prizes shown below.
            </p>
          `;
        },
        bottom: () => `
          <p>
            When two or more players have identical high scores the player that got it soonest wins.
          </p>
        `,
      },
      {
        gameId: (window.location.hostname === 'tournament.com' || window.location.hostname === 'qa.tournament.com') ? 6 : 7, // wishes DEV ID 7 - PROD ID 6
        top: (tournament) => {
          let chancesText = tournament.playerAllocationsRemaining === undefined ? 'unlimited' : tournament.playerAllocationsRemaining;
          const singular = tournament.playerAllocationsRemaining === 1;

          if (tournament.playerAllocationsRemaining === 0) {
            chancesText = 'no more';
          }
          return `
            <p>
              You have ${chancesText} chance${singular ? '' : 's'} to build your high score.<br>
              Set your coin size and spin the reels.<br>
              Winning spins add points to your score.<br>
            </p>
            <p>
              When the tournament ends the players with the highest scores will win the prizes shown below.
            </p>
          `;
        },
        bottom: () => `
          <p>
            When two or more players have identical high scores the player that got it soonest wins.
          </p>
        `,
      },
      {
        gameId: (window.location.hostname === 'tournament.com' || window.location.hostname === 'qa.tournament.com') ? 7 : 8, // wishes DEV ID 8 - PROD ID 7
        top: (tournament) => {
          let chancesText = tournament.playerAllocationsRemaining === undefined ? 'unlimited' : tournament.playerAllocationsRemaining;
          const singular = tournament.playerAllocationsRemaining === 1;

          if (tournament.playerAllocationsRemaining === 0) {
            chancesText = 'no more';
          }
          return `
            <p>
              You have ${chancesText} chance${singular ? '' : 's'} to build your high score.<br>
              Set your coin size and spin the reels.<br>
              Winning spins add points to your score.<br>
            </p>
            <p>
              When the tournament ends the players with the highest scores will win the prizes shown below.
            </p>
          `;
        },
        bottom: () => `
          <p>
            When two or more players have identical high scores the player that got it soonest wins.
          </p>
        `,
      },
      {
        gameId: 4,
        top: () => `
          <p>
            Playing 90 Ball Wall is simple.<br />
            Get your tickets and play for 1 Line, 2 Lines and a Full House whilst chatting to other Members.
          </p>
          <p>
            When the tournament ends the players who filled their tickets first will win the prizes shown below.
          </p>
        `,
        bottom: () => `
          <p>
          When two or more players win a prize at the same time the prize is split equally.
          </p>
        `,
      },
    ],
  },
  getters: {
    groupedTournaments: (state) => {
      // const allTournaments = state.tournaments.reduce((r, a) => {
      //   // check if a tournament is not yet finished
      //   const isActiveTournament = Vue.$dayjs(a.startTime).diff(Vue.$dayjs(), 'seconds') >= 0;
      //   if (isActiveTournament) {
      //     r.push(a);
      //   }
      //   return r;
      // }, []);

      const grouped = state.tournaments.reduce((r, a) => {
        // remove tournaments if they have the same templateId
        let group = r.find((g) => (g.group && g.group === a.group) || g.templateId === a.templateId);
        if (!group) {
          group = {
            templateId: a.templateId,
            group: a.group,
            tournament: a,
          };
          r.push(group);
        }
        // return a new array with tournaments of a unique temlateId which are not yet finished
        return r;
      }, []);
      // sort by level and template ID
      grouped.sort((a, b) => a.tournament.minLevel - b.tournament.minLevel || b.tournament.displayPriority - a.tournament.displayPriority || a.group - b.group || a.templateId - b.templateId);

      return grouped;
    },
    getJackpotById: (state) => (id) => {
      const findJackpot = state.jackpots.find((jackpot) => jackpot.id === id);
      return findJackpot;
    },
    getDescriptionByGameID: (state) => (id) => {
      const findGameDesc = state.gamesDescription.find((gameDesc) => gameDesc.gameId === id);
      return findGameDesc;
    },
  },
  mutations: {
    SET_TOURNAMENTS(state, tournaments) {
      state.tournaments = tournaments;
    },
    SET_JACKPOTS(state, jackpots) {
      state.jackpots = jackpots;
    },
    SET_JACKPOTSINTERVAL(state, jackpotsIntervalState) {
      state.jackpotsPolling = jackpotsIntervalState;
    },
    SET_LASTWINS(state, lastWins) {
      state.lastWins = lastWins;
    },
    SET_JACKPOTWINS(state, jackpotWins) {
      state.jackpotWins = jackpotWins;
    },
    SET_BIGWINS(state, bigWins) {
      state.bigWins = bigWins;
    },
    SET_ALLWINS(state) {
      state.allWins = state.jackpotWins.concat(state.lastWins);
    },
    SHIFT_WINNER(state) {
      if (state.lastWins.length > 1) {
        state.lastWins.shift();
      }
    },
    SHIFT_ALL_WINNERS(state) {
      if (state.allWins.length > 1) {
        state.allWins.shift();
      }
    },
  },
  actions: {
    // loading_tournament_on({ commit }) {
    //   commit('SET_LOADINGSTATE', { tournament: true });
    // },
    // loading_tournament_off({ commit }) {
    //   commit('SET_LOADINGSTATE', { tournament: false });
    // },
    loadTournaments({ commit }) {
      return this.$api
        .get('/tournament')
        .then((response) => response.data)
        .then((tournaments) => {
          const dateTimeNow = Math.ceil(new Date().getTime() / 1000);
          const sortedTournaments = tournaments.map((el) => ({
            ...el,
            secondsToStart: Math.ceil(new Date(el.startTime).getTime() / 1000),
            secondsToEnd: Math.ceil(new Date(el.endTime).getTime() / 1000),
          }))
            .filter((el) => (el.allowJoinAfterStart && (el.secondsToEnd - dateTimeNow) > 0)
              || (!el.allowJoinAfterStart && (el.playerJoined || ((el.secondsToStart - dateTimeNow) > 0))))
            .sort((a, b) => ((a.secondsToStart - b.secondsToStart) || (a.id - b.id)));
          commit('SET_TOURNAMENTS', sortedTournaments);
        });
    },
    loadJackpots({ commit }) {
      return this.$api
        .get('/tournament/jackpot')
        .then((response) => response.data)
        .then((jackpots) => {
          commit('SET_JACKPOTS', jackpots);
        });
    },
    loadJackpotsInterval({ dispatch, commit, state }) {
      if (!state.jackpotsPolling) {
        dispatch('loadJackpots');
        const jackpotsPolling = setInterval(() => {
          dispatch('loadJackpots');
        }, 30000);
        commit('SET_JACKPOTSINTERVAL', jackpotsPolling);
      }
    },
    loadLastWins({ commit }, count = 5) {
      return this.$api
        .get('/tournament/winner/tournament', {
          params: {
            count,
          },
        })
        .then((response) => response.data)
        .then((lastWins) => {
          commit('SET_LASTWINS', lastWins);
          commit('SET_ALLWINS');
        });
    },
    loadJackpotWins({ commit }, count = 5) {
      return this.$api
        .get('/jackpot/winner', {
          params: {
            count,
          },
        })
        .then((response) => response.data)
        .then((jackpotWins) => {
          commit('SET_JACKPOTWINS', jackpotWins);
        });
    },
    loadBigWins({ commit }, count = 5) {
      return this.$api
        .get('/statistics/winners/bigwins', {
          params: {
            count,
          },
        })
        .then((response) => response.data)
        .then((bigWins) => {
          commit('SET_BIGWINS', bigWins);
        });
    },
    shiftWinner({ commit }) {
      commit('SHIFT_WINNER');
    },
    shiftAllWinners({ commit }) {
      commit('SHIFT_ALL_WINNERS');
    },
  },
};
