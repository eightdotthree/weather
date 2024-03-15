<template>
  <figure>
    <p
      v-if="showTime"
      class="text-sm text-gray-400">

      {{ day.formatedStartTime }}
    </p>

    <p class="text-4xl">
      {{ day.temperature }}&deg;
    </p>
  </figure>
</template>

<script setup>
  const props = defineProps({
    day: Object,
    showTime: Boolean
  });
</script>
