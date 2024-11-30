<script setup lang="ts">
import { computed } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';
import router from '@/router';

const gameSessionStore = useGameSessionStore();
const winnerUsername = computed(() => gameSessionStore.winnerUsername);
const winnerDrawings = computed(() => gameSessionStore.winnerDrawings);
const winnerScore = computed(() => gameSessionStore.winnerScore);

function leave() {
  console.log(`User ${gameSessionStore.username} left game ${gameSessionStore.gameid}.`)
  gameSessionStore.leaveGame();
  router.push({ name: 'home' });
}
</script>

<template>
  <v-container class="justify-center fill-height">
    <v-card class="winner-card" rounded elevation="10">
      <v-card-title>Winner: {{ winnerUsername }}</v-card-title>
      <v-card-subtitle>Score: {{ winnerScore }}</v-card-subtitle>
      <v-card-text>
        <div v-for="(drawing, index) in winnerDrawings" :key="index">
          <img :src="drawing" :alt="'Drawing ' + (index + 1)" />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
  <v-btn @click="leave()">Leave</v-btn>
</template>

<style scoped lang="sass">
.winner-card
  padding: 20px
  margin: 20px

img
  max-width: 100%
  height: auto
  margin-bottom: 10px
</style>