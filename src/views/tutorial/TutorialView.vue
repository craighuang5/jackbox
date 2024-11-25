<script setup lang="ts">
import { useGameSessionStore } from '@/stores/gameSessionStore';
import router from '@/router';

const gameSessionStore = useGameSessionStore();

function startRound() {
  gameSessionStore.startRound();
}

function leave() {
  console.log(`User ${gameSessionStore.username} left game ${gameSessionStore.gameid}.`)
  gameSessionStore.leaveGame();
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="">
    <h1>Tutorial</h1>
    <v-btn color="primary" @click="startRound()">Skip Tutorial</v-btn>
    <v-btn @click="leave()">Leave</v-btn>
  </div>
</template>

<style lang="sass">
</style>
