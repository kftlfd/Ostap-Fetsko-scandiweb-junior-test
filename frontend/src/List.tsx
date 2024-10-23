import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { ProductInfo, ProductCategory } from "./api";
import { getProductsList, deleteProducts } from "./api";
import { Header, Main } from "./Layout";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

type ListState = {
  error: null | string;
  loading: boolean;
  data: ProductInfo[];
};

export default function List() {
  const [state, setState] = useState<ListState>({
    error: null,
    loading: true,
    data: [],
  });

  const fetchProducts = () => {
    setState({ loading: true, error: null, data: [] });
    getProductsList()
      .then((res) => {
        setState({
          loading: false,
          error: null,
          data: res.sort((a, b) => b.id - a.id),
        });
      })
      .catch((err: Error) => {
        setState({
          loading: false,
          error: "Failed to load",
          data: [],
        });
        console.error(err);
      });
  };

  const handleDelete = () => {
    let deleteIds: number[] = [];

    document.querySelectorAll(".delete-checkbox").forEach((el: Element) => {
      if (el instanceof HTMLInputElement && el.checked) {
        deleteIds.push(Number(el.value));
      }
    });

    if (deleteIds.length < 1) return;

    deleteProducts(deleteIds)
      .then(() =>
        setState((prev) => ({
          ...prev,
          data: prev.data.filter((p) => !deleteIds.includes(p.id)),
        }))
      )
      .catch((err) => {
        alert("Error");
        console.error(err);
      });
  };

  useEffect(() => {
    document.title = "Products List";
    fetchProducts();
  }, []);

  return (
    <>
      <Header
        heading="Products List"
        middle={
          <button
            className="refresh-btn"
            aria-label="Refresh"
            disabled={state.loading}
            onClick={fetchProducts}
          />
        }
        buttons={
          <>
            <Link to="/add-product" className="btn">
              ADD
            </Link>
            <button className="btn" onClick={handleDelete}>
              MASS DELETE
            </button>
          </>
        }
      />

      <Main>
        {state.loading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            {state.error && <h3>{state.error}</h3>}
            <ProductsGrid products={state.data} />
          </>
        )}
      </Main>
    </>
  );
}

type ProductDescriptionComponent = FC<{ p: ProductInfo }>;

const DVDDescription: ProductDescriptionComponent = ({ p }) => (
  <div>Size: {p.size} MB</div>
);

const FurnitureDescription: ProductDescriptionComponent = ({ p }) => (
  <div>
    Dimensions: {p.height}x{p.width}x{p.length}
  </div>
);

const BookDescription: ProductDescriptionComponent = ({ p }) => (
  <div>Weight: {p.weight}KG</div>
);

const productDescriptions: Record<
  ProductCategory,
  ProductDescriptionComponent
> = {
  DVD: DVDDescription,
  Furniture: FurnitureDescription,
  Book: BookDescription,
};

function ProductsGrid(props: { products: ProductInfo[] }) {
  return (
    <>
      {props.products.length < 1 ? (
        <h3>No products</h3>
      ) : (
        <div className="productGrid">
          {props.products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </>
  );
}

function ProductCard(props: { p: ProductInfo }) {
  const Description = productDescriptions[props.p.type];

  return (
    <div className="product">
      <input
        id={"delete-" + props.p.id}
        type={"checkbox"}
        className={"delete-checkbox"}
        value={props.p.id}
      />
      <label
        htmlFor={"delete-" + props.p.id}
        className={"delete-checkbox-label"}
      >
        Delete product with ID {props.p.id}
      </label>
      <div>{props.p.sku}</div>
      <div>{props.p.name}</div>
      <div>{currencyFormatter.format(props.p.price)}</div>
      <Description p={props.p} />
    </div>
  );
}
