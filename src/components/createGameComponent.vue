<script setup lang="ts">
import { ref } from 'vue'
import { useGameSessionStore } from '@/stores/gameSessionStore'
import type * as IClient from '@/types/IClient';
import router from '@/router';

const gameSessionStore = useGameSessionStore()
const gameTypes = ['Canvas Clash']
const name = ref('')
const rounds = ref(1)
const nameRules = [
  (value: string) => {
    if (value) return true
    return 'You must enter a name'
  }
]

function connect(gameType: string) {
  let request: IClient.ICreateGame = {
    username: name.value,
    gameType: gameType,
    rounds: rounds.value,
  }
  gameSessionStore.createGame(request)
}

function leave() {
  router.push({ name: 'home' });
}
</script>

<template>
  <v-container class="justify-center fill-height" style="background: linear-gradient(37deg, #010103, #00557C);">
    <v-sheet rounded :elevation="10" class="create-sheet">
      <h1 class="game-title">Game Settings</h1>
      <v-form>
        <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required hide-details></v-text-field>
        <v-text-field v-model="rounds" type="number" min="1" label="Number of Rounds" required></v-text-field>
        <div class="button-container">
          <v-btn v-for="gameType in gameTypes" class="create-btn" @click="connect(gameType)">
            Create
          </v-btn>
          <v-btn class="leave-btn" @click="leave()">
            Leave
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<style scoped lang="scss">
.create-sheet {
  padding: 20px;
  margin: 20px;
  background-color: #303030;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.game-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.name-field,
.v-text-field {
  margin-bottom: 25px;
  color: #ffffff;
  background-color: #444444;
  border-radius: 10px;
}

.create-btn,
.leave-btn {
  width: 45%;
  padding: 12px 0;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 7px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.create-btn:hover {
  background-color: #a0eaff;
}

.leave-btn:hover {
  background-color: #f8c6d4;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>
