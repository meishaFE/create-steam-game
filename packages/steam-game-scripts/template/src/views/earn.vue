<template>
  <div class="game__earn" v-if="configReady">
    <router-view @quitGame="$emit('quitGame')" @continueGame="$emit('continueGame')"/>
  </div>
</template>
<script>
export default {
  name: 'GameEarn',
  async created() {
    try {
      await this.$store.dispatch('getGameConfig');
      this.configReady = true;
    } catch (error) {
      // You need to handle Error
    }
  },
  data() {
    return {
      configReady: false
    };
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.game__earn {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  text-align: center;
  &:before {
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    content: '';
  }
  > * {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
