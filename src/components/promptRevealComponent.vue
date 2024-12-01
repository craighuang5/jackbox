<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';


const gameSessionStore = useGameSessionStore();
const prompt = computed(() => gameSessionStore.prompt);
const timer = computed(() => gameSessionStore.timer);
const isTimerFinished = computed(() => timer.value === 0);

</script>

<template>
  <v-container class="justify-center fill-height" style="background: linear-gradient(37deg, #010103, #00557C);">
    <v-card class="prompt-card" rounded elevation="10">
      <v-card-title class="card-title">Prepare to Create Your Champion!</v-card-title>
      <div class="timer-container">
        <p class="timer">{{ timer }}</p>
      </div>
      <v-card-text class="card-text">
        <h2 class="fight-title">The Title Fight:</h2>
        <p class="prompt">{{ prompt }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.prompt-card {
  padding: 30px;
  margin: 30px;
  background-color: #303030;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.card-text {
  font-size: 1.2rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.fight-title {
  font-size: 1.8rem;
  color: #42b983;
  font-weight: 600;
  margin-bottom: 10px;
}

.prompt {
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  margin-top: 0;
  line-height: 1.5;
  padding: 10px 20px;
  background-color: #444444;
  border-radius: 10px;
  word-wrap: break-word;
}

.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.timer {
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>