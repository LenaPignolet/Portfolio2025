<script setup>
import { ref, onMounted, watch } from 'vue';
import { getProjects } from '../utils/notion.js';
import Icon from '../components/Icon.vue';
import { ArrowLeft, ExternalLink, ZoomIn } from 'lucide-vue-next';
import VueEasyLightbox from 'vue-easy-lightbox';

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
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);

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

function openLightbox(index = 0) {
    lightboxIndex.value = index;
    lightboxVisible.value = true;
}

function closeLightbox() {
    lightboxVisible.value = false;
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
        <div v-if="loading" class="section loading">
            <p>Chargement du projet...</p>
        </div>

        <div v-else-if="error" class="section error">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="project" class="project-content">
            <nav class="nav-buttons">
                <a 
                    href="#" 
                    class="back-btn" 
                    @click="handleBack" 
                    aria-label="Retour aux projets"
                >
                    <ArrowLeft class="icon" aria-hidden="true" />
                    <span>Retour</span>
                </a>

                <a 
                    v-if="project.url"
                    :href="project.url" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="open-btn"
                    aria-label="Ouvrir le projet"
                >
                    <span>Accéder au projet</span>
                    <ExternalLink class="icon" aria-hidden="true" />
                </a>
            </nav>

            <header class="project-header">
                <h1 class="project-header__title">
                    {{ project.title }}
                </h1>
                
                <div class="project-header__meta">
                    <span v-if="project.date" class="project-header__date">
                        {{ formatDate(project.date) }}
                    </span>
                    <span v-if="project.filters?.length" class="project-header__category">
                        {{ project.filters[0] }}
                    </span>
                </div>
            </header>

            <section v-if="project.skills?.length" class="project-skills">
                <div class="project-title__wrapper">
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                    <h3>Stack</h3>
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                </div>
                <div class="project-skills__list">
                    <span v-for="skill in project.skills" :key="skill" class="skill-tag">
                        {{ skill }}
                    </span>
                </div>
            </section>

            <section v-if="project.description" class="project-description">
                <div class="project-title__wrapper">
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                    <h3>Contexte</h3>
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                </div>
                <p>{{ project.context }}</p>
            </section>

            <section v-if="project.description" class="project-description">
                <div class="project-title__wrapper">
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                    <h3>Réalisation</h3>
                    <Icon name="sparkle" class="icon" aria-hidden="true" />
                </div>
                <p>{{ project.works }}</p>
            </section>

            <section v-if="project.images?.length" class="project-images">
                <div class="project-images__preview">
                    <button 
                        class="project-images__zoom-btn"
                        @click="openLightbox(0)"
                        aria-label="Agrandir l'image"
                    >
                        <ZoomIn class="icon" aria-hidden="true" />
                    </button>
                    
                    <img 
                        :src="project.images[0]" 
                        :alt="`${project.title} - Aperçu`"
                        class="project-images__main"
                        @click="openLightbox(0)"
                    />
                    
                    <div v-if="project.images.length > 1" class="project-images__count">
                        <span>{{ project.images.length }} photos</span>
                    </div>
                </div>
            </section>

            <VueEasyLightbox
                :visible="lightboxVisible"
                :imgs="project?.images || []"
                :index="lightboxIndex"
                @hide="closeLightbox"
            />
        </div>
    </div>
</template>
