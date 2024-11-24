<script setup lang="ts">
import { useGameSessionStore } from '@/stores/gameSessionStore';
import router from '@/router';

const gameSessionStore = useGameSessionStore();

function startWordSelect() {
  gameSessionStore.startWordSelect();
}

function leave() {
  gameSessionStore.leaveGame();
  router.push({ name: 'word_select' });
}
</script>

<template>
  <div class="">
    <h1>{{ gameSessionStore.gameType }} Tutorial</h1>
    <v-btn color="primary" @click="startWordSelect()">Skip Tutorial</v-btn>
    <v-btn @click="leave()">Leave</v-btn>
  </div>
</template>

<style lang="sass">
</style>
