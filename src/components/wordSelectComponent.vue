<script setup lang="ts">
import { computed } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';
import router from '@/router';

const gameSessionStore = useGameSessionStore();
const timer = computed(() => gameSessionStore.timer);

function leave() {
  gameSessionStore.leaveGame();
  router.push({ name: 'home' });
}
</script>

<template>
  <h1>Word Selection</h1>
  <p v-if="timer > -1">Time left: {{ timer }}</p>
  <!-- <v-btn @click="leave()">Leave</v-btn> -->
</template>

<style scoped lang="sass">
</style>