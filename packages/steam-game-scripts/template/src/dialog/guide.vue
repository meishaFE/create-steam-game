<template>
  <div class="dialog-container">
    <div class="game__dialog--guide">
      <h2>{{$t('游戏指南')}}</h2>
      <div class="desc-container">
        <!-- add img src attr by yourself -->
        <!-- <img v-if="$i18n.locale === 'en'"
             src="" />
        <img v-else
             src="" /> -->
      </div>
      <button class="button--default"
              @click="$emit('cancel')">{{$t('我已阅读')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GameDialogGuide'
};
</script>
<style lang="scss" rel="stylesheet/scss">
.game__dialog--guide {
  display: inline-block;
  vertical-align: middle;
  width: 9.5rem;
  height: 6.34rem;
  max-height: calc(100% - 0.3rem);
  background-color: rgba(255, 255, 255, 1);
  border-radius: 0.08rem;
  padding: 0.22rem 0.4rem 0.1rem;
  h2 {
    font-size: 0.24rem;
    line-height: 0.33rem;
    margin-bottom: 0.1rem;
  }
  .desc-container {
    height: 4.8rem;
    max-height: calc(100% - 1.2rem);
    overflow-y: auto;
    margin-bottom: 0.2rem;
    img {
      width: 100%;
    }
  }
}
</style>
