<template>
  <div class="game__main">
    <GuideDlg v-if="guideDlgShow" @cancel="$emit('update:guideDlgShow', false)"/>
  </div>
</template>

<script>
import GameGuideDlg from '@/dialog/guide';
export default {
  name: 'GameMain',
  props: {
    guideDlgShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    GameGuideDlg
  }
};
</script>
<style lang="scss">
.game__main {
  position: relative;
  height: 100%;
  width: 100%;
}

.dispaly-none {
  display: none !important;
}
</style>
