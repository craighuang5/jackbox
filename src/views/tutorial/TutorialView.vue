<script setup lang="ts">
import { useGameSessionStore } from '@/stores/gameSessionStore';
import router from '@/router';
import tutorial1 from '../../assets/tutorial/tutorial1.png';
import tutorial2 from '../../assets/tutorial/tutorial2.png';
import tutorial3 from '../../assets/tutorial/tutorial3.png';
import tutorial4 from '../../assets/tutorial/tutorial4.png';
import tutorial5 from '../../assets/tutorial/tutorial5.png';

const gameSessionStore = useGameSessionStore();

// Tutorial data (assuming you will pass images and descriptions dynamically)
const tutorialSteps = [
  { title: '1. Pick a Topic', description: `Choose a topic that interests you! The AI will create a unique title fight based on it (e.g., if you choose "being cool", then you might compete to become the Champion of Effortless Style).`, image: tutorial1 },
  { title: '2. Build Your Champion', description: `Design your champion using any drawing app or our hand-tracking drawing tool, then upload and name them.`, image: tutorial2 },
  { title: '3. Build a Challenger', description: `Receive someone else's champion and create a challenger to defeat them. You won't know the title fight until later!`, image: tutorial3 },
  { title: '4. The Showdown', description: `The title fight is revealed! The champion and challenger face off, and players vote for the winner that fits the title fight the best. The more votes you get, the more points you earn!`, image: tutorial4 },
  { title: '5. Have Fun!', description: `Quick, unexpected drawings often create the most interesting and hilarious characters. Embrace the silliness, think outside the box, and let your imagination run wild!`, image: tutorial5 },

  // Add more tutorial steps as needed
];

function startRound() {
  gameSessionStore.startRound();
}

function leave() {
  console.log(`User ${gameSessionStore.username} left game ${gameSessionStore.gameid}.`);
  gameSessionStore.leaveGame();
  router.push({ name: 'home' });
}
</script>

<template>
  <v-container class="tutorial-container">
    <div class="header-container">
      <h1 class="tutorial-title">HOW TO PLAY</h1>
      <v-btn class="continue-btn" color="primary" @click="startRound()">Continue</v-btn>
    </div>
    <v-row class="tutorial-steps" justify="center" align="start">
      <v-col v-for="(step, index) in tutorialSteps" :key="index" cols="12" md="4" class="tutorial-card-container">
        <v-card class="tutorial-card" elevation="5">
          <v-card-title class="card-title">{{ step.title }}</v-card-title>
          <v-card-subtitle class="card-description">{{ step.description }}</v-card-subtitle>
          <v-img :src="step.image" alt="Tutorial image" class="tutorial-image" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.tutorial-container {
  text-align: center;
  padding: 20px;
}

.tutorial-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.continue-btn {
  font-size: 1rem;
  font-weight: bold;
}

.tutorial-card {
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #444;
}

.card-description {
  font-size: 1rem;
  font-weight: 400;
  color: #666;
  margin-top: 10px;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.tutorial-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 15px;
}

@media (max-width: 600px) {
  .tutorial-container {
    padding: 10px;
  }

  .tutorial-title {
    font-size: 1.5rem;
  }

  .tutorial-card {
    padding: 15px;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-description {
    font-size: 0.9rem;
  }

  .continue-btn {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
