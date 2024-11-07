<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<div class="app">
  {@render children()}

  <footer class="border-t border-solid border-gray-500 py-4">
    <p>footer</p>
  </footer>
</div>
