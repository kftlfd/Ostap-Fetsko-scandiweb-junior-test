const baseUrl =
  process.env.NODE_ENV === "production"
    ? `${window.location.origin}/api/`
    : `${window.location.protocol}//${window.location.hostname}/api/`;

const listUrl = baseUrl + "list.php";
const deleteUrl = baseUrl + "delete.php";
const addUrl = baseUrl + "add.php";

export type ProductType = "DVD" | "Furniture" | "Book";

export type ProductInfo = {
  id: string;
  sku: string;
  name: string;
  price: string;
  type: ProductType;
  size?: string;
  width?: string;
  height?: string;
  length?: string;
  weight?: string;
};

export async function listQuery(): Promise<ProductInfo[]> {
  const res = await fetch(listUrl, {
    method: "GET",
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(await res.text());
  }
}

export async function deleteQuery(body: number[]) {
  const res = await fetch(deleteUrl, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function addQuery(body: any) {
  const res = await fetch(addUrl, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error(await res.text());
  }
}
