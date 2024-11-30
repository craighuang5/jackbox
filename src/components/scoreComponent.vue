<script setup lang="ts">
import { computed } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const sortedScoreboard = computed(() => {
  return [...gameSessionStore.scoreboard].sort((a, b) => b.score - a.score);
});
</script>

<template>
  <v-container class="justify-center fill-height">
    <v-card class="score-card" rounded elevation="10">
      <v-card-title>Scoreboard</v-card-title>
      <v-card-text>
        <ul>
          <li v-for="(player, index) in sortedScoreboard" :key="index">
            {{ player.username }}: {{ player.score }}
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">
.score-card
  padding: 20px
  margin: 20px

ul
  list-style-type: none
  padding: 0

li
  padding: 10px
  border-bottom: 1px solid #ccc
</style>