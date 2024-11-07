<script lang="ts">
  import { invalidate } from '$app/navigation';

  import { urls } from '$lib/api.js';
  import Header from '$lib/Header.svelte';

  const { data } = $props();

  let refetching = $state(false);

  const refresh = () => {
    refetching = true;
    invalidate(urls.list).finally(() => {
      setTimeout(() => {
        refetching = false;
      }, 500);
    });
  };
</script>

<svelte:head>
  <title>Products List</title>
  <meta name="description" content="Products List" />
</svelte:head>

<form method="POST" action="?/delete" style="display: contents;">
  <Header title="Products List">
    {#snippet left()}
      <button type="button" onclick={refresh}>Refresh</button>
    {/snippet}
    {#snippet right()}
      <a href="/add">Add</a>
      <button type="submit">Mass delete</button>
    {/snippet}
  </Header>

  <main>
    <div class="products-grid min-h-48">
      {#each data.products as product (product.id)}
        <div class="product-card">
          <input type="checkbox" name="id" value={product.id} />
          <div>id: {product.id}</div>
          <div>sku: {product.sku}</div>
          <div>price: ${product.price.toFixed(2)}</div>
          {#if product.type === 'DVD'}
            <div>size: {product.size} MB</div>
          {:else if product.type === 'Furniture'}
            <div>dimensions: {product.width} x {product.height} x {product.length} CM</div>
          {:else if product.type === 'Book'}
            <div>weight: {product.weight} KG</div>
          {/if}
        </div>
      {/each}
      {#if data.error}
        <div class="loader">
          <div class="loader-msg">
            {JSON.stringify(data.error)}
          </div>
        </div>
      {/if}
      {#if refetching}
        <div class="loader">
          <div class="loader-msg">Loading...</div>
        </div>
      {/if}
    </div>
  </main>
</form>

<style>
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1rem;
    position: relative;
  }

  .loader {
    position: absolute;
    inset: 0;
    margin: -5px;
    backdrop-filter: blur(5px);
    display: grid;
    place-content: center;
  }

  .loader-msg {
    background-color: white;
    padding: 1rem;
    border-radius: 5px;
    border: 1px solid gray;
  }

  .product-card {
    border: 1px solid gray;
    border-radius: 5px;
    padding: 1rem;
    background-color: white;
    position: relative;
  }

  .product-card input[type='checkbox'][name='id'] {
    position: absolute;
    top: 8px;
    right: 8px;
  }
</style>
