<template>
  <div class="app">
    <aside class="sidebar">
      <button @click="goHome">Home</button>
      <button @click="page = 'about'">À propos</button>
      <button @click="page = 'skills'">Compétences</button>
      <button @click="page = 'projects'">Projets</button>
    </aside>

    <main class="content">
      <Home v-if="page === 'home'" />
      <About v-if="page === 'about'" />
      <Skills v-if="page === 'skills'" />
      <Projects v-if="page === 'projects'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import About from '../pages/About.vue'
import Skills from '../pages/Skills.vue'
import Projects from '../pages/Projects.vue'

const page = ref('about')

const goHome = () => {
  window.location.href = '/'
}
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  border-right: 1px solid #ddd;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content {
  flex: 1;
  padding: 40px;
}
</style>
