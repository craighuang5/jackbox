<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import drawing1 from '../assets/drawings/drawing1.png';
import drawing2 from '../assets/drawings/drawing2.png';
import drawing3 from '../assets/drawings/drawing3.png';
import drawing4 from '../assets/drawings/drawing4.png';
import drawing5 from '../assets/drawings/drawing5.png';
import drawing6 from '../assets/drawings/drawing6.png';
import drawing7 from '../assets/drawings/drawing7.png';
import drawing8 from '../assets/drawings/drawing8.png';
import drawing9 from '../assets/drawings/drawing9.png';
import drawing10 from '../assets/drawings/drawing10.png';
import iceFlow from '../assets/ICE_FLOW_Kevin_MacLeod_Royalty_Free_Music.mp3';

const images = [
  drawing1, drawing2, drawing3, drawing4, drawing5,
  drawing6, drawing7, drawing8, drawing9, drawing10
];

const leftImage = ref(images[0]);
const rightImage = ref(images[1]);

const rotateImages = () => {
  const sideToChange = Math.random() < 0.5 ? 'left' : 'right';
  let newImage: string;
  do {
    newImage = images[Math.floor(Math.random() * images.length)];
  } while ((sideToChange === 'left' && newImage === rightImage.value) ||
    (sideToChange === 'right' && newImage === leftImage.value));

  if (sideToChange === 'left') {
    leftImage.value = newImage;
  } else {
    rightImage.value = newImage;
  }
};

let intervalId: ReturnType<typeof setInterval> | undefined;
const audioRef = ref<HTMLAudioElement | null>(null);

onMounted(() => {
  intervalId = setInterval(rotateImages, 5000);
  if (audioRef.value) {
    audioRef.value.volume = 0.4;
  }
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <v-container class="justify-center fill-height">
    <img :src="leftImage" class="home-drawing left-image" alt="Left Image" />
    <div>
      <h1 style="text-align: center;">CANVAS CLASH</h1>
      <div class="home-container">
        <v-btn color="primary" class="home-btn" to="create">Create Game</v-btn>
        <v-btn color="primary" class="home-btn" to="join">Join Game</v-btn>
      </div>
    </div>
    <img :src="rightImage" class="home-drawing right-image" alt="Right Image" />
    <audio ref="audioRef" :src="iceFlow" autoplay loop></audio>
  </v-container>
</template>

<style scoped lang="scss">
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.home-btn {
  margin: 10px;
  height: 200px !important;
  width: 200px;
}

.v-container {
  background-image: url('@/assets/ring.png');
  background-size: cover;
  background-position: center;
}

.home-drawing {
  width: 20vw;
  height: auto;
}

.left-image {
  margin-right: 20px;
}

.right-image {
  margin-left: 20px;
}
</style>