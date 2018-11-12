import Vue from 'vue';
import Router from 'vue-router';
import earnRouter from 'Root/common/config/earnRouter';
import { GAME_NAME } from './config';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: `/game/${GAME_NAME}`,
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('./views/main.vue'),
    },
    {
      path: '/earn',
      component: () => import('./views/earn.vue'),
      children: [...earnRouter],
    },
  ],
});
