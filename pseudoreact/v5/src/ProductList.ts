import Nodes, { RouterLink } from "nodes";
import { state, dispatch } from "./state";
import type { Product, ProductCategory } from "./api";
import { loadProducts, deleteProducts } from "./api";
import { routerLinks } from "./App";

export const ProductList: Nodes.Component<{}> = () => {
  document.title = "Product List";

  if (state.ProductListPage.loading) fetchProducts();

  function fetchProducts() {
    loadProducts()
      .then((res) => {
        dispatch({
          ProductListPage: { loading: false, error: null, data: res },
        });
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          ProductListPage: { loading: false, error: "Failed to load products" },
        });
      });
  }

  function handleRefresh() {
    dispatch({ ProductListPage: { loading: true } });
  }

  function handleDelete() {
    const ids: number[] = [];

    const toDelete: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input.delete-checkbox:checked"
    );
    if (toDelete.length < 1) return;
    toDelete.forEach((el) => ids.push(Number(el.value)));

    deleteProducts(ids)
      .then((res) => {
        if (res.ok) {
          toDelete.forEach((el) => el.parentElement?.remove());
        } else {
          res.text().then((err) => window.alert(err));
        }
      })
      .catch((err) => {
        console.error(err);
        window.alert("Network error. See logs in console for more info.");
      });
  }

  const Error: Nodes.Component<{}> = () => {
    return Nodes.h3({ text: "Error: " + state.ProductListPage.error });
  };

  const Loading: Nodes.Component<{}> = () => {
    return Nodes.h3({ text: "Loading..." });
  };

  const Empty: Nodes.Component<{}> = () => {
    return Nodes.h3({ text: "No products" });
  };

  const ProductsGrid: Nodes.Component<{}> = () => {
    const products = state.ProductListPage.data
      .sort((a, b) => b.id - a.id)
      .map((p) => Product({ product: p }));

    return Nodes.div({ className: "productsGrid" }, products);
  };

  return [
    Nodes.header({}, [
      Nodes.h3({ text: "Product List", className: "heading" }),
      Nodes.div({ className: "middle" }, [
        Nodes.button(
          {
            text: "",
            className: "refresh-btn",
            onClick: handleRefresh,
          },
          [Nodes.img({ src: "/refresh.svg" })]
        ),
      ]),
      Nodes.div({ className: "right" }, [
        RouterLink({
          href: routerLinks.productForm,
          text: "ADD",
          className: "btn",
        }),
        Nodes.button({
          text: "MASS DELETE",
          className: "btn btn-danger",
          onClick: handleDelete,
        }),
      ]),
    ]),

    Nodes.main(
      {},
      state.ProductListPage.error
        ? Error({})
        : state.ProductListPage.loading
        ? Loading({})
        : state.ProductListPage.data.length < 1
        ? Empty({})
        : ProductsGrid({})
    ),
  ];
};

const Product: Nodes.Component<{ product: Product }> = (props) => {
  const p = props.product;

  const checkId = `checkbox${p.id}`;

  const descriptions: {
    [category in ProductCategory]: (p: Product) => string;
  } = {
    DVD: (p) => `Size: ${p.size} MB`,
    Book: (p) => `Weight: ${p.weight} KG`,
    Furniture: (p) => `Dimensions: ${p.height}x${p.width}x${p.length} CM`,
  };

  return Nodes.div({ className: "product" }, [
    Nodes.input({
      id: checkId,
      name: checkId,
      value: p.id,
      type: "checkbox",
      className: "delete-checkbox",
    }),
    Nodes.label({
      htmlFor: checkId,
      text: `Delete product with ID ${p.id}`,
      className: "delete-checkbox-label",
    }),

    Nodes.div({ text: p.sku }),
    Nodes.div({ text: p.name }),
    Nodes.div({ text: "$ " + p.price }),
    Nodes.div({ text: p.type }),
    Nodes.div({ text: descriptions[p.type](p) }),
  ]);
};
