<script setup lang="ts">
import { ProductInfo } from "../../api";
import { delIds } from "./useProducts";

defineProps<{
  product: ProductInfo;
}>();
</script>

<template>
  <div class="card">
    <input class="check" type="checkbox" :value="product.id" v-model="delIds" />
    <div><span class="label">ID:</span> {{ product.id }}</div>
    <div><span class="label">SKU:</span> {{ product.name }}</div>
    <div><span class="label">Name:</span> {{ product.price }}</div>
    <div><span class="label">Type:</span> {{ product.type }}</div>

    <template v-if="product.type === 'DVD'">
      <div><span class="label">Size:</span> {{ product.size }} (MB)</div>
    </template>

    <template v-if="product.type === 'Furniture'">
      <div>
        <span class="label">Dimensions:</span> {{ product.height }}x{{
          product.width
        }}x{{ product.length }}
        (CM)
      </div>
    </template>

    <template v-if="product.type === 'Book'">
      <div><span class="label">Weight:</span> {{ product.weight }} (KG)</div>
    </template>
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  position: relative;
}

.check {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  /* opacity: 0; */
  transition: opacity 0.3s ease;
}
.card:hover .check,
.check:checked {
  opacity: 1;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
