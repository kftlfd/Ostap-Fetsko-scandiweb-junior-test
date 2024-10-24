<script setup lang="ts">
import { computed, onMounted } from "vue";

import Header from "../../layout/Header.vue";
import Main from "../../layout/Main.vue";

import {
  data,
  initLoaded,
  loading,
  loadingError,
  deleting,
  deletingError,
  delIds,
  fetchProducts,
  deleteProducts,
} from "./useProducts";
import ProductCard from "./ProductCard.vue";

onMounted(() => {
  fetchProducts();
});

const showLoader = computed(
  () =>
    loading.value ||
    !!loadingError.value ||
    deleting.value ||
    !!deletingError.value
);

const onDelete = () => {
  if (delIds.value.length < 1) return;
  deleteProducts(delIds.value)
    .then(() => {
      delIds.value = [];
      fetchProducts();
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

<template>
  <Header title="Products List">
    <template #left>
      <button class="btn" @click="fetchProducts">Refresh</button>
    </template>
    <template #right>
      <RouterLink class="btn" to="/add">Add</RouterLink>
      <button class="btn" @click="onDelete">Mass delete</button>
    </template>
  </Header>

  <Main>
    <div class="grid">
      <h2 v-if="initLoaded && data.length < 1" class="empty-msg">
        No products
      </h2>

      <ProductCard v-for="product in data" :product="product" />

      <div v-if="showLoader" class="loader">
        <div class="loader-msg-container">
          <div v-if="loading || deleting" class="loader-msg">Loading...</div>
          <div v-else-if="loadingError" class="loader-msg">
            <div class="error-msg">{{ loadingError }}</div>
            <button class="btn" @click="fetchProducts">Retry</button>
          </div>
          <div v-else-if="deletingError" class="loader-msg">
            <div class="error-msg">{{ deletingError }}</div>
            <button class="btn" @click="deletingError = null">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </Main>
</template>

<style scoped>
.empty-msg {
  text-align: center;
  margin-block: 2rem;
  position: absolute;
  inset: 0;
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
}

.loader {
  position: absolute;
  inset: -5px;
  backdrop-filter: blur(2px);
  min-height: 150px;
}

.loader-msg-container {
  height: 500px;
  max-height: min(100%, 100vh);
  position: sticky;
  top: 0;
  display: grid;
  place-content: center;
  font-size: 1.2rem;
}

.loader-msg {
  --background: var(--bg-color, #fff);
  background-color: var(--background);
  padding: 2rem;
  border-radius: 5px;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.error-msg {
  color: tomato;
  font-weight: 600;
}
</style>
