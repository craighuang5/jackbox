import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/CreateGameView.vue'
import JoinView from '../views/JoinGameView.vue'
import LobbyView from '@/views/LobbyView.vue'
import TutorialView from '@/views/tutorial/TutorialView.vue'
import WordSelectView from '@/views/WordSelectView.vue'
import PromptRevealView from '@/views/transition/PromptRevealView.vue'
import CreateChampionView from '@/views/CreateChampionView.vue'
import CreateChallengerView from '@/views/CreateChallengerView.vue'
import VoteView from '@/views/VoteView.vue'
import ScoreView from '@/views/ScoreView.vue'
import WinnerView from '@/views/WinnerView.vue'
import ChampionRevealView from '@/views/ChampionRevealView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/join',
      name: 'join',
      component: JoinView
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: LobbyView
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: TutorialView
    },
    {
      path: '/word_select',
      name: 'word_select',
      component: WordSelectView
    },
    {
      path: '/prompt_reveal',
      name: 'prompt_reveal',
      component: PromptRevealView
    },
    {
      path: '/create_champion',
      name: 'create_champion',
      component: CreateChampionView
    },
    {
      path: '/create_challenger',
      name: 'create_challenger',
      component: CreateChallengerView
    },
    {
      path: '/vote',
      name: 'vote',
      component: VoteView
    },
    {
      path: '/score',
      name: 'score',
      component: ScoreView
    },
    {
      path: '/winner',
      name: 'winner',
      component: WinnerView
    },
    {
      path: '/champion_reveal',
      name: 'champion_reveal',
      component: ChampionRevealView
    },
  ]
})

export default router
