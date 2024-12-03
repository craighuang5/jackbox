<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const prompt = computed(() => gameSessionStore.prompt);
const timer = computed(() => gameSessionStore.timer);
const isTimerFinished = computed(() => timer.value === 0);
const uploadedImage = ref<string | null>(null);

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
    gameSessionStore.submitChampion(drawingToSubmit, nameInput.value);
  }
});
</script>

<template>
  <v-container class="justify-center fill-height">
    <p class="timer">{{ timer }}</p>

    <div class="game-container">
      <h2 class="title">Create your champion for the following title:</h2>
      <p class="prompt">{{ prompt }}</p>

      <!-- File input for uploading image -->
      <div class="upload-container">
        <label for="file-upload" class="custom-file-upload">Upload Image</label>
        <input type="file" id="file-upload" class="file-input" @change="handleFileUpload" />
        <div v-if="uploadedImage" class="uploaded-image-container">
          <img :src="uploadedImage" alt="Uploaded Image" class="uploaded-image" />
        </div>
      </div>

      <!-- Text input for user's name -->
      <div class="name-input-container">
        <input type="text" v-model="nameInput" class="name-input" placeholder="Enter champion name here" />
      </div>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #303030;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.prompt {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffffff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  margin-bottom: 20px;
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

.timer {
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 1%;
  left: 5%;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.custom-file-upload {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  display: inline-block;
  margin-bottom: 20px;
}

.custom-file-upload:hover {
  background-color: #2a9d61;
}

.file-input {
  display: none;
}


.uploaded-image-container {
  margin-top: 20px;
  text-align: center;
}

.uploaded-image {
  width: 500px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.name-input-container {
  width: 100%;
  margin-top: 20px;
  text-align: center;
}

.name-input {
  width: 80%;
  padding: 10px;
  font-size: 1.1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
}

.name-input:focus {
  border-color: #42b983;
}

.v-container {
  background-image: url('@/assets/ring.png');
  background-size: cover;
  background-position: center;
}
</style>
