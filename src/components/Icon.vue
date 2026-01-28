<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <svg v-if="name === 'sparkle'"
       viewBox="0 0 92 92"
       fill="none"
       aria-hidden="true">
    <path d="M46 0C46 25.4051 66.5949 46 92 46C66.5949 46 46 66.5949 46 92C46 66.5949 25.4051 46 0 46C25.4051 46 46 25.4051 46 0Z"
          fill="currentColor" />
  </svg>
</template>
