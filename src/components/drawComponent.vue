<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const prompt = computed(() => gameSessionStore.prompt);
const videoFeedUrl = ref('http://127.0.0.1:5001/video_feed');

function handleKeyPress(event: KeyboardEvent) {
  let key = event.key.toLowerCase();
  console.log("Key pressed:", key);

  // Send key press to Flask backend
  fetch('http://127.0.0.1:5001/key_press', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key: key })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Response from server:", data);
    })
    .catch(error => {
      console.error("Error sending key press:", error);
    });
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <div class="draw">
    <h2>Draw this:</h2>
    <p>{{ prompt }}</p>
    <img :src="videoFeedUrl" alt="Live Camera Feed" />
  </div>
</template>

<style scoped lang="scss">
.draw {
  text-align: center;
}

img {
  max-width: 100%;
  height: 80vh;
  border: 2px solid #000;
}
</style>