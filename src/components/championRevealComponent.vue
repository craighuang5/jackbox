<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';
import thunder from '../assets/pixabay_loud_thunder_192165.mp3';

const gameSessionStore = useGameSessionStore();
const opponentDrawing = computed(() => gameSessionStore.opponentDrawing);
const opponentCaption = computed(() => gameSessionStore.opponentCaption);
const timer = computed(() => gameSessionStore.timer);
const isTimerFinished = computed(() => timer.value === 0);
const thunderAudio = ref(new Audio(thunder));
watch(opponentDrawing, (newDrawing, oldDrawing) => {
  if (newDrawing && !oldDrawing) {
    thunderAudio.value.play();
  }
});
</script>

<template>
  <v-container class="justify-center fill-height">
    <div class="timer-container">
      <p class="timer">{{ timer }}</p>
    </div>
    <v-card class="prompt-card" rounded elevation="10">
      <v-card-title class="card-title">Prepare to Create Your Challenger!</v-card-title>
      <v-card-text class="card-text">
        <h2 class="fight-title">You are facing off against:</h2>
        <div v-if="opponentDrawing" class="opponent-image-container">
          <img :src="opponentDrawing" alt="Opponent's Champion Drawing" class="opponent-image" />
        </div>
        <p class="prompt">{{ opponentCaption }}</p>
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

.v-container {
  background-image: url('@/assets/ring.png');
  background-size: cover;
  background-position: center;
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

.opponent-image-container {
  margin-top: 20px;
  text-align: center;
}

.opponent-image {
  width: 500px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timer {
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 1%;
  left: 5%;
}
</style>