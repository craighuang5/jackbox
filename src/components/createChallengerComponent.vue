<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const timer = computed(() => gameSessionStore.timer);
const isTimerFinished = computed(() => timer.value === 0);
const uploadedImage = ref<string | null>(null);
const opponentDrawing = computed(() => gameSessionStore.opponentDrawing);
const opponentCaption = computed(() => gameSessionStore.opponentCaption);

const nameInput = ref('');

// Base64 encoded white rectangle image
const whiteRectangle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjH3g/eTAAAAtGVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECAA4AAABaAAAAaYcEAAEAAABoAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xAAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACSAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAGOkJsRSTv3MAAAADElEQVQYV2P4//8/AAX+Av6nNYGEAAAAAElFTkSuQmCC';

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        // Reduce image resolution to improve speed of emitting base64 images
        const maxWidth = 600; // Max width for resizing
        const width = image.width;
        const height = image.height;
        let newWidth = width;
        let newHeight = height;
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = Math.round((height * maxWidth) / width); // Scale the height accordingly
        }

        // Create a canvas to draw the resized image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(image, 0, 0, newWidth, newHeight);

          // Convert the canvas to a base64 string
          uploadedImage.value = canvas.toDataURL('image/png');
        }
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const resetFileInput = () => {
  uploadedImage.value = null;
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};

watch(isTimerFinished, (isFinished) => {
  if (isFinished) {
    const drawingToSubmit = uploadedImage.value || whiteRectangle;
    gameSessionStore.submitChallenger(drawingToSubmit, nameInput.value);
    resetFileInput();
  }
});
</script>

<template>
  <p>Time remaining: {{ timer }}</p>

  <!-- Text input for user's name -->
  <div>
    <label for="name">Give your challenger a name:</label>
    <input type="text" v-model="nameInput" placeholder="Make it phunny" />
  </div>

  <!-- File input for uploading image -->
  <input type="file" @change="handleFileUpload" />
  <div v-if="uploadedImage">
    <h3>Uploaded Image:</h3>
    <img :src="uploadedImage" alt="Uploaded Image" />
  </div>
  <div v-if="opponentDrawing">
    <h3>Opponent's Drawing:</h3>
    <img :src="opponentDrawing" alt="Opponent's Drawing" />
  </div>

  <div v-if="opponentCaption">
    <h3>Opponent's Caption:</h3>
    <p>{{ opponentCaption }}</p>
  </div>
</template>

<style scoped lang="sass">
/* You can add custom styles here */
</style>
