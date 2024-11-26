<script setup lang="ts">
import { computed } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const prompt = computed(() => gameSessionStore.prompt);
</script>

<template>
  <v-container class="justify-center fill-height">
    <v-card class="prompt-card" rounded elevation="10">
      <v-card-title>Prompt Reveal</v-card-title>
      <v-card-text>
        <h2>Your Prompt:</h2>
        <p>{{ prompt }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">
.prompt-card
  padding: 20px
  margin: 20px
</style>