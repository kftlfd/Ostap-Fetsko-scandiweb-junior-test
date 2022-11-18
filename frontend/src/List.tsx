import React from "react";
import { Link } from "react-router-dom";

import type { ProductInfo, ProductCategory } from "./api";
import { getProductsList, deleteProducts } from "./api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

type ListProps = {};

type ListState = {
  error: null | string;
  loading: boolean;
  data: ProductInfo[];
};

type ProductDescriptions = {
  [K in ProductCategory]: (p: ProductInfo) => React.ReactNode;
};

export default class List extends React.Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      data: [],
    };
  }

  componentDidMount(): void {
    document.title = "Products List";
    this.fetchProducts();
  }

  fetchProducts = () => {
    getProductsList()
      .then((res) => {
        this.setState({
          loading: false,
          data: res.sort((a, b) => b.id - a.id),
        });
      })
      .catch((err: Error) => {
        this.setState({ error: "Failed to load" });
        console.error(err);
      });
  };

  handleDelete = () => {
    let deleteIds: number[] = [];

    document.querySelectorAll(".delete-checkbox").forEach((el: Element) => {
      if (el instanceof HTMLInputElement && el.checked) {
        deleteIds.push(Number(el.value));
      }
    });

    if (deleteIds.length < 1) return;

    deleteProducts(deleteIds)
      .then(() =>
        this.setState((prev) => ({
          data: prev.data.filter((p) => !deleteIds.includes(p.id)),
        }))
      )
      .catch((err) => console.error(err));
  };

  handleRefresh = () => {
    this.setState({ loading: true });
    this.fetchProducts();
  };

  renderHeader = () => (
    <header>
      <h1 className="heading">Product List</h1>

      <div className="middle">
        <button className="refresh-btn" onClick={this.handleRefresh} />
      </div>

      <div className="buttons">
        <Link to="/add-product" className="btn">
          ADD
        </Link>

        <button className="btn" onClick={this.handleDelete}>
          MASS DELETE
        </button>
      </div>
    </header>
  );

  renderMain = () => (
    <main>
      {this.state.error ? (
        <h3>{this.state.error}</h3>
      ) : this.state.loading ? (
        <h3>Loading...</h3>
      ) : (
        this.renderProductsGrid()
      )}
    </main>
  );

  renderProductsGrid = () => (
    <div className="productGrid">
      {this.state.data.map((p) => (
        <div key={p.sku} className="product">
          <input type={"checkbox"} className={"delete-checkbox"} value={p.id} />
          <div>{p.sku}</div>
          <div>{p.name}</div>
          <div>{currencyFormatter.format(p.price)}</div>
          {this.productDescriptions[p.type](p)}
        </div>
      ))}
    </div>
  );

  productDescriptions: ProductDescriptions = {
    DVD: (p: ProductInfo) => <div>Size: {p.size} MB</div>,
    Furniture: (p: ProductInfo) => (
      <div>
        Dimensions: {p.width}x{p.height}x{p.length}
      </div>
    ),
    Book: (p: ProductInfo) => <div>Weight: {p.weight}KG</div>,
  };

  render(): React.ReactNode {
    return (
      <>
        {this.renderHeader()}
        {this.renderMain()}
      </>
    );
  }
}
