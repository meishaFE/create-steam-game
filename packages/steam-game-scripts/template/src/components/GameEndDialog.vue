<template>
  <div class="dialog-container dialog-container--maxtop">
    <div class="game__dialog--gameend">
      <img src="~@/assets/img/pic_games-over.png">
      <h2>
        {{$t('本次游戏结束了')}}
        <br>
        {{$t('让我们下次再背上行囊出发吧！')}}
      </h2>
      <button class="button--default" @click="goodbye">{{$t('下次再来')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GameDialogGameEnd',
  methods: {
    goodbye() {
      window.location.href = '/student/gamecenter';
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.game__dialog--gameend {
  display: inline-block;
  vertical-align: middle;
  width: 4.54rem;
  height: 3.63rem;
  background-color: rgba(81, 17, 232, 0.8);
  padding-top: 0.4rem;
  img {
    width: 1.2rem;
    height: 1.2rem;
  }
  h2 {
    font-size: 0.2rem;
    color: rgba(255, 255, 255, 1);
    line-height: 0.28rem;
    margin: 0.3rem 0 0.46rem;
  }
}
</style>
