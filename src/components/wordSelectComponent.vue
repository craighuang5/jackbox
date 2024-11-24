<script setup lang="ts">
import { useGameSessionStore } from '@/stores/gameSessionStore';
import router from '@/router';

const gameSessionStore = useGameSessionStore();

function leave() {
  gameSessionStore.leaveGame();
  router.push({ name: 'home' });
}
</script>

<template>
  <h1>word selection</h1>
  <v-btn @click="leave()">Leave</v-btn>
</template>

<style scoped lang="sass">
</style>