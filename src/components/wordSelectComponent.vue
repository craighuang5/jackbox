<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';
import router from '@/router';
import { NOUN_COUNT, VERB_COUNT, NOUN_LIMIT, VERB_LIMIT, RANDOM_NOUN_COUNT, RANDOM_VERB_COUNT, NOUNS, VERBS } from '@/constants/wordConstants';

const gameSessionStore = useGameSessionStore();
const timer = computed(() => gameSessionStore.timer);
const isTimerFinished = computed(() => timer.value === 0);

function leave() {
  gameSessionStore.leaveGame();
  router.push({ name: 'home' });
}

function getRandomWords(words: string[], count: number): string[] {
  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * words.length));
  }
  return Array.from(indices).map(index => words[index]);
}

const randomNouns = ref(getRandomWords(NOUNS, NOUN_COUNT));
const randomVerbs = ref(getRandomWords(VERBS, VERB_COUNT));
const selectedNouns = ref<string[]>([]);
const selectedVerbs = ref<string[]>([]);

function toggleSelection(word: string, type: 'noun' | 'verb') {
  if (type === 'noun') {
    const index = selectedNouns.value.indexOf(word);
    if (index === -1) {
      if (selectedNouns.value.length < NOUN_LIMIT) {
        selectedNouns.value.push(word);
      }
    } else {
      selectedNouns.value.splice(index, 1);
    }
  } else {
    const index = selectedVerbs.value.indexOf(word);
    if (index === -1) {
      if (selectedVerbs.value.length < VERB_LIMIT) {
        selectedVerbs.value.push(word);
      }
    } else {
      selectedVerbs.value.splice(index, 1);
    }
  }
}

function isSelected(word: string, type: 'noun' | 'verb') {
  if (type === 'noun') {
    return selectedNouns.value.includes(word);
  } else {
    return selectedVerbs.value.includes(word);
  }
}

function submitWordSelection() {
  // If no nouns and verbs are selected, pick random ones
  if (selectedNouns.value.length === 0 && selectedVerbs.value.length === 0) {
    selectedNouns.value.push(...getRandomWords(randomNouns.value, RANDOM_NOUN_COUNT));
    selectedVerbs.value.push(...getRandomWords(randomVerbs.value, RANDOM_VERB_COUNT));
  }

  // Ensure the selections don't exceed the limits
  selectedNouns.value = selectedNouns.value.slice(0, NOUN_LIMIT);
  selectedVerbs.value = selectedVerbs.value.slice(0, VERB_LIMIT);
  gameSessionStore.submitWordSelection(selectedNouns.value, selectedVerbs.value);
}

watch(isTimerFinished, (isFinished) => {
  if (isFinished) {
    submitWordSelection();
  }
});
</script>

<template>
  <v-container class="game-container justify-center fill-height"
    style="background: linear-gradient(37deg, #010103, #00557C);">
    <v-sheet rounded :elevation="10" class="game-sheet">
      <div class="timer-container">
        <p class="timer">{{ timer }}</p>
      </div>

      <h1 class="game-title">Choose the topic</h1>
      <h1 class="sub-title">and we'll set the stage for the fight!</h1>

      <div class="words-container">
        <div class="word-buttons">
          <v-btn v-for="noun in randomNouns" :key="noun" :class="{ selected: isSelected(noun, 'noun') }"
            @click="toggleSelection(noun, 'noun')" class="word-btn">
            {{ noun }}
          </v-btn>
        </div>
      </div>
    </v-sheet>
  </v-container>
</template>

<style scoped lang="scss">
.game-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(37deg, #010103, #00557C);
}

.game-sheet {
  padding: 40px;
  background-color: #303030;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
}

.timer-container {
  margin-bottom: 30px;
}

.timer {
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.sub-title {
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 30px;
}

.words-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.word-btn {
  background-color: #444444;
  color: white;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.word-btn:hover {
  background-color: #42b983;
  transform: scale(1.1);
}

.selected {
  background-color: #42b983;
  color: white;
  border: none;
}

.word-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}
</style>
