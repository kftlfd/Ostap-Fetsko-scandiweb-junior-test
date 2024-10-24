<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";

import {
  productCategories,
  addProduct,
  FormErrors,
  ProductInfo,
} from "../../api";
import Header from "../../layout/Header.vue";
import Main from "../../layout/Main.vue";

const router = useRouter();

const formEl = useTemplateRef("form-ref");
const formError = ref<string | null>(null);
const formErrors = ref<FormErrors>({});

const values = ref<Required<Omit<ProductInfo, "id">>>({
  sku: "",
  name: "",
  price: 0,
  type: productCategories[0],
  size: 0,
  height: 0,
  width: 0,
  length: 0,
  weight: 0,
});

const handleSubmit = () => {
  if (!formEl.value) {
    console.warn("No form");
    return;
  }

  if (!formEl.value.checkValidity()) {
    formEl.value.reportValidity();
    return;
  }

  const formData = new FormData(formEl.value);
  formError.value = null;
  formErrors.value = {};

  addProduct(Object.fromEntries(formData))
    .then(([data, errors]) => {
      if (data !== null) {
        router.push("/");
      } else {
        formErrors.value = errors;
      }
    })
    .catch((err) => {
      console.error(err);
      formError.value = "Error add";
    });
};
</script>

<template>
  <Header title="Product Add">
    <template #right>
      <button @click="handleSubmit" class="btn">Save</button>
      <RouterLink class="btn" to="/">Cancel</RouterLink>
    </template>
  </Header>

  <Main>
    <div class="form-error">{{ formError }}</div>
    <form class="form" ref="form-ref">
      <label for="inp-sku">SKU</label>
      <div class="field">
        <input
          id="inp-sku"
          type="text"
          name="sku"
          placeholder="SKU"
          v-model.trim="values.sku"
          required
        />
        <span v-if="formErrors.sku" class="err">{{ formErrors.sku }}</span>
      </div>

      <label for="inp-name">Name</label>
      <div class="field">
        <input
          id="inp-name"
          type="text"
          name="name"
          placeholder="Name"
          v-model.trim="values.name"
        />
        <span v-if="formErrors.name" class="err">{{ formErrors.name }}</span>
      </div>

      <label for="inp-price">Price</label>
      <div class="field">
        <input
          id="inp-price"
          type="number"
          name="price"
          min="0"
          step="0.01"
          v-model="values.price"
        />
        <span v-if="formErrors.price" class="err">{{ formErrors.price }}</span>
      </div>

      <label for="inp-type">Type</label>
      <div class="field">
        <select id="inp-type" name="type" v-model="values.type">
          <option v-for="category in productCategories" :value="category">
            {{ category }}
          </option>
        </select>
        <span v-if="formErrors.type" class="err">{{ formErrors.type }}</span>
      </div>

      <template v-if="values.type === 'DVD'">
        <label for="inp-size">Size (MB)</label>
        <div class="field">
          <input
            id="inp-size"
            type="number"
            name="size"
            min="0"
            step="0.01"
            v-model="values.size"
          />
          <span v-if="formErrors.size" class="err">{{ formErrors.size }}</span>
        </div>
      </template>

      <template v-if="values.type === 'Furniture'">
        <label for="inp-height">Height (CM)</label>
        <div class="field">
          <input
            id="inp-height"
            type="number"
            name="height"
            min="0"
            step="0.01"
            v-model="values.height"
          />
          <span v-if="formErrors.height" class="err">{{
            formErrors.height
          }}</span>
        </div>

        <label for="inp-width">Width (CM)</label>
        <div class="field">
          <input
            id="inp-width"
            type="number"
            name="width"
            min="0"
            step="0.01"
            v-model="values.width"
          />
          <span v-if="formErrors.width" class="err">{{
            formErrors.width
          }}</span>
        </div>

        <label for="inp-length">Length (CM)</label>
        <div class="field">
          <input
            id="inp-length"
            type="number"
            name="length"
            min="0"
            step="0.01"
            v-model="values.length"
          />
          <span v-if="formErrors.length" class="err">{{
            formErrors.length
          }}</span>
        </div>
      </template>

      <template v-if="values.type === 'Book'">
        <label for="inp-weight">Weight (KG)</label>
        <div class="field">
          <input
            id="inp-weight"
            type="number"
            name="weight"
            min="0"
            step="0.01"
            v-model="values.weight"
          />
          <span v-if="formErrors.weight" class="err">{{
            formErrors.weight
          }}</span>
        </div>
      </template>
    </form>
  </Main>
</template>

<style scoped>
.form-error {
  font-size: 1.2rem;
  color: tomato;
  padding-bottom: 0.5rem;
}

.form {
  display: grid;
  grid-template-columns: 100px 1fr;
  column-gap: 2rem;
  row-gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-width: 500px;
}

input,
select {
  padding: 5px 8px;
}

.err {
  color: tomato;
  font-weight: 600;
  font-size: 0.9rem;
}
</style>
