<script setup lang="ts">
import { useGameSessionStore } from '@/stores/gameSessionStore';
import { computed, toRef } from 'vue';
import router from '@/router';

const gameSessionStore = useGameSessionStore();
const gameid = toRef(gameSessionStore, 'gameid');

function startTutorial() {
  gameSessionStore.startTutorial();
}

function leave() {
  console.log(`User ${gameSessionStore.username} left game ${gameSessionStore.gameid}.`)
  gameSessionStore.leaveGame();
  router.push({ name: 'home' });
}

const startDisabled = computed(() => {
  return gameSessionStore.players.length < 1;
});
</script>

<template>
  <v-container class="justify-center fill-height" style="background: linear-gradient(37deg, #010103, #00557C);">
    <v-card class="lobby-card" rounded elevation="10">
      <v-card-title class="game-title">Game Code: {{ gameid }}</v-card-title>
      <v-card-subtitle class="rounds-info">3-8 players</v-card-subtitle>
      <v-card-subtitle class="rounds-info">{{ gameSessionStore.totalRounds }} round(s)</v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <h2 class="players-heading">Players</h2>
        <ul class="players-list">
          <li v-for="player in gameSessionStore.players" :key="player" class="player-item">{{ player }}</li>
        </ul>
      </v-card-text>
      <v-card-actions class="action-buttons">
        <v-btn color="primary" class="start-btn" @click="startTutorial()" :disabled="startDisabled">Start</v-btn>
        <v-btn color="secondary" class="leave-btn" @click="leave()">Leave</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.lobby-card {
  padding: 20px;
  margin: 20px;
  background-color: #303030;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.game-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.rounds-info {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
}

.players-heading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 10px;
}

.players-list {
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: 500;
}

.player-item {
  padding: 5px 0;
  text-align: center;
  margin-bottom: 5px;
  transition: transform 0.3s ease;
}

.player-item:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.start-btn,
.leave-btn {
  width: 45%;
  padding: 12px 0;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 25px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.start-btn:hover {
  background-color: #a0eaff;
}

.leave-btn:hover {
  background-color: #f8c6d4;
}
</style>