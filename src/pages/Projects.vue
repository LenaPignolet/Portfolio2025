<template>
  <div>
    <h1>Mes projets</h1>
    
    <p v-if="loading">Chargement...</p>
    <p v-else-if="error">❌ {{ error }}</p>
    <p v-else-if="projects.length === 0">Aucun projet trouvé.</p>
    
    <div v-else class="projects-list">
      <article v-for="project in projects" :key="project.id" class="project-card">
        <div v-if="project.images?.length" class="project-images">
          <img
            v-for="(img, index) in project.images"
            :key="img"
            :src="img"
            :alt="`${project.title} – image ${index + 1}`"
          />
        </div>
        <h2>{{ project.title }}</h2>
        <small>{{ project.date }}</small>
        <p>{{ project.description }}</p>
        <div class="tags">
          <span v-for="tag in project.tags" :key="tag">
            {{ tag }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProjects } from '../utils/notion.js';  // Import direct depuis notion.js

const projects = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    projects.value = await getProjects();
    if (projects.value.length === 0) {
      error.value = "Aucun projet trouvé. Vérifie ta base Notion.";
    }
  } catch (err) {
    console.error("Erreur:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
div {
  color: white;
}

.projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.project-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 12px;
}

.project-card img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  background: #eee;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #333;
}
</style>
