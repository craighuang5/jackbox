<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const votePrompt = computed(() => gameSessionStore.votePrompt);
const voteOption1Username = computed(() => gameSessionStore.voteOption1Username);
const voteOption1Drawing = computed(() => gameSessionStore.voteOption1Drawing);
const voteOption1Caption = computed(() => gameSessionStore.voteOption1Caption);
const voteOption2Username = computed(() => gameSessionStore.voteOption2Username);
const voteOption2Drawing = computed(() => gameSessionStore.voteOption2Drawing);
const voteOption2Caption = computed(() => gameSessionStore.voteOption2Caption);

const selectedOption = ref<string | null>(null);

const vote = (option: string) => {
  selectedOption.value = option;
  // Emit the vote to the server
  // gameSessionStore.submitVote(option);
};
</script>

<template>
  <v-container class="justify-center fill-height">
    <v-card class="vote-card" rounded elevation="10">
      <v-card-title>{{ votePrompt }}</v-card-title>
      <v-card-text>
        <div class="vote-option" @click="vote('option1')" :class="{ selected: selectedOption === 'option1' }">
          <h3>{{ voteOption1Caption }}</h3>
          <img :src="voteOption1Drawing" alt="Option 1 Drawing" />
          <p>By: {{ voteOption1Username }}</p>
        </div>
        <div class="vote-option" @click="vote('option2')" :class="{ selected: selectedOption === 'option2' }">
          <h3>{{ voteOption2Caption }}</h3>
          <img :src="voteOption2Drawing" alt="Option 2 Drawing" />
          <p>By: {{ voteOption2Username }}</p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">
.vote-card
  padding: 20px
  margin: 20px

.vote-option
  cursor: pointer
  border: 2px solid transparent
  padding: 10px
  margin: 10px
  text-align: center

.vote-option.selected
  border-color: #42b983
</style>