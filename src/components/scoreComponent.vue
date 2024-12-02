<script setup lang="ts">
import { computed } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const sortedScoreboard = computed(() => {
  return [...gameSessionStore.scoreboard].sort((a, b) => b.score - a.score);
});

function startRound() {
  gameSessionStore.startRound();
}
</script>

<template>
  <v-container class="justify-center fill-height">
    <v-card class="score-card" rounded elevation="10">
      <v-card-title>Scoreboard</v-card-title>
      <v-card-text>
        <ul>
          <li v-for="(player, index) in sortedScoreboard" :key="index">
            <span class="player-rank">{{ index + 1 }}</span>
            <span class="player-name">{{ player.username }}</span>
            <span class="player-score">{{ player.score }}</span>
          </li>
        </ul>
      </v-card-text>
    </v-card>
    <v-btn color="primary" @click="startRound()">Next Round</v-btn>
  </v-container>
</template>

<style scoped lang="scss">
.score-card {
  padding: 20px;
  margin: 20px;
  background-color: #303030;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #ffffff;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s;

  &:hover {
    background-color: #424242;
  }
}

.player-rank {
  font-weight: bold;
  margin-right: 10px;
}

.player-name {
  flex-grow: 1;
}

.player-score {
  font-weight: bold;
  color: #42b983;
}

.v-btn {
  margin-top: 20px;
}
</style>