<script setup>
import { ref, onMounted } from 'vue';
import { preloadProjects } from '../utils/projectsService.js';
import About from '../pages/About.vue';
import Skills from '../pages/Skills.vue';
import Projects from '../pages/Projects.vue';
import { House, User, UserCog, Folder, Mail, Linkedin } from 'lucide-vue-next';

const page = ref('about');

const goHome = () => {
    window.location.href = '/';
};

onMounted(() => {
  preloadProjects();
});
</script>

<template>
    <div class="app">
        <aside class="app__sidebar">
            <nav class="sidebar" aria-label="Navigation principale">
                <button
                    class="sidebar__item"
                    :class="{ 'sidebar__item--active': page === 'home' }"
                    :aria-current="page === 'home' ? 'page' : undefined"
                    @click="goHome"
                >
                    <span class="sr-only">Accueil</span>
                    <House class="sidebar__icon" aria-hidden="true" />
                </button>

                <button
                    class="sidebar__item"
                    :class="{ 'sidebar__item--active': page === 'about' }"
                    :aria-current="page === 'about' ? 'page' : undefined"
                    @click="page = 'about'"
                >
                    <span class="sr-only">À propos</span>
                    <User class="sidebar__icon" aria-hidden="true" />
                </button>

                <button
                    class="sidebar__item"
                    :class="{ 'sidebar__item--active': page === 'skills' }"
                    :aria-current="page === 'skills' ? 'page' : undefined"
                    @click="page = 'skills'"
                >
                    <span class="sr-only">Compétences</span>
                    <UserCog class="sidebar__icon" aria-hidden="true" />
                </button>

                <button
                    class="sidebar__item"
                    :class="{ 'sidebar__item--active': page === 'projects' }"
                    :aria-current="page === 'projects' ? 'page' : undefined"
                    @click="page = 'projects'"
                >
                    <span class="sr-only">Projets</span>
                    <Folder class="sidebar__icon" aria-hidden="true" />
                </button>

                <img
                    src="https://images.unsplash.com/photo-1503431128871-cd250803fa41?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    class="sidebar__profile"
                    alt="Photo de profil de Léna Pignolet"
                />
            </nav>
        </aside>

        <main class="app__content">
            <Home v-if="page === 'home'" />
            <About v-if="page === 'about'" />
            <Skills v-if="page === 'skills'" />
            <Projects v-if="page === 'projects'" />
        </main>
    </div>
</template>
