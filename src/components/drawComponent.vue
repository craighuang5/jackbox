<script setup lang="ts">
import { computed } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';
const gameSessionStore = useGameSessionStore();
const prompt = computed(() => gameSessionStore.prompt);
</script>
<template>
  <h2>Draw this:</h2>
  <p>{{ prompt }}</p>
</template>
<style scoped lang="sass">
</style>