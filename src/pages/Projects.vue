<template>
  <div>
    <h1>Mes projets</h1>

    <p v-if="loading">Chargement...</p>
    <p v-if="!loading && projects.length === 0">
      Aucun projet trouvé.
    </p>

    <div class="projects-list">
      <article 
        v-for="project in projects" 
        :key="project.id"
        class="project-card"
      >
        <img 
          v-if="project.imageUrl" 
          :src="project.imageUrl" 
          :alt="project.title" 
        />

        <h2>{{ project.title }}</h2>
        <small>{{ project.date }}</small>

        <p>{{ project.description }}</p>

        <div class="tags">
          <span 
            v-for="tag in project.tags" 
            :key="tag"
          >
            {{ tag }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const projects = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/api/projects')
    const data = await res.json()

    projects.value = data.map(project => {
      const props = project.properties

      return {
        id: project.id,
        title: props.Nom?.title[0]?.plain_text || 'Sans titre',
        description: props.Description?.rich_text[0]?.plain_text || '',
        date: props.Date?.date?.start || '',
        tags: props.Tag?.multi_select?.map(t => t.name) || [],
        imageUrl:
          props.Image?.files[0]?.file?.url ||
          props.Image?.files[0]?.external?.url ||
          ''
      }
    })

  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
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
}
</style>
