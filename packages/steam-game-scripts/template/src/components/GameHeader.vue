<template>
  <header class="game__header">
    <div
      :class="['game__header__middle',leftTime<=5?'game__header__middle--warning':'']"
      v-show="timeShow"
    >
      <span>{{countdownArray[0]}}</span>
      <span>{{countdownArray[1]}}</span>
      <i>:</i>
      <span>{{countdownArray[2]}}</span>
      <span>{{countdownArray[3]}}</span>
    </div>
    <div :class="['game__header__timer']" v-show="timerShow">
      <span :style="timerDangerous ? 'color: #B92904;' : '' ">{{timerCurSec | conversionTime}}</span>
    </div>
    <div
      class="game__middle-title"
      v-if="$route.name === 'KLAnaly' || $route.name === 'KlHistory2' || $route.name === 'KlHistory'"
    >答题回顾</div>
    <div class="game__header__left" @click="$emit('back')">
      <img src="~@/assets/img/icon_back.png">
      <span>{{backTitle}}</span>
    </div>
  </header>
</template>
<script>
const { timeDuration, toMMssmm } = steamgame;

export default {
  name: 'GameHeader',
  props: {
    leftTime: {
      type: Number,
      default: 0
    },
    timeShow: {
      type: Boolean,
      default: false
    },
    backTitle: {
      type: String,
      default: ''
    },
    timerShow: {
      type: Boolean,
      default: false
    },
    timerCurSec: {
      type: Number,
      default: 0
    },
    timerDangerous: {
      type: Boolean,
      default: false
    },
    middleTitle: String
  },
  data() {
    return {
      countdownArray: [0, 0, 0, 0] // 倒计时
    };
  },
  watch: {
    leftTime(val) {
      function t(n) {
        return n < 10 ? '0' + n : '' + n;
      }

      const date1 = new Date(0);
      const date2 = new Date(val * 1000);
      const r = timeDuration(date1, date2);
      this.countdownArray = `${t(r[1])}${t(r[2])}`.split('');
    }
  },
  filters: {
    conversionTime(time) {
      return toMMssmm(time);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
$height_of_game__header: 0.54rem;
.game__header {
  position: relative;
  height: $height_of_game__header;
  background-color: rgba(81, 17, 232, 1);
  &__left {
    position: relative;
    display: inline-block;
    z-index: 1;
    font-size: 0;
    padding: 0 0.3rem;
    cursor: pointer;
    img {
      width: 0.08rem;
      height: 0.16rem;
    }
    span {
      font-size: 0.2rem;
      color: rgba(255, 255, 255, 1);
      margin-left: 0.13rem;
    }
  }
  &__middle {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: $height_of_game__header;
    line-height: $height_of_game__header;
    text-align: center;
    font-size: 0;
    color: rgba(255, 255, 255, 1);
    * {
      font-size: 0.32rem;
    }
    i {
      font-style: normal;
      line-height: 0.4rem;
      margin: 0 0.07rem 0.05rem;
    }
    &--warning {
      color: rgba(255, 130, 130, 1);
    }
  }
  &__left,
  &__middle {
    * {
      display: inline-block;
      vertical-align: middle;
      line-height: $height_of_game__header;
    }
  }
  &__timer {
    width: 2.18rem;
    height: 0.86rem;
    position: absolute;
    z-index: 10;
    left: 50%;
    margin-left: -1.09rem;
    font-size: 0.32rem;
    text-align: center;
    line-height: 0.86rem;
    color: rgba(255, 255, 255, 1);
    background: url('~@/assets/img/game_fs_time.png') center/100% no-repeat;
  }

  .game__middle-title {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.2rem;
    color: #ffffff;
    height: 0.54rem;
  }
}
</style>
