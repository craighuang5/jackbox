<script setup lang="ts">
import { ref } from 'vue'
import { useGameSessionStore } from '@/stores/gameSessionStore';
import type * as IClient from '@/types/IClient';

const gameSessionStore = useGameSessionStore()
const gameid = ref('')
const name = ref('')
const gameidRules = [
  (value: number) => {
    if (value) return true
    return 'You must enter a game ID'
  },
  (value: number) => {
    if (value) return true
    return 'Game ID must be 4 characters'
  }
]
const nameRules = [
  (value: string) => {
    if (value) return true
    return 'You must enter a name'
  }
]

function connect() {
  let request: IClient.IJoinGame = {
    username: name.value,
    gameid: gameid.value
  }
  gameSessionStore.joinGame(request)
}

</script>

<template>
  <v-container class="justify-center fill-height" style="background: linear-gradient(37deg, #010103, #00557C);">
    <v-sheet rounded :elevation="10" class="join-sheet">
      <h1 class="game-title">Enter Game ID</h1>
      <v-form>
        <v-text-field class="join-field" v-model="name" :rules="nameRules" :counter="10" label="Name" required
          hide-details></v-text-field>

        <v-text-field class="join-field" v-model="gameid" :rules="gameidRules" :counter="10" label="Game ID" required
          hide-details></v-text-field>

        <div class="button-container">
          <v-btn class="connect-btn" @click="connect()">
            Connect
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>


<style scoped lang="scss">
.join-sheet {
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
  margin-bottom: 20px;
}

.join-field {
  margin-bottom: 25px;
  color: #ffffff;
  background-color: #444444;
  border-radius: 10px;
}

.connect-btn {
  width: 100%;
  padding: 12px 0;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 7px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
  background-color: #3e8e41;
  color: white;
}

.connect-btn:hover {
  background-color: #a0eaff;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
