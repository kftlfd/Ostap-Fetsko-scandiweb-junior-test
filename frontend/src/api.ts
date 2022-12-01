import axios, { AxiosError } from "axios";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? `${window.location.origin}/api/`
    : `${window.location.protocol}//${window.location.hostname}/api/`;

export const productCategories = ["DVD", "Furniture", "Book"] as const;
export type ProductCategory = typeof productCategories[number];

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

export async function getProductsList() {
  try {
    const res = await axios.get<ProductInfo[]>(apiUrl);
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data);
    } else {
      throw new Error("Unknown error: " + err);
    }
  }
}

export async function deleteProducts(ids: number[]) {
  try {
    // const res = await axios.delete(apiUrl, { data: ids });
    // Hosting provider blocks DELETE request method, so redirecting them through POST
    const res = await axios.post(apiUrl + "delete/", ids);
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data);
    } else {
      console.error(err);
      throw new Error("API Error");
    }
  }
}

export async function addProduct(body: any) {
  try {
    const res = await axios.post(apiUrl, body);
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 400) {
      throw new InvalidFormError(err.response?.data);
    } else {
      console.error(err);
      throw new Error("API error");
    }
  }
}

export class InvalidFormError extends Error {
  errors: {};
  constructor(errors: {}) {
    super("Form Errors");
    this.errors = errors;
  }
  getErrors() {
    return this.errors;
  }
}
