<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { clearProjectsCache, getProjects } from '../utils/notion.js';
    import Icon from '../components/Icon.vue';

    const emit = defineEmits(['select-project']);

    const projects = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const selectedFilter = ref('all');

    const uniqueFilters = computed(() => {
        const filters = new Set();
        projects.value.forEach((project) => {
            project.filters?.forEach((filter) => filters.add(filter));
        });
        return Array.from(filters).sort();
    });

    const filteredProjects = computed(() => {
        if (selectedFilter.value === 'all') {
            return projects.value;
        }
        return projects.value.filter((project) => project.filters?.includes(selectedFilter.value));
    });

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
        });
    }

    function selectProject(event, projectId) {
        event.preventDefault();
        emit('select-project', projectId);
    }

    onMounted(async () => {
        try {
            projects.value = await getProjects();

            if (projects.value.length === 0) {
                error.value = 'Aucun projet trouvé.';
            }
        } catch (err) {
            console.error('Erreur:', err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    });
</script>

<template>
    <div class="page projects">
        <div class="section header">
            <div class="header__title--wrapper">
                <Icon name="sparkle" class="icon" aria-hidden="true" />
                <h1 class="header__title">Projets</h1>
                <Icon name="sparkle" class="icon" aria-hidden="true" />
            </div>
            <p class="header__subtitle">Découvrez mes réalisations</p>
        </div>

        <div class="section filters">
            <div class="filters__list">
                <button
                    class="filter-btn"
                    :class="{ 'filter-btn--active': selectedFilter === 'all' }"
                    @click="selectedFilter = 'all'"
                >
                    Tout
                </button>
                <button
                    v-for="filter in uniqueFilters"
                    :key="filter"
                    class="filter-btn"
                    :class="{ 'filter-btn--active': selectedFilter === filter }"
                    @click="selectedFilter = filter"
                >
                    {{ filter }}
                </button>
            </div>
        </div>

        <div v-if="loading" class="section loading">
            <p>Chargement des projets...</p>
        </div>

        <div v-else-if="error" class="section error">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="filteredProjects.length === 0" class="section empty">
            <p>Aucun projet trouvé.</p>
        </div>

        <div v-else class="projects-grid">
            <article v-for="project in filteredProjects" :key="project.id" class="project-card">
                <div v-if="project.images?.length" class="project-card__image-wrapper">
                    <img :src="project.images[0]" :alt="project.title" class="project-card__image" />
                </div>

                <div class="project-card__content">
                    <a 
                        href="#" 
                        class="project-card__cta" 
                        @click="selectProject($event, project.id)"
                        :aria-label="`Voir les détails du projet ${project.title}`"
                    >
                        <Icon name="arrow-top-right" class="icon" aria-hidden="true" />
                    </a>

                    <div class="project-card__skills" v-if="project.skills?.length">
                        <span v-for="skill in project.skills" :key="skill" class="skill-tag">
                            {{ skill }}
                        </span>
                    </div>

                    <h2 class="project-card__title">{{ project.title }}</h2>

                    <p v-if="project.date" class="project-card__date">{{ formatDate(project.date) }}</p>

                    <div v-if="project.filters?.length > 1" class="project-card__filters">
                        <span v-for="filter in project.filters.slice(1)" :key="filter" class="filter">
                            {{ filter }}
                        </span>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>
