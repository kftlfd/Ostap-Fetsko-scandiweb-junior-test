import axios, { AxiosError } from "axios";

const apiUrl =
  process.env.NODE_ENV === "production"
    ? `${window.location.origin}/api/`
    : `${window.location.protocol}//${window.location.hostname}/api/`;

export type ProductCategory = "DVD" | "Furniture" | "Book";

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
    const res = await axios.delete(apiUrl, { data: ids });
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data);
    } else {
      throw new Error("Unknown error: " + err);
    }
  }
}

export async function addProduct(body: any) {
  try {
    await axios.post(apiUrl, body);
  } catch (err) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    } else {
      throw new Error("Unknown error");
    }
  }
}
