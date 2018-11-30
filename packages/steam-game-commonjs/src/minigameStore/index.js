import { isType } from '../lib/type';
import * as $http from '../lib/http';

const state = {
  leftTime: 0, // 倒计时剩余时间
  timeInterval: null, // 定时器
  timeShow: false, // 是否显示倒计时
  timerCurSec: 0, // 计时器当前秒数
  timerShow: false, // 是否显示计时器
  timerDangerous: false, // 计时器危险警报
  exDone: false, // 是否完成了附加题
  gameSuccess: false, // 游戏是否成功
  isFinished: false, // 游戏是否结束
  gameVisibility: {}, // 各小游戏是否显示
  mpProblems: [], // 记忆宫殿的题目
  mpSettings: [], // 记忆宫殿的配置
  mpLevel: -1, // 记忆宫殿的难度
  cwLevel: -1, // 魔方墙的难度
  azPts: 0, // AZ查表得分
  sdTime: -1, // 数独使用时间
  lhLevel: -1, // 推理小屋的难度
  gainKlCoin: 0, // 知识乐园获得金币数目
  showMask: false, // 是否显示遮罩层
  fsPlayId: '', // 眼疾手快的playId
  fsSubmitInfo: null, // 眼疾手快游戏的提交数据
  rewards: 0 // 本轮金币游戏所获金币数
};

const mutations = {
  SETLEFTTIME(state, time) {
    state.leftTime = time;
  },
  DECLEFTTIME(state, number) {
    if (number && isType(number, 'Number')) {
      state.leftTime = Math.max(state.leftTime - number, 0);
    }
  },
  SETREWARDS(state, rewards) {
    state.rewards = rewards;
  },
  SETFSSUBMITINFO(state, info) {
    state.fsSubmitInfo = info;
  },
  SETTIMERDANGEROUS(state, bool) {
    state.timerDangerous = bool;
  },
  SETFSPLAYID(state, str) {
    state.fsPlayId = str;
  },
  SETTIMESHOW(state, bool) {
    state.timeShow = bool;
  },
  SETTIMERSHOW(state, bool) {
    state.timerShow = bool;
  },
  SETTIMERCURSEC(state, num) {
    state.timerCurSec = num;
  },
  SETSHOWMASK(state, bool) {
    state.showMask = bool;
  },
  SETMPPROBLEMS(state, problems) {
    state.mpProblems = problems;
  },
  SETMPSETTINGS(state, mpSettings) {
    state.mpSettings = mpSettings;
  },
  SETGAMESUCCESS(state, bool) {
    state.gameSuccess = bool;
  },
  SETISFINISHED(state, bool) {
    state.isFinished = bool;
  },
  SETEXDONE(state, bool) {
    state.exDone = bool;
  },
  SETINTERVAL(state, interval) {
    state.timeInterval = interval;
  },
  SETAZPTS(state, number) {
    state.azPts = number;
  },
  SETMPLEVEL(state, number) {
    state.mpLevel = number;
  },
  SETCWLEVEL(state, number) {
    state.cwLevel = number;
  },
  SETLHLEVEL(state, number) {
    state.lhLevel = number;
  },
  SETSDTIME(state, number) {
    state.sdTime = number;
  },
  SETGAMEVISIBILITY(state, gameVisibility) {
    state.gameVisibility = gameVisibility;
  },
  SETGAINKLCOIN(state, coin) {
    state.gainKlCoin = coin;
  }
};

const actions = {
  setLeftTime({ commit, state }, time) {
    return new Promise(resolve => {
      commit('SETLEFTTIME', time);
      const interval = setInterval(() => {
        if (state.leftTime > 0) {
          commit('DECLEFTTIME', 1);
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
      commit('SETINTERVAL', interval);
    });
  },
  getGameConfig({ commit }) {
    return new Promise(resolve => {
      $http
        .getJSON(
          `https://cdn.meishakeji.com/steamfe/gameSettings.json?t=${new Date().getTime()}`
        )
        .then(
          res => {
            if (res && res.visible && res.mp) {
              commit('SETGAMEVISIBILITY', res.visible);
              commit('SETMPSETTINGS', res.mp);
              resolve();
            }
          },
          () => {}
        );
    });
  }
};

const getters = {
  leftTime(state) {
    return state.leftTime;
  },
  fsSubmitInfo(state) {
    return state.fsSubmitInfo;
  },
  fsPlayId(state) {
    return state.fsPlayId;
  },
  timeShow(state) {
    return state.timeShow;
  },
  timerCurSec(state) {
    return state.timerCurSec;
  },
  timerShow(state) {
    return state.timerShow;
  },
  timerDangerous(state) {
    return state.timerDangerous;
  },
  showMask(state) {
    return state.showMask;
  },
  mpProblems(state) {
    return state.mpProblems;
  },
  mpSettings(state) {
    return state.mpSettings;
  },
  gameSuccess(state) {
    return state.gameSuccess;
  },
  isFinished(state) {
    return state.isFinished;
  },
  rewards(state) {
    return state.rewards;
  },
  exDone(state) {
    return state.exDone;
  },
  timeInterval(state) {
    return state.timeInterval;
  },
  azPts(state) {
    return state.azPts;
  },
  mpLevel(state) {
    return state.mpLevel;
  },
  cwLevel(state) {
    return state.cwLevel;
  },
  sdTime(state) {
    return state.sdTime;
  },
  lhLevel(state) {
    return state.lhLevel;
  },
  gameVisibility(state) {
    return state.gameVisibility;
  },
  gainKlCoin(state) {
    return state.gainKlCoin;
  }
};

const miniModule = {
  state,
  mutations,
  actions,
  getters
};

export { miniModule };
