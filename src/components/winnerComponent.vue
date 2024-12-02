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
      <v-card-title class="card-title">Winner: {{ winnerUsername }}</v-card-title>
      <v-card-subtitle class="card-subtitle">Score: {{ winnerScore }}</v-card-subtitle>
      <v-card-text>
        <div v-for="(drawing, index) in winnerDrawings" :key="index" class="drawing-container">
          <img :src="drawing" :alt="'Drawing ' + (index + 1)" class="drawing-image" />
        </div>
      </v-card-text>
    </v-card>
    <v-btn color="primary" @click="leave()">Leave</v-btn>
  </v-container>
</template>

<style scoped lang="scss">
.winner-card {
  padding: 20px;
  margin: 20px;
  background-color: #303030;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #ffffff;
  text-align: center;
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
  color: #42b983;
  margin-bottom: 10px;
}

.card-subtitle {
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 20px;
}

.drawing-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.drawing-image {
  width: 200px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-btn {
  margin-top: 20px;
}
</style>