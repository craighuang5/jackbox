<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const votePrompt = computed(() => gameSessionStore.votePrompt);
const voteOption1Username = computed(() => gameSessionStore.voteOption1Username);
const voteOption1Drawing = computed(() => gameSessionStore.voteOption1Drawing);
const voteOption1Caption = computed(() => gameSessionStore.voteOption1Caption);
const voteOption2Username = computed(() => gameSessionStore.voteOption2Username);
const voteOption2Drawing = computed(() => gameSessionStore.voteOption2Drawing);
const voteOption2Caption = computed(() => gameSessionStore.voteOption2Caption);

const championPoints = computed(() => gameSessionStore.championPoints);
const challengerPoints = computed(() => gameSessionStore.challengerPoints);

const timer = computed(() => gameSessionStore.timer);
const isTimerFinished = computed(() => timer.value === 0);

const selectedOption = ref<string | null>(null);

const vote = (option: string) => {
  if (selectedOption.value !== null) {
    return; // Prevent changing the answer once selected
  }
  if (gameSessionStore.username === voteOption1Username.value || gameSessionStore.username === voteOption2Username.value) {
    console.log("You cannot vote for your own matchup!");
    return;
  }
  selectedOption.value = option;
  // Emit the vote to the server
  if (option === 'option1') {
    gameSessionStore.submitVote(voteOption1Username.value, 1, voteOption2Username.value, 0);
  } else {
    gameSessionStore.submitVote(voteOption1Username.value, 0, voteOption2Username.value, 1);
  }
};

const totalVotes = computed(() => gameSessionStore.players.length - 2); // Exclude the two players in the matchup
const option1Health = computed(() => 100 - (championPoints.value / totalVotes.value) * 100);
const option2Health = computed(() => 100 - (challengerPoints.value / totalVotes.value) * 100);

watch(isTimerFinished, (isFinished) => {
  if (isFinished) {
    selectedOption.value = null;
  }
});
</script>

<template>
  <v-container class="vote-container justify-center fill-height">
    <div class="timer-container">
      <div class="health-bar-container">
        <div class="health-bar" :style="{ width: option1Health + '%' }"></div>
      </div>
      <p class="timer">{{ timer }}</p>
      <div class="health-bar-container">
        <div class="health-bar" :style="{ width: option2Health + '%' }"></div>
      </div>
    </div>
    <h1 class="vote-prompt">{{ votePrompt }}</h1>
    <div class="option-container">
      <div class="vote-option" @click="vote('option1')" :class="{ selected: selectedOption === 'option1' }">
        <h3 class="option-caption">{{ voteOption1Caption }}</h3>
        <img :src="voteOption1Drawing" alt="Option 1 Drawing" class="option-image" />
        <p>By: {{ voteOption1Username }} (Champion)</p>
      </div>
      <div class="vote-option" @click="vote('option2')" :class="{ selected: selectedOption === 'option2' }">
        <h3 class="option-caption">{{ voteOption2Caption }}</h3>
        <img :src="voteOption2Drawing" alt="Option 2 Drawing" class="option-image" />
        <p>By: {{ voteOption2Username }} (Challenger)</p>
      </div>
    </div>
  </v-container>
</template>
<style scoped lang="scss">
.vote-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(37deg, #010103, #00557C);
}

.v-container {
  background-image: url('@/assets/ring.png');
  background-size: cover;
  background-position: center;
}

.timer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  position: absolute;
  top: 0;
}

.timer {
  font-size: 3rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.health-bar-container {
  width: 35%;
  height: 20px;
  background-color: #444444;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 5%;
}

.health-bar {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.vote-prompt {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin: 20px 0;
}

.option-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
}

.vote-option {
  cursor: pointer;
  border: 2px solid transparent;
  padding: 10px;
  margin: 10px;
  text-align: center;
  transition: transform 0.3s ease;
  width: 45%;
}

.vote-option.selected {
  border-color: #42b983;
}

.option-caption {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.option-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
