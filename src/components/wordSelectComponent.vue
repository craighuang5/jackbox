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
  <h1>You Choose the Topic, We’ll Set the Stage for the Fight!</h1>
  <p v-if="timer > -1">{{ timer }}</p>
  <div>
    <h2>Nouns</h2>
    <div>
      <v-btn v-for="noun in randomNouns" :key="noun" :class="{ selected: isSelected(noun, 'noun') }"
        @click="toggleSelection(noun, 'noun')">
        {{ noun }}
      </v-btn>
    </div>
    <h2>Verbs</h2>
    <div>
      <v-btn v-for="verb in randomVerbs" :key="verb" :class="{ selected: isSelected(verb, 'verb') }"
        @click="toggleSelection(verb, 'verb')">
        {{ verb }}
      </v-btn>
    </div>
  </div>
  <!-- <v-btn @click="leave()">Leave</v-btn> -->
</template>

<style scoped lang="scss">
.selected {
  background-color: #42b983;
  color: white;
}
</style>