<template>
  <div class="game">
    <game-header
      :left-time="leftTime"
      :time-show="timeShow"
      :back-title="backTitle"
      :timer-show="timerShow"
      :timerCurSec="timerCurSec"
      :timerDangerous="timerDangerous"
      @back="back"
    />
    <div class="game__bar">
      <div v-show="!playId" class="game__bar__money">
        <img src="~@/assets/img/icon_money.png">
        <span>{{gameInfo.coin || 0}}</span>
        <div class="select-lang" v-show="isMain && isCanToggleLang">
          <div
            @click="dropDownLang"
            class="select-lang__selected"
          >{{$i18n.locale === 'cn' ? '中文' : 'English'}}</div>
          <ul v-show="selectLangFlag" class="select-lang__options">
            <li @click="selectLang('en')" class="select-lang__options-item">English</li>
            <li @click="selectLang('cn')" class="select-lang__options-item">中文</li>
          </ul>
        </div>
      </div>
      <ul v-show="!playId">
        <li @click="guideDlgShow=true" v-show="isMain">
          <img src="~@/assets/img/icon_game-guide.png">
          <span>{{$t('游戏指南')}}</span>
        </li>
        <li @click="toEarn" v-show="isMain">
          <img src="~@/assets/img/icon_earn-money.png">
          <span>{{$t('赚金币')}}</span>
        </li>
      </ul>
    </div>
    <div class="game__content">
      <router-view
        @quitGame="quitGame"
        @continueGame="continueGame"
        :guide-dlg-show.sync="guideDlgShow"
      />
    </div>
    <div v-if="showMask" class="dialog-container dialog-container--maxtop"></div>
    <div class="dialog-container dialog-container--maxtop" v-if="quitDlgShow">
      <div class="game__dialog--quit">
        <h2>{{$t(gameName)}}</h2>
        <h4>{{$t('真的要退出游戏了吗？')}}</h4>
        <h6 v-if="isMain">({{$t('游戏中途退出，视为放弃本次挑战')}})</h6>
        <button class="button--reverse" @click="sureQuitGame">{{$t('狠心退出')}}</button>
        <button class="button--default" @click="quitDlgShow=false">{{$t('继续游戏')}}</button>
      </div>
    </div>
    <div class="dialog-container" v-show="isFinished">
      <div class="game__result">
        <img
          src="../assets/img/pic_congratulation.png"
          v-show="gameSuccess"
          class="game__result__right"
        >
        <img src="../assets/img/pic_fighting.png" class="game__result__wrong" v-show="!gameSuccess">
        <h2
          :class="{'margin-bottom-15':(gameName === '推理小屋' || gameName === '知识乐园')&&!gameSuccess}"
        >{{resultTip}}</h2>
        <h4 v-if="gameName === '推理小屋'&&!gameSuccess">
          （账号总金币数已
          <span>倒扣{{rewards | positionInt}}个</span>）
        </h4>
        <h4 v-if="gameName === '知识乐园'&&!gameSuccess">
          （账号总金币数已
          <span>倒扣{{gainKlCoin}}个</span>）
        </h4>
        <div>
          <button v-if="gameName === '知识乐园'" class="button--reverse" @click="quitGame">返回游戏</button>
          <template v-if="reqReady || gameName === 'AZ查表入门版'">
            <button v-if="gameName !== '知识乐园'" class="button--reverse" @click="quitGame">退出游戏</button>
            <button
              v-if="gameName !== '知识乐园' && canContinue"
              class="button--default"
              @click="continueGame"
            >继续游戏</button>
          </template>
        </div>
      </div>
    </div>
    <game-end-dlg v-if="gameOver"/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GameHeader from '@/components/GameHeader';
import GameEndDlg from '@/components/GameEndDialog';
import { GAME_NAME, GAME_FRONT_ID } from '@/config';

export default {
  name: 'Game',
  data() {
    return {
      quitDlgShow: false,
      guideDlgShow: false,
      canContinue: false,
      selectLangFlag: false,
      language: '',
      reqReady: false
    };
  },
  computed: {
    ...mapGetters([
      'leftTime',
      'timeShow',
      'timerShow',
      'timerCurSec',
      'showMask',
      'timerDangerous',
      'gameSuccess',
      'isFinished',
      'azPts',
      'timeInterval',
      'rewards',
      'mpLevel',
      'cwLevel',
      'gameInfo',
      'playId',
      'gameState',
      'gameOver',
      'mpSettings',
      'gainKlCoin',
      'isCanToggleLang',
      'fsSubmitInfo'
    ]),
    isMain() {
      return this.$route.name === 'Main';
    },
    gameName() {
      switch (true) {
        case this.$route.path.includes('/mp'):
          return '记忆宫殿';
        case this.$route.path.includes('/cw'):
          return '魔方墙';
        case this.$route.path.includes('/fs'):
          return '眼疾手快';
        case this.$route.path.includes('/sd'):
          return '数独';
        case this.$route.path.includes('/az') && this.$route.query.length == 10:
          return 'AZ查表入门版';
        case this.$route.path.includes('/az'):
          return 'AZ查表';
        case this.$route.path.includes('/lh'):
          return '推理小屋';
        case this.$route.path.includes('/kl'):
          return '知识乐园';
        default:
          return GAME_NAME;
      }
    },
    backTitle() {
      return this.$t(this.isMain ? '退出游戏' : '返回');
    },
    resultTip() {
      if (this.gameName === '记忆宫殿' || this.gameName === '推理小屋') {
        return this.gameSuccess
          ? `恭喜你挑战成功，获得${this.rewards}金币`
          : '很遗憾，答错了。请继续加油';
      } else if (
        this.gameName === '魔方墙' ||
        this.gameName === '数独' ||
        this.gameName === '眼疾手快'
      ) {
        return this.gameSuccess
          ? `恭喜你挑战成功，获得${this.rewards}金币`
          : '挑战失败，请再接再厉';
      } else if (
        this.gameName === 'AZ查表' ||
        this.gameName === 'AZ查表入门版'
      ) {
        return `共答对${this.azPts}题，获得${this.rewards}金币，再接再厉！`;
      } else if (this.gameName === '知识乐园') {
        return this.gameSuccess
          ? `恭喜你挑战成功，获得${this.gainKlCoin}个金币`
          : '很遗憾，答错了，下次继续努力~';
      }
    }
  },
  watch: {
    isFinished(val) {
      if (val) {
        this.reqReady = false;
        this.$store.dispatch('getGameInfo');
        this.$store.dispatch('getGameList').then(
          list => {
            const item = list.find(
              v =>
                v.name ===
                (this.gameName === 'AZ查表入门版' ? 'AZ查表' : this.gameName)
            );
            if (item) {
              if (this.gameName === '记忆宫殿') {
                this.canContinue =
                  item.info &&
                  item.info[this.mpLevel - 1] &&
                  item.info[this.mpLevel - 1].isCanUse;
              } else if (this.gameName === '魔方墙') {
                this.canContinue =
                  item.info &&
                  item.info[this.cwLevel - 1] &&
                  item.info[this.cwLevel - 1].isCanUse;
              } else if (
                this.gameName === '数独' ||
                this.gameName === '眼疾手快' ||
                this.gameName === 'AZ查表' ||
                this.gameName === 'AZ查表入门版'
              ) {
                this.canContinue = item.gainCoin < item.maxCoin;
              } else if (this.gameName === '推理小屋') {
                this.canContinue = false;
              }
              this.reqReady = true;
            }
          },
          () => {}
        );
      }
    }
  },
  filters: {
    positionInt(val) {
      return val < 0 ? -val : val;
    }
  },
  methods: {
    back() {
      if (this.$route.name === 'KLHistory2') {
        this.$router.replace({
          name: 'KLPlay'
        });
      } else if (this.$route.name === 'KLHistory') {
        this.$router.replace({
          name: 'KLAnaly'
        });
      } else if (this.$route.name === 'KLAnaly') {
        this.$router.replace({
          name: 'KLPlay'
        });
      } else if (this.$route.name === 'Earn') {
        this.$router.replace({
          name: 'Main'
        });
      } else if (this.gameName === '推理小屋' || this.gameName === '知识乐园') {
        this.quitGame();
      } else {
        this.quitDlgShow = true;
      }
    },
    toEarn() {
      this.guideDlgShow = this.propDlgShow = false;
      this.$router.replace({
        name: 'Earn'
      });
    },
    reset() {
      this.$store.commit('SETGAINKLCOIN', 0);
      this.$store.commit('SETISFINISHED', false);
      this.$store.commit('SETEXDONE', false);
      this.$store.commit('SETAZPTS', 0);
      this.$store.commit('SETSDTIME', -1);
      this.$store.commit('SETLHLEVEL', -1);
    },
    continueGame() {
      let routeName = '';
      switch (this.gameName) {
        case '记忆宫殿':
          routeName = 'MPDesc';
          break;
        case '魔方墙':
          routeName = 'CWDesc';
          break;
        case '眼疾手快':
          routeName = 'FSDesc';
          break;
        case '数独':
          routeName = 'SDDesc';
          break;
        case 'AZ查表':
          routeName = 'AZDesc';
          break;
        case 'AZ查表入门版':
          routeName = 'AZDesc';
          break;
        case '知识乐园':
          routeName = 'KLPlay';
          break;
        default:
      }
      if (routeName && routeName === 'AZDesc') {
        this.$router.replace({
          name: routeName,
          query: {
            length: this.$route.query.length,
            time: this.$route.query.time
          }
        });
      } else {
        routeName &&
          this.$router.replace({
            name: routeName
          });
      }
      this.reset();
    },
    sureQuitGame() {
      if (this.$route.name === 'FSPlay') {
        this.fsPlayQuit();
      } else {
        this.quitGame();
      }
    },
    fsPlayQuit() {
      $http
        .post(
          API.MINIGAME.SUBMIT,
          {
            data: {
              isQuit: true,
              ...this.fsSubmitInfo
            }
          },
          true
        )
        .then(
          res => {
            this.quitGame();
          },
          err => {
            console.log(err);
          }
        );
    },
    quitGame() {
      if (this.isMain) {
        this.runway();
        window.location.href = '/student/gamecenter';
      } else {
        if (this.$route.name === 'Earn') {
          this.$router.replace({
            name: 'Main'
          });
        } else {
          if (this.$route.name === 'KLQues' || this.$route.name === 'KLDesc') {
            this.$router.replace({
              name: 'KLPlay'
            });
          } else {
            this.$router.replace({
              name: 'Earn'
            });
          }
          this.$store.commit('SETTIMESHOW', false);
          clearInterval(this.timeInterval);
          this.reset();
        }
        this.quitDlgShow = false;
      }
    },
    runway() {
      $http.post(
        API.DINOSAUR.RUN_AWAY,
        { data: { playId: this.playId } },
        true
      );
    },
    dropDownLang() {
      this.selectLangFlag = !this.selectLangFlag;
    },
    selectLang(type) {
      steamgame.setLang(GAME_FRONT_ID, type);
      this.$i18n.locale = type;
      this.selectLangFlag = !this.selectLangFlag;
    }
  },
  components: {
    GameEndDlg,
    GameHeader
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.game {
  width: 100%;
  height: 100%;
  &__content {
    position: relative;
    height: calc(100% - 0.54rem);
    overflow: auto;
    text-align: center;
    font-size: 0;
    padding-top: 0.1rem;
  }
  &__bar {
    position: absolute;
    top: 0;
    right: 0;
    height: 0.54rem;
    line-height: 0.54rem;
    font-size: 0;
    color: rgba(255, 255, 255, 1);
    * {
      display: inline-block;
      vertical-align: middle;
    }
    &__money {
      border-right: 1px solid rgba(0, 0, 0, 0.3);
      img {
        width: 0.22rem;
        height: 0.22rem;
      }
      span {
        margin-left: 0.08rem;
        margin-right: 0.14rem;
        font-size: 0.18rem;
      }
    }
    ul {
      padding-left: 0.2rem;
      li {
        margin-right: 0.3rem;
        cursor: pointer;
        img {
          width: 0.22rem;
          height: 0.22rem;
          margin-right: 0.05rem;
        }
        span {
          font-size: 0.16rem;
        }
      }
    }
  }
  &__dialog--quit {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 3.89rem;
    height: 2.43rem;
    background-color: rgba(81, 17, 232, 0.8);
    border-radius: 0.08rem;
    padding-top: 0.2rem;
    color: rgba(255, 255, 255, 1);
    h2 {
      font-size: 0.24rem;
      line-height: 0.33rem;
    }
    h4 {
      font-size: 0.18rem;
      line-height: 0.25rem;
      margin: 0.37rem 0 0.5rem;
    }
    h6 {
      position: absolute;
      top: 1.2rem;
      left: 0;
      width: 100%;
      font-size: 0.14rem;
    }
  }
  &__result {
    display: inline-block;
    vertical-align: middle;
    &__right {
      width: 4.56rem;
      height: 2.66rem;
      margin-bottom: 0.5rem;
    }
    &__wrong {
      width: 2.05rem;
      height: 2.05rem;
      margin-bottom: 0.5rem;
    }
    h2 {
      font-size: 0.24rem;
      color: rgba(255, 255, 255, 1);
      line-height: 0.33rem;
      margin-bottom: 0.8rem;
      &.margin-bottom-15 {
        margin-bottom: 0.15rem;
      }
    }
    h4 {
      font-size: 0.18rem;
      color: rgba(255, 255, 255, 1);
      line-height: 0.25rem;
      margin-bottom: 0.3rem;
      span {
        color: rgba(252, 75, 78, 1);
      }
    }
    > div {
      height: 0.5rem;
    }
  }
    .select-lang {
    width: 1.18rem;
    height: 0.34rem;
    margin: 0 0.3rem;
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    line-height: 0.34rem;
    &__selected {
      width: calc(100% - 0.3rem);
      position: relative;
      box-sizing: border-box;
      margin: 0.05rem 0.15rem;
      color: #fff;
      font-size: 0.16rem;
      line-height: 0.24rem;
      cursor: pointer;
      &::after {
        content: '';
        width: 0.12rem;
        height: 100%;
        display: inline-block;
        position: absolute;
        right: 0;
        background: url('~@/assets/img/icon_change-language.png') center/100% no-repeat;
      }
    }
    &__options {
      width: 100%;
      padding: 0.1rem 0.12rem !important;
      position: absolute;
      z-index: 10;
      left: 0;
      top: 0.46rem;
      color: #333;
      font-size: 0.16rem;
      line-height: 0.27rem;
      background-color: #fff;
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: -6px;
        left: 24px;
        border-bottom: 6px solid #fff;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
      }
    }
    &__options-item {
      width: 100%;
    }
  }
}
</style>
