import { urls } from '$lib/api.js';
import type { Product } from '$lib/models.js';

export const load = async ({ fetch }) => {
  try {
    const products = await fetch(urls.list).then((res) => res.json() as Promise<Product[]>);
    return { products };
  } catch (err) {
    return { products: [], error: err };
  }
};
