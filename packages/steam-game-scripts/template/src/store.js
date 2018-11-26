import Vue from 'vue';
import Vuex from 'vuex';
import { GAME_FRONT_ID } from './config';

const state = Object.assign(
  {
    userInfo: {},
    sessionInfo: {},
    gameInfo: {},

    gameList: [], // 金币游戏列表

    playId: '', // 线路计算正确后才会有的游戏id

    isCanToggleLang: false, // 是否可以切换语言
    gameOver: false, // 游戏是否结束
  },
  steamgame.miniModule.state
);

const mutations = Object.assign(
  {
    SETUSERINFO(state, userInfo) {
      state.userInfo = userInfo;
    },
    SETSESSIONINFO(state, sessionInfo) {
      state.sessionInfo = sessionInfo;
    },
    SETGAMEINFO(state, gameInfo) {
      state.gameInfo = gameInfo;
    },
    SETGAMELIST(state, gameList) {
      state.gameList = gameList;
    },
    SETPLAYID(state, playId) {
      state.playId = playId;
    },
    SETISCANTOGGLELANG(state, isCan) {
      state.isCanToggleLang = isCan;
    },
    SETGAMEOVER(state, gameOver) {
      state.gameOver = gameOver;
    },
  },
  steamgame.miniModule.mutations
);

const actions = Object.assign(
  {
    getSessionInfo({ commit, state }) {
      return new Promise(resolve => {
        $http
          .post(
            API.COMMON.SESSION_INFO,
            {
              data: {
                classId: state.userInfo.classId,
              },
            },
            true
          )
          .then(
            res => {
              const sessionInfo =
                Array.isArray(res.data) &&
                res.data.find(item => item.gameId === GAME_FRONT_ID);
              if (sessionInfo) {
                commit('SETSESSIONINFO', sessionInfo);
                resolve(sessionInfo);
              } else {
                commit('SETGAMEOVER', true);
              }
            },
            res => {
              if (res.code === -4007) {
                commit('SETGAMEOVER', true);
              }
            }
          );
      });
    },
    getGameInfo({ commit, state }) {
      return new Promise(resolve => {
        $http
          .post(
            API.COMMON.GAME_INFO,
            {
              data: {
                studentId: state.userInfo.userId,
                roundId: state.sessionInfo.roundId,
                sessionId: state.sessionInfo.sessionId,
                gameId: state.sessionInfo.gameId,
              },
            },
            true
          )
          .then(
            res => {
              const gameInfo = res.data || {};
              commit('SETGAMEINFO', gameInfo);
              commit('SETMAP', gameInfo.info ? gameInfo.info.map : null);
              resolve(gameInfo);
            },
            res => {
              if (res.code === -4007) {
                commit('SETGAMEOVER', true);
              }
            }
          );
      });
    },
    getGameList({ commit }) {
      return $http
        .post(
          API.MINIGAME.LIST,
          {
            data: {
              sessionId: state.sessionInfo.sessionId,
              perPage: 20,
              currentPage: 1,
            },
          },
          true
        )
        .then(
          res => {
            if (res.data && Array.isArray(res.data.list)) {
              commit('SETGAMELIST', res.data.list);
              return res.data.list;
            }
          },
          () => {}
        );
    },
  },
  steamgame.miniModule.actions
);

const getters = Object.assign(
  {
    gameList(state) {
      return state.gameList;
    },
    userInfo(state) {
      return state.userInfo;
    },
    sessionInfo(state) {
      return state.sessionInfo;
    },
    gameInfo(state) {
      return state.gameInfo;
    },
    playId(state) {
      return state.playId;
    },
    isCanToggleLang(state) {
      return state.isCanToggleLang;
    },
    gameOver(state) {
      return state.gameOver;
    },
  },
  steamgame.miniModule.getters
);

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
});
