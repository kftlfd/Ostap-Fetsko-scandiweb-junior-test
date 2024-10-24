const apiUrl = "http://localhost/api/";

export const productCategories = ["DVD", "Furniture", "Book"] as const;
export type ProductCategory = (typeof productCategories)[number];

export type ProductInfo = {
  id: number;
  sku: string;
  name: string;
  price: number;
  type: ProductCategory;
  size?: number;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
};

export type FormErrors = Partial<Record<keyof Omit<ProductInfo, "id">, string>>;

const delay = (time = 400, chance = 0.75) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() >= 1 - chance) {
        resolve();
      } else {
        reject(new Error("delay error"));
      }
    }, time);
  });

export async function getProductsList() {
  await delay();
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("api error");
  const data = await res.json();
  return data as ProductInfo[];
}

export async function addProduct(body: object) {
  await delay();
  const res = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (typeof data !== "object") {
    throw new Error(JSON.stringify(data));
  }

  return res.ok
    ? ([data as ProductInfo, null] as const)
    : ([null, data as FormErrors] as const);
}

export async function deleteProductsByIds(ids: number[]) {
  await delay();
  const res = await fetch(`${apiUrl}delete/`, {
    method: "POST",
    body: JSON.stringify(ids),
  });
  if (!res.ok) throw new Error(await res.text());
}
