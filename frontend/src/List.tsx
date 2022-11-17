import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import type { ProductInfo } from "./api";
import { getProductsList, deleteProducts } from "./api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export default function List() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<ProductInfo[]>([]);

  useEffect(() => {
    document.title = "Product List";
    fetchProducts();
  }, []);

  function fetchProducts() {
    getProductsList()
      .then((res) => {
        setData(res.sort((a, b) => b.id - a.id));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError("Failed to load");
        console.error(err);
      });
  }

  function handleDelete() {
    let deleteIds: number[] = [];

    document.querySelectorAll(".delete-checkbox").forEach((el: Element) => {
      if (el instanceof HTMLInputElement && el.checked) {
        deleteIds.push(Number(el.value));
      }
    });

    if (deleteIds.length < 1) return;

    deleteProducts(deleteIds)
      .then(() =>
        setData((prev) => prev.filter((p) => !deleteIds.includes(p.id)))
      )
      .catch((err) => console.error(err));
  }

  function refresh() {
    setLoading(true);
    fetchProducts();
  }

  return (
    <>
      <header>
        <h1 className="heading">Product List</h1>
        <div className="middle">
          <button className="refresh-btn" onClick={refresh} />
        </div>
        <div className="buttons">
          <Link to="/add-product" className="btn">
            ADD
          </Link>
          <button className="btn" onClick={handleDelete}>
            MASS DELETE
          </button>
        </div>
      </header>

      <main>
        {error ? (
          <h3>{error}</h3>
        ) : loading ? (
          <h3>Loading...</h3>
        ) : (
          <div className="productGrid">
            {data.map((p) => (
              <div key={p.sku} className="product">
                <input
                  type={"checkbox"}
                  className={"delete-checkbox"}
                  value={p.id}
                />
                <div>{p.sku}</div>
                <div>{p.name}</div>
                <div>{currencyFormatter.format(p.price)}</div>
                {p.type === "DVD" && <div>Size: {p.size} MB</div>}
                {p.type === "Furniture" && (
                  <div>
                    Dimensions: {p.width}x{p.height}x{p.length}
                  </div>
                )}
                {p.type === "Book" && <div>Weight: {p.weight}KG</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
