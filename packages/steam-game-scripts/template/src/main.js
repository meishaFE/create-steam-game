import MeishaWatch from 'meisha-fe-watch';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import katex from 'katex/dist/katex.min.js';
import 'katex/dist/katex.min.css';

import commonFilters from 'Root/common/filters';
import COMMON_API from 'Root/common/config/api';
import * as $http from 'Root/common/utils/request';
import { setAllGameLang } from 'Root/common/utils/lang';

import router from '@/router';
import store from '@/store';
import API from '@/config/api';
import filters from '@/filters';
import App from '@/App.vue';
import { ENV, GAME_NAME } from '@/config';
import messages from '@/lang';

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
addFilters(Vue, commonFilters);
addFilters(Vue, filters);

// set window const
window.$http = $http;
window.API = { ...API, ...COMMON_API };
window.katex = katex;

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
              const lang = setAllGameLang(res.data);
              i18n.locale = lang.local[GAME_NAME];
              store.commit(
                'SETISCANTOGGLELANG',
                lang.server[GAME_NAME].length >= 2
              );
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
