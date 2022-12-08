import Nodes from "./Nodes";
import { appState, renderApp } from ".";
import type { Product, ProductCategory } from "./api";
import { loadProducts, deleteProducts } from "./api";
import { RouterLink } from "./NodesRouter";
import { routerLinks } from "./App";

export function ProductList(): Nodes.NodeElement {
  document.title = "Product List";

  if (appState.ProductListPage.loading) fetchProducts();

  function fetchProducts() {
    loadProducts()
      .then((res) => {
        appState.ProductListPage.data = res;
      })
      .catch((err) => {
        console.error(err);
        appState.ProductListPage.error = "Failed to load products";
      })
      .finally(() => {
        appState.ProductListPage.loading = false;
        renderApp();
      });
  }

  function handleRefresh() {
    appState.ProductListPage.loading = true;
    renderApp();
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

  function Header() {
    const Heading = Nodes.h3({ text: "Product List", className: "heading" });

    const RefresBtn = Nodes.button({
      text: "Refresh",
      className: "btn",
      onClick: handleRefresh,
    });
    const Middle = Nodes.div({ className: "middle", children: RefresBtn });

    const Add = RouterLink({
      href: routerLinks.productForm,
      text: "ADD",
      className: "btn",
    });
    const Delete = Nodes.button({
      text: "MASS DELETE",
      className: "btn",
      onClick: handleDelete,
    });
    const Buttons = Nodes.div({ className: "right", children: [Add, Delete] });

    return Nodes.header({ children: [Heading, Middle, Buttons] });
  }

  function Main() {
    let content;
    if (appState.ProductListPage.error) {
      content = Error;
    } else if (appState.ProductListPage.loading) {
      content = Loading;
    } else if (appState.ProductListPage.data.length < 1) {
      content = Empty;
    } else {
      content = ProductsGrid;
    }
    return Nodes.main({ children: content() });
  }

  function Error() {
    return Nodes.h3({ text: "Error: " + appState.ProductListPage.error });
  }

  function Loading() {
    return Nodes.h3({ text: "Loading..." });
  }

  function Empty() {
    return Nodes.h3({ text: "No products" });
  }

  function ProductsGrid() {
    const products = appState.ProductListPage.data
      .sort((a, b) => b.id - a.id)
      .map((p) => Product({ product: p }));

    return Nodes.div({ className: "productsGrid", children: products });
  }

  return [Header(), Main()];
}

function Product(props: { product: Product }): Nodes.NodeElement {
  const p = props.product;

  const checkId = `checkbox${p.id}`;
  const Check = Nodes.input({
    id: checkId,
    name: checkId,
    value: p.id,
    type: "checkbox",
    className: "delete-checkbox",
  });
  const Checklabel = Nodes.label({
    htmlFor: checkId,
    text: `Delete product with ID ${p.id}`,
    className: "delete-checkbox-label",
  });

  const Sku = Nodes.div({ text: p.sku });
  const Name = Nodes.div({ text: p.name });
  const Price = Nodes.div({ text: "$ " + p.price });
  const Type = Nodes.div({ text: p.type });

  const descriptions: {
    [category in ProductCategory]: (p: Product) => string;
  } = {
    DVD: (p) => `Size: ${p.size} MB`,
    Book: (p) => `Weight: ${p.weight} KG`,
    Furniture: (p) => `Dimensions: ${p.height}x${p.width}x${p.length} CM`,
  };
  const Details = Nodes.div({ text: descriptions[p.type](p) });

  return Nodes.div({
    className: "product",
    children: [Check, Checklabel, Sku, Name, Price, Type, Details],
  });
}
