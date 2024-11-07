<script lang="ts">
  import type { Category } from '$lib/models';
  import Header from '$lib/Header.svelte';

  let category = $state<Category>('DVD');

  const categories: Category[] = ['DVD', 'Furniture', 'Book'];
</script>

<svelte:head>
  <title>Product Add</title>
  <meta name="description" content="Add product" />
</svelte:head>

<form method="POST" style="display: contents;">
  <Header title="Product Add">
    {#snippet right()}
      <div class="flex items-center gap-4">
        <button type="submit">Save</button>
        <a href="/">Cancel</a>
      </div>
    {/snippet}
  </Header>

  <main>
    <div class="flex flex-col gap-4">
      <label>
        <span>SKU</span>
        <input type="text" name="sku" />
      </label>
      <label>
        <span>Name</span>
        <input type="text" name="name" />
      </label>
      <label>
        <span>price</span>
        <input type="number" name="price" />
      </label>

      <label>
        <span>Category</span>
        <select name="type" bind:value={category}>
          {#each categories as cat (cat)}
            <option value={cat}>{cat}</option>
          {/each}
        </select>
      </label>

      {#if category === 'DVD'}
        <label>
          <span>Size</span>
          <input type="number" name="size" />
        </label>
      {:else if category === 'Furniture'}
        <label>
          <span>Width</span>
          <input type="number" name="width" />
        </label>
        <label>
          <span>Height</span>
          <input type="number" name="height" />
        </label>
        <label>
          <span>Length</span>
          <input type="number" name="length" />
        </label>
      {:else if category === 'Book'}
        <label>
          <span>Weight</span>
          <input type="number" name="weight" />
        </label>
      {/if}
    </div>
  </main>
</form>

<style>
  label {
    display: grid;
    grid-template-columns: 100px 400px;
  }
  input,
  select {
    padding: 4px 8px;
  }
</style>
