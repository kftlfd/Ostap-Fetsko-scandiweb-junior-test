<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps<{
  title: string;
}>();

onMounted(() => {
  document.title = props.title;
});
</script>

<template>
  <header class="header flex">
    <h1 class="heading">{{ title }}</h1>
    <div class="flex">
      <slot name="left"></slot>
    </div>
    <div class="spacer"></div>
    <div class="flex">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding-block: 1rem;
  border-bottom: 1px solid gray;
  flex-wrap: wrap;
}

.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.heading {
  margin: 0;
}

.spacer {
  flex-grow: 1;
}
</style>
