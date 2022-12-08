const apiUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost/api/"
    : window.origin + "/api/";

export const categories = ["DVD", "Furniture", "Book"] as const;
export type ProductCategory = typeof categories[number];

export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  type: ProductCategory;
  size?: number;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
};

export async function loadProducts() {
  const respond = await fetch(apiUrl);
  return respond.json();
}

export async function deleteProducts(ids: number[]) {
  return fetch(apiUrl + "delete/", {
    method: "POST",
    body: JSON.stringify(ids),
  });
}

export async function saveProduct(product: any) {
  return fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(product),
  });
}
