<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    left?: Snippet;
    right: Snippet;
  };
  const { title, left, right }: Props = $props();
</script>

<header>
  <h1>{title}</h1>
  {@render left?.()}
  <div class="spacer"></div>
  {@render right()}
</header>

<style>
  header {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding-block: 1rem;
    border-bottom: 1px solid gray;
  }

  h1 {
    margin: 0;
  }

  .spacer {
    flex-grow: 1;
  }
</style>
