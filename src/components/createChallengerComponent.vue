<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGameSessionStore } from '@/stores/gameSessionStore';

const gameSessionStore = useGameSessionStore();
const timer = computed(() => gameSessionStore.timer);
const isTimerFinished = computed(() => timer.value === 0);
const uploadedImage = ref<string | null>(null);
const opponentDrawing = computed(() => gameSessionStore.opponentDrawing);
const opponentCaption = computed(() => gameSessionStore.opponentCaption);
const videoFeedUrl = ref('http://127.0.0.1:5000/video_feed');
const apiUrl = ref('http://127.0.0.1:5000/key_press')
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
document.addEventListener('keydown', function(event) {
        let key = event.key.toLowerCase();
        console.log("Key pressed: " + key);

        fetch('/key_press', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({key: key})
        }).then(response => response.json())
          .then(data => {
              console.log("Response from server:", data);
          });
    });
watch(isTimerFinished, (isFinished) => {
  if (isFinished) {
    const drawingToSubmit = uploadedImage.value || whiteRectangle;
    gameSessionStore.submitChallenger(drawingToSubmit, nameInput.value);
  }
});



</script>

<template>
  <v-container class="justify-center fill-height">
    <div class="timer-container">
      <p class="timer">{{ timer }}</p>
    </div>
    <v-card class="prompt-card" rounded elevation="10">
      <v-card-text class="card-text">
        <h2 class="fight-title">You are facing off against:</h2>
        <div v-if="opponentDrawing" class="opponent-image-container">
          <img :src="opponentDrawing" alt="Opponent's Drawing" class="opponent-image" />
        </div>
        <p class="prompt">{{ opponentCaption }}</p>
      </v-card-text>
    </v-card>
    <h1>Live Camera Feed</h1>
    <img :src="videoFeedUrl" alt="Live Camera Feed" />
    <v-card class="upload-card" rounded elevation="10">
      <v-card-title class="card-title">Create a challenger that can defeat your opponent!</v-card-title>
      <v-card-text class="card-text">
        <div class="upload-container">
          <label for="file-upload" class="custom-file-upload">Upload Image</label>
          <input type="file" id="file-upload" class="file-input" @change="handleFileUpload" />
          <div v-if="uploadedImage" class="uploaded-image-container">
            <img :src="uploadedImage" alt="Uploaded Image" class="uploaded-image" />
          </div>
        </div>
        <div class="name-input-container">
          <input type="text" v-model="nameInput" class="name-input" placeholder="Enter challenger name here" />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.v-container {
  background-image: url('@/assets/ring.png');
  background-size: cover;
  background-position: center;
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

.prompt-card,
.upload-card {
  padding: 30px;
  margin: 30px;
  background-color: #303030;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.card-text {
  font-size: 1.2rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.fight-title {
  font-size: 1.8rem;
  color: #42b983;
  font-weight: 600;
  margin-bottom: 10px;
}

.prompt {
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
  margin-top: 0;
  line-height: 1.5;
  padding: 10px 20px;
  background-color: #444444;
  border-radius: 10px;
  word-wrap: break-word;
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

.opponent-image-container {
  margin-top: 20px;
  text-align: center;
}

.opponent-image {
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
</style>