<template>
  <div id="app">
    <index v-show="ready"/>
    <div class="loading" v-show="!ready">
      <i/>
      <h4>{{$t('加载中')}}</h4>
    </div>
  </div>
</template>

<script>
import Index from './views/index.vue';
const preLoadImg = steamgame.preLoadImg;
export default {
  name: 'GameApp',
  data() {
    return {
      ready: false
    };
  },
  created() {
    preLoadImg().then(() => {
      this.ready = true;
    });
  },
  components: {
    Index
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import './assets/scss/reset';
@import './assets/scss/button';
@import './assets/scss/loading';
@import './assets/scss/dialog';
@import './assets/scss/helpers';

body {
  font-size: 0;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
}

::-webkit-scrollbar {
  width: 5px;
  background: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  height: 1px;
}
</style>
