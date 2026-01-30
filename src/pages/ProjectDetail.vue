<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getProjects } from '../utils/notion.js';
import Icon from '../components/Icon.vue';
import { ArrowLeft } from 'lucide-vue-next';

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['back']);

const project = ref(null);
const loading = ref(true);
const error = ref(null);

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
    });
}

function handleBack(event) {
    event.preventDefault();
    emit('back');
}

async function loadProject() {
    loading.value = true;
    error.value = null;

    try {
        const projects = await getProjects();
        project.value = projects.find((p) => p.id === props.projectId);

        if (!project.value) {
            error.value = 'Projet introuvable.';
        }
    } catch (err) {
        console.error('Erreur:', err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadProject();
});

watch(() => props.projectId, () => {
    loadProject();
});
</script>

<template>
    <div class="page project-detail">
        <a 
            href="#" 
            class="back-btn" 
            @click="handleBack" 
            aria-label="Retour aux projets"
        >
            <ArrowLeft class="icon" aria-hidden="true" />
            <span>Retour aux projets</span>
        </a>

        <div v-if="loading" class="section loading">
            <p>Chargement du projet...</p>
        </div>

        <div v-else-if="error" class="section error">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="project" class="project-content">
            <header class="project-header">
                <div class="header__title--wrapper">
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                    <h1 class="project-header__title">{{ project.title }}</h1>
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                </div>
                
                <p v-if="project.date" class="project-header__date">
                    {{ formatDate(project.date) }}
                </p>
            </header>

            <div v-if="project.images?.length" class="project-images">
                <img 
                    v-for="(image, index) in project.images" 
                    :key="index"
                    :src="image" 
                    :alt="`${project.title} - Image ${index + 1}`" 
                    class="project-image"
                />
            </div>

            <div v-if="project.description" class="project-description">
                <h2>Description</h2>
                <p>{{ project.description }}</p>
            </div>

            <div v-if="project.skills?.length" class="project-skills">
                <h2>Technologies utilisées</h2>
                <div class="skills-list">
                    <span v-for="skill in project.skills" :key="skill" class="skill-tag">
                        {{ skill }}
                    </span>
                </div>
            </div>

            <div v-if="project.filters?.length" class="project-filters">
                <h2>Catégories</h2>
                <div class="filters-list">
                    <span v-for="filter in project.filters" :key="filter" class="filter-tag">
                        {{ filter }}
                    </span>
                </div>
            </div>

            <div v-if="project.url" class="project-link">
                <a :href="project.url" target="_blank" rel="noopener noreferrer" class="external-link">
                    Voir le projet
                    <Icon name="arrow-top-right" class="icon" aria-hidden="true" />
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: inherit;
    margin-bottom: 2rem;
    text-decoration: none;
    transition: opacity 0.2s;
    width: fit-content;
}

.back-btn:hover {
    opacity: 0.7;
}

.back-btn .icon {
    width: 1.25rem;
    height: 1.25rem;
}

.project-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.project-header {
    text-align: center;
}

.project-header__title {
    font-size: 2.5rem;
    margin: 1rem 0;
}

.project-header__date {
    color: #666;
    font-size: 1.1rem;
}

.project-images {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.project-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}

.project-description,
.project-skills,
.project-filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.project-description h2,
.project-skills h2,
.project-filters h2 {
    font-size: 1.5rem;
    margin: 0;
}

.skills-list,
.filters-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag,
.filter-tag {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border-radius: 20px;
    font-size: 0.9rem;
}

.project-link {
    text-align: center;
}

.external-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: opacity 0.2s;
}

.external-link:hover {
    opacity: 0.8;
}

.external-link .icon {
    width: 1rem;
    height: 1rem;
}
</style>
