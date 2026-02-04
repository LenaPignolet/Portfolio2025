<script setup>
import Icon from '../components/Icon.vue';
import {
	Brush,
	Lightbulb,
	Palette,
	Zap,
	Users,
	TrendingUp
} from 'lucide-vue-next';

const technicalSkills = [
    {
        title: 'Frontend',
        skills: [
            { name: 'HTML', logo: '/logos/html5.svg' },
            { name: 'CSS / SCSS', logo: '/logos/css.svg' },
            { name: 'JavaScript', logo: '/logos/javascript.svg' },
            { name: 'Vue.js', logo: '/logos/vuejs.svg' },
            { name: 'React', logo: '/logos/react.svg' },
            { name: 'Tailwind CSS', logo: '/logos/tailwindcss.svg' },
            { name: 'Bootstrap', logo: '/logos/bootstrap.svg' },
            { name: 'Astro', logo: '/logos/astro.svg' }
        ]
    },
    {
        title: 'Backend',
        skills: [
            { name: 'PHP', logo: '/logos/php.svg' },
            { name: 'Symfony', logo: '/logos/symfony.svg' },
            { name: 'MySQL', logo: '/logos/mysql.svg' },
            { name: 'API Platform', logo: '/logos/apiplatform.svg' }
        ]
    },
    {
        title: 'E-commerce',
        skills: [
            { name: 'Magento 2', logo: '/logos/magento.svg' },
			{ name: 'Hyvä', logo: '/logos/hyva.svg' }
        ]
    },
    {
        title: 'Outils & Workflow',
        skills: [
            { name: 'Git', logo: '/logos/git.svg' },
            { name: 'GitLab', logo: '/logos/gitlab.svg' },
			{ name: 'GitHub', logo: '/logos/github.svg' },
            { name: 'Docker', logo: '/logos/docker.svg' },
            { name: 'Figma', logo: '/logos/figma.svg' }
        ]
    }
];

const softSkills = [
    {
        title: 'Design',
        skills: [
			{ name: 'Photoshop', logo: '/logos/photoshop.svg' },
            { name: 'Illustrator', logo: '/logos/illustrator.svg' },
			{ name: 'Lightroom', logo: '/logos/lightroom.svg' },
            { name: 'Clip Studio Paint', logo: '/logos/clipstudiopaint.svg' },
            { name: 'Illustration digitale & traditionnelle', icon: Brush }
        ]
    },
    {
        title: 'Soft Skills',
        skills: [
			{ name: 'Curiosité', icon: Lightbulb },
            { name: 'Créativité', icon: Palette },
			{ name: 'Autonomie', icon: Zap },
            { name: 'Esprit d\'équipe', icon: Users },
            { name: 'Force de proposition', icon: TrendingUp }
        ]
    }
];
</script>

<template>
    <div class="page skills">
        <div class="section header">
            <div class="header__title--wrapper">
                <Icon name="sparkle" class="icon" aria-hidden="true" />
                <h1 class="header__title">Compétences</h1>
                <Icon name="sparkle" class="icon" aria-hidden="true" />
            </div>
            <p class="header__subtitle">
                Un aperçu des outils et technologies que j'utilise au quotidien
            </p>
        </div>

        <div 
            v-for="category in technicalSkills" 
            :key="category.title" 
            class="section skill-category"
        >
            <div class="section__title-container">
                <Icon name="sparkle" class="icon" aria-hidden="true" />
                <h3 class="section__title">{{ category.title }}</h3>
                <Icon name="sparkle" class="icon" aria-hidden="true" />
            </div>

            <div class="skills-grid skills-grid--technical">
                <div 
                    v-for="skill in category.skills"
                    :key="skill.name"
                    class="skill-card skill-card--technical"
                >
                    <img
                        v-if="typeof skill.logo === 'string'"
                        :src="skill.logo"
                        :alt="`Logo ${skill.name}`"
                        class="skill-card__logo"
                    />

                    <component
                        v-else-if="skill.logo || skill.icon"
                        :is="skill.icon ?? skill.logo"
                        class="skill-card__icon"
                    />

                    <span class="skill-card__name">{{ skill.name }}</span>
                </div>
            </div>
        </div>

        <div 
            v-for="category in softSkills" 
            :key="category.title" 
            class="section skill-category"
        >
            <div class="section__title-container">
                <Icon name="sparkle" class="icon" aria-hidden="true" />
                <h3 class="section__title">{{ category.title }}</h3>
                <Icon name="sparkle" class="icon" aria-hidden="true" />
            </div>

            <div class="skills-grid skills-grid--soft">
                <div 
                    v-for="skill in category.skills"
                    :key="skill.name"
                    class="skill-card skill-card--soft"
                >
                    <img
                        v-if="typeof skill.logo === 'string'"
                        :src="skill.logo"
                        :alt="`Logo ${skill.name}`"
                        class="skill-card__logo"
                    />

                    <component
                        v-else-if="skill.icon"
                        :is="skill.icon"
                        class="skill-card__icon"
                    />
                    <span class="skill-card__name">{{ skill.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
