<script setup>
defineProps({
    name: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <svg v-if="name === 'sparkle'" viewBox="0 0 92 92" fill="none" aria-hidden="true">
        <path
            d="M46 0C46 25.4051 66.5949 46 92 46C66.5949 46 46 66.5949 46 92C46 66.5949 25.4051 46 0 46C25.4051 46 46 25.4051 46 0Z"
            fill="currentColor"
        />
    </svg>
    <svg v-else-if="name === 'arrow-top-right'" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="25" y1="4.37114e-08" x2="25" y2="24" stroke="currentColor" stroke-width="2" />
        <line x1="24" y1="1" x2="-8.74228e-08" y2="0.999998" stroke="currentColor" stroke-width="2" />
        <line x1="24.7071" y1="0.707107" x2="0.707108" y2="24.7071" stroke="currentColor" stroke-width="2" />
    </svg>
</template>
