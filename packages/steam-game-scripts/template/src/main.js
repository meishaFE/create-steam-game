import MeishaWatch from 'meisha-fe-watch';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

// import katex for mathematical formula
import katex from 'katex/dist/katex.min.js';
import 'katex/dist/katex.min.css';

import {
  API,
  ENV,
  GAME_SERVER_ID,
  GAME_FRONT_ID,
  IS_GAME_HAS_EN_VERSION,
  STATIC_URL,
} from '@/config';
import router from '@/router';
import store from '@/store';
import filters from '@/filters';
import { setObjectConst } from '@/utils/setObjectConst';
import messages from '@/lang';

import App from '@/App.vue';

// 初始化通用函数
steamgame.initSteam(Vue, STATIC_URL);

// set vue i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'cn',
  messages,
});

// init meisha-watch
MeishaWatch.init({
  isReport: ENV.prod,
  reportURL: '//log-server-web.meishakeji.com/log/js',
  projectId: 'steamfe',
  partitionId: 'steamGame',
});

Vue.use(MeishaWatch.useVue());

// add filters
addFilters(Vue, filters);

// set window const
setObjectConst(window, { API, katex });

Vue.config.productionTip = false;

$http
  .post(
    API.COMMON.CHECK_AUTH,
    {
      data: {
        auth: window.localStorage.getItem('auth'),
      },
    },
    true
  )
  .then(
    () => {
      const userInfo = window.localStorage.getItem('userInfo');
      if (userInfo) {
        MeishaWatch.setUser(userInfo);
        store.commit('SETUSERINFO', JSON.parse(userInfo));
        $http
          .post(API.COMMON.LANG, {
            data: { classId: JSON.parse(userInfo).classId },
          })
          .then(res => {
            if (res.data) {
              const lang = steamgame.setGameLangToLocal(
                res.data,
                GAME_FRONT_ID,
                GAME_SERVER_ID,
                IS_GAME_HAS_EN_VERSION
              );
              i18n.locale = lang.local;
              store.commit('SETISCANTOGGLELANG', lang.server.length >= 2);
            }
            /* eslint-disable no-new */
            new Vue({
              el: '#app',
              router,
              store,
              i18n,
              components: { App },
              template: '<App/>',
            });
          });
      } else {
        window.location.href = '/';
      }
    },
    () => {
      window.location.href = '/';
    }
  );

function addFilters(Vue, filters) {
  for (let [key, value] of Object.entries(filters)) {
    Vue.filter(key, value);
  }
}
