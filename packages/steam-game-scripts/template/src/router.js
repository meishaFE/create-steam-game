import Vue from 'vue';
import Router from 'vue-router';
import { GAME_FRONT_ID } from './config';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: `/game/${GAME_FRONT_ID}`,
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('./views/main.vue'),
    },
    // {
    //   path: '/earn',
    //   component: () => import('./views/earn.vue'),
    //   children: [...earnRouter],
    // },
  ],
});
