"use strict";

/**
 * This front-end for the api is not meant to actually be used,
 * it was written in one day as a challenge only for fun.
 *
 * Now I appreciate modules/Webpack, frameworks/libraries
 * like React, and also TypeScript even more :)
 */

HTMLElement.prototype.appendChildren = function (children) {
  if (Array.isArray(children)) {
    children.forEach((node) => this.appendChildren(node));
  } else if (children instanceof Function) {
    this.appendChildren(children());
  } else {
    this.appendChild(children);
  }
};

const apiUrl = window.origin + "/api/";

const appState = {
  ProductListPage: {
    data: [],
    loading: true,
    error: null,
  },
};

const routerLinks = {
  root: "/",
  productList: "/",
  productForm: "/add-product",
};

const html = {
  div: (className = null, text = null) => {
    const Div = document.createElement("div");
    if (className) Div.className = className;
    if (text) Div.innerText = text;
    return Div;
  },

  a: (href, text, className = null) => {
    const Link = document.createElement("a");
    Link.href = href;
    Link.text = text;
    if (className) Link.className = className;
    return Link;
  },

  button: (text, className = null, onClick = null) => {
    const Button = document.createElement("button");
    Button.innerText = text;
    if (className) Button.className = className;
    if (onClick) Button.onclick = onClick;
    return Button;
  },

  h3: (text, className = null) => {
    const Heading = document.createElement("h3");
    Heading.innerText = text;
    if (className) Heading.className = className;
    return Heading;
  },

  input: (idName, type, className = null, options = {}) => {
    const Input = document.createElement("input");
    Input.id = idName;
    Input.name = idName;
    Input.type = type;
    if (className) Input.className = className;
    if (options.value) Input.value = options.value;
    if (options.placeholder) Input.placeholder = options.placeholder;
    if (options.required) Input.required = options.required;
    if (options.min != null) Input.min = options.min;
    if (options.step) Input.step = options.step;
    return Input;
  },

  label: (htmlFor, text, className = null) => {
    const Label = document.createElement("label");
    Label.innerText = text;
    Label.htmlFor = htmlFor;
    if (className) Label.className = className;
    return Label;
  },

  header: () => {
    const Header = document.createElement("header");
    return Header;
  },

  main: () => {
    const Main = document.createElement("main");
    return Main;
  },

  footer: () => {
    const Footer = document.createElement("footer");
    return Footer;
  },
};

//
// Rendering
//

renderApp();

function renderApp() {
  const root = document.querySelector("#appRoot");
  root.innerHTML = "";
  root.appendChildren(Router);
}

//
// Routing
//

window.onpopstate = renderApp;

function Router() {
  const routes = {
    [routerLinks.root]: ProductListPage,
    [routerLinks.productForm]: ProductAddPage,
  };
  const defRoute = ErrorPage;

  const currPath = window.location.pathname;
  const currRoute = routes[currPath] ?? defRoute;
  return currRoute();
}

function routerNavigate(path) {
  window.history.pushState({ path }, "", path);
  renderApp();
}

function RouterLink(path, text, className = null) {
  const Link = html.a(path, text, className);
  Link.onclick = (e) => {
    e.preventDefault();
    routerNavigate(path);
  };
  return Link;
}

//
// Layout
//

function AppFooter() {
  const Footer = html.footer();
  Footer.innerText = "test assignment";
  return Footer;
}

function ErrorPage() {
  document.title = "Not found";

  function Header() {
    const Header = html.header();
    const Heading = html.h3("Not found", "heading");
    Header.appendChildren(Heading);
    return Header;
  }

  function Main() {
    const Main = html.main();
    const Heading = html.h3("");
    const Link = RouterLink(routerLinks.root, "To Homepage");
    Heading.appendChildren(Link);
    Main.appendChildren(Heading);
    return Main;
  }

  return [Header, Main, AppFooter];
}

/**
 * Product-list component
 *
 */
function ProductListPage() {
  document.title = "Product List";

  if (appState.ProductListPage.loading) fetchProducts();

  function fetchProducts() {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((res) => {
        appState.ProductListPage.loading = false;
        appState.ProductListPage.data = res;
      })
      .catch((err) => {
        console.error(err);
        appState.ProductListPage.error = err.message;
      })
      .finally(renderApp);
  }

  function handleRefresh() {
    appState.ProductListPage.data = [];
    appState.ProductListPage.loading = true;
    renderApp();
  }

  function handleDelete() {
    const ids = [];
    const toDelete = document.querySelectorAll(".delete-checkbox:checked");
    toDelete.forEach((el) => ids.push(Number(el.value)));

    fetch(apiUrl + "delete/", {
      method: "POST", // "DELETE", hosting provider blocks DELETE method
      body: JSON.stringify(ids),
    })
      .then((res) => {
        if (res.ok) {
          toDelete.forEach((el) => el.parentElement.remove());
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
    const Heading = html.h3("Product List", "heading");

    const Middle = html.div("middle");
    const RefresBtn = html.button("Refresh", "btn", handleRefresh);
    Middle.appendChildren(RefresBtn);

    const Buttons = html.div("right");
    const Add = RouterLink(routerLinks.productForm, "ADD", "btn");
    const Delete = html.button("MASS DELETE", "btn", handleDelete);
    Buttons.appendChildren([Add, Delete]);

    const Header = html.header();
    Header.appendChildren([Heading, Middle, Buttons]);
    return Header;
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
    const Main = html.main();
    Main.appendChildren(content());
    return Main;
  }

  function Error() {
    return html.h3("Error: " + appState.ProductListPage.error);
  }

  function Loading() {
    return html.h3("Loading...");
  }

  function Empty() {
    return html.h3("No products");
  }

  function ProductsGrid() {
    const Grid = html.div("productsGrid");
    appState.ProductListPage.data
      .sort((a, b) => b.id - a.id)
      .forEach((p) => Grid.appendChildren(Product(p)));
    return Grid;
  }

  function Product(p) {
    let product = html.div("product");

    let checkId = `checkbox${p.id}`;
    let check = html.input(checkId, "checkbox", "delete-checkbox", {
      value: p.id,
    });
    let checklabel = html.label(
      checkId,
      `Delete product with ID ${p.id}`,
      "delete-checkbox-label"
    );

    let sku = html.div(null, p.sku);
    let name = html.div(null, p.name);
    let price = html.div(null, "$ " + p.price);
    let type = html.div(null, p.type);

    let description;
    switch (p.type) {
      case "DVD":
        description = `Size: ${p.size} MB`;
        break;
      case "Book":
        description = `Weight: ${p.weight} KG`;
        break;
      case "Furniture":
        description = `Dimensions: ${p.height}x${p.width}x${p.length} KG`;
        break;
      default:
        break;
    }
    let details = html.div(null, description);

    product.appendChildren([
      check,
      checklabel,
      sku,
      name,
      price,
      type,
      details,
    ]);
    return product;
  }

  return [Header, Main, AppFooter];
}

/**
 * Add-product component
 *
 */
function ProductAddPage() {
  document.title = "Product Add";

  const categories = ["DVD", "Furniture", "Book"];

  function handleCategoryChange(e) {
    let category = e.target.value;
    document.querySelectorAll(".category").forEach((el) => el.remove());
    document
      .querySelector("#product_form")
      .appendChildren(categoryFields[category]());
  }

  function handleSendForm() {
    const form = document.querySelector("#product_form");
    if (!form || !form.reportValidity()) return;

    const formData = Object.fromEntries(new FormData(form));
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((product) => {
            appState.ProductListPage.data.push(product);
            routerNavigate(routerLinks.productList);
          });
        } else {
          res.json().then((errors) => {
            Object.keys(errors).forEach((field) => {
              let errorDiv = document.querySelector(
                `[data-form-error=${field}]`
              );
              if (errorDiv) errorDiv.innerText = errors[field];
            });
          });
        }
      })
      .catch((err) => console.error(err));
  }

  function clearError(id) {
    return () => {
      let errorDiv = document.querySelector(`[data-form-error=${id}]`);
      if (errorDiv) errorDiv.innerText = "";
    };
  }

  function TextInput(id, label, placeholder, className = null) {
    const Input = html.input(id, "text", className, {
      placeholder,
      required: true,
    });
    Input.onkeyup = clearError(id);
    return FormSection(id, label, Input, className);
  }

  function NumberInput(id, label, placeholder, className = null) {
    const Input = html.input(id, "number", className, {
      placeholder,
      required: true,
      min: 0,
      step: 0.01,
    });
    Input.onkeyup = clearError(id);
    return FormSection(id, label, Input, className);
  }

  function SelectInput(id, name, label, options) {
    const Input = document.createElement("select");
    Input.name = name;
    Input.id = id;
    Input.onchange = handleCategoryChange;

    options.forEach((option) => {
      let Option = document.createElement("option");
      Option.id = option;
      Option.innerText = option;
      Input.appendChild(Option);
    });

    return FormSection(id, label, Input);
  }

  function FormSection(id, label, element, className = null) {
    const Label = html.label(id, label, className);

    const InputDiv = html.div("form-input");
    if (className) InputDiv.classList.add(className);

    const InputError = html.div("form-error");
    InputError.dataset.formError = id;

    InputDiv.appendChildren([element, InputError]);
    return [Label, InputDiv];
  }

  const categoryFields = {
    DVD: () => [
      html.div("category description", "Please, provide size"),
      NumberInput("size", "Size (MB)", "Size 0.00", "category"),
    ],

    Furniture: () => [
      html.div("category description", "Please, provide dimensions"),
      NumberInput("height", "Height (CM)", "Height 0.00", "category"),
      NumberInput("width", "Width (CM)", "Width 0.00", "category"),
      NumberInput("length", "Length (CM)", "Length 0.00", "category"),
    ],

    Book: () => [
      html.div("category description", "Please, provide weight"),
      NumberInput("weight", "Weight (KG)", "Weight 0.00", "category"),
    ],
  };

  function Header() {
    const Heading = html.h3("Product Add", "heading");

    const Buttons = html.div("right");
    const Save = html.button("Save", "btn", handleSendForm);
    const Cancel = RouterLink(routerLinks.productList, "Cancel", "btn");
    Buttons.appendChildren([Save, Cancel]);

    const Header = html.header();
    Header.appendChildren([Heading, Buttons]);
    return Header;
  }

  function Main() {
    const Form = document.createElement("form");
    Form.classList.add("productForm");
    Form.id = "product_form";

    const skuField = TextInput("sku", "SKU", "Product SKU");
    const nameField = TextInput("name", "Name", "Product Name");
    const priceField = NumberInput("price", "Price", "Product Price $0.00");
    const typeSwitch = SelectInput(
      "productType",
      "type",
      "Type Switch",
      categories
    );

    Form.appendChildren([
      skuField,
      nameField,
      priceField,
      typeSwitch,
      categoryFields[categories[0]](),
    ]);

    const Main = html.main();
    Main.appendChildren(Form);
    return Main;
  }

  return [Header, Main, AppFooter];
}
