import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import type { ProductInfo } from "./api";
import { listQuery, deleteQuery } from "./api";

export default function List() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<ProductInfo[]>([]);

  useEffect(() => {
    document.title = "Product List";

    listQuery()
      .then((res) => {
        setData(res.sort((a, b) => Number(b.id) - Number(a.id)));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        console.error(err);
      });
  }, []);

  function handleDelete() {
    let deleteIds: number[] = [];

    document.querySelectorAll(".delete-checkbox").forEach((el: Element) => {
      if (el instanceof HTMLInputElement && el.checked) {
        deleteIds.push(Number(el.value));
      }
    });

    deleteQuery(deleteIds)
      .then(() =>
        setData((prev) => {
          console.log(prev);
          const filtered = prev.filter(
            (p) => !deleteIds.includes(Number(p.id))
          );
          console.log(filtered);
          return filtered;
        })
      )
      .catch((err) => console.error(err));
  }

  return (
    <>
      <header>
        <h1 className="heading">Product List</h1>
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
                <p>{p.sku}</p>
                <p>{p.name}</p>
                <p>{p.price} $</p>
                {p.type === "DVD" && <p>Size: {p.size} MB</p>}
                {p.type === "Furniture" && (
                  <p>
                    Dimensions: {p.width}x{p.height}x{p.length}
                  </p>
                )}
                {p.type === "Book" && <p>Weight: {p.weight}KG</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
