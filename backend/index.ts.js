// @ts-check
/// <reference path="index.ts.js.d.ts" />

/**
 * This front-end for the api is not meant to actually be used,
 * it was written in one day as a challenge, only for fun.
 * (and added TS-check and transitioned to props on the second day)
 *
 * Now I appreciate modules/Webpack, frameworks/libraries
 * like React, and also TypeScript even more :)
 */

/** @param {NodeChildren} children */
HTMLElement.prototype.appendChildren = function (children) {
  if (children instanceof Array) {
    children.forEach((node) => this.appendChildren(node));
    return this;
  } else {
    return this.appendChild(children);
  }
};

const apiUrl = "/api/";

/** @type {{ ProductListPage: { data: any[], loading: boolean, error: string|null } }} */
const appState = {
  ProductListPage: {
    data: [],
    loading: true,
    error: null,
  },
};

/** @type {{[path: string]: string}} */
const routerLinks = {
  root: "/",
  productList: "/",
  productForm: "/add-product",
};

/**
 * @param {{
 *   tagName: string,
 *   requiredAttrs?: {
 *     [propName: string]: string;
 *   },
 *   optionalAttrs?: {
 *     [propName: string]: string;
 *   }
 * }} schema
 */
function htmlElementFactory(schema) {
  /**
   * @param {{
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  return (props) => {
    const Element = document.createElement(schema.tagName);
    if (schema.requiredAttrs) {
      Object.entries(schema.requiredAttrs).forEach(([propName, htmlAttr]) => {
        Element[htmlAttr] = props[propName];
      });
    }
    if (schema.optionalAttrs) {
      Object.entries(schema.optionalAttrs).forEach(([propName, htmlAttr]) => {
        if (props[propName] != null && props[propName] != undefined) {
          Element[htmlAttr] = props[propName];
        }
      });
    }
    if (props.className) Element.className = props.className;
    if (props.children) Element.appendChildren(props.children);
    return Element;
  };
}

const html = {
  /**
   * @param {{
   *   text?: string,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  div: (props) =>
    htmlElementFactory({
      tagName: "div",
      optionalAttrs: {
        text: "innerText",
      },
    })(props),

  /**
   * @param {{
   *   text?: string,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  p: (props) =>
    htmlElementFactory({
      tagName: "p",
      optionalAttrs: {
        text: "innerText",
      },
    })(props),

  /**
   * @param {{
   *   href: string,
   *   text: string,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  a: (props) =>
    htmlElementFactory({
      tagName: "a",
      requiredAttrs: {
        href: "href",
        text: "innerText",
      },
    })(props),

  /**
   * @param {{
   *   text: string,
   *   onClick?: Function
   *   className?: string,
   *   children?: NodeChildren
   * }} props
   */
  button: (props) =>
    htmlElementFactory({
      tagName: "button",
      requiredAttrs: {
        text: "innerText",
        onClick: "onclick",
      },
    })(props),

  /**
   * @param {{
   *   text?: string,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  h3: (props) =>
    htmlElementFactory({
      tagName: "h3",
      optionalAttrs: {
        text: "innerText",
      },
    })(props),

  /**
   * @param {{
   *   id?: string,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  form: (props) =>
    htmlElementFactory({
      tagName: "form",
      optionalAttrs: {
        id: "id",
      },
    })(props),

  /**
   * @param {{
   *   htmlFor: string,
   *   text: string,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  label: (props) =>
    htmlElementFactory({
      tagName: "label",
      requiredAttrs: {
        text: "innerText",
        htmlFor: "htmlFor",
      },
    })(props),

  /**
   * @param {{
   *   id?: string,
   *   name: string,
   *   type: "text" | "number" | "checkbox",
   *   value?: string,
   *   required?: boolean,
   *   placeholder?: string,
   *   min?: number,
   *   step?: number,
   *   pattern?: string,
   *   title?: string,
   *   onChange?: Function,
   *   className?: string,
   *   children?: NodeChildren
   * }} props
   */
  input: (props) =>
    htmlElementFactory({
      tagName: "input",
      requiredAttrs: {
        name: "name",
        type: "type",
      },
      optionalAttrs: {
        id: "id",
        value: "value",
        required: "required",
        placeholder: "placeholder",
        min: "min",
        step: "step",
        pattern: "pattern",
        title: "title",
        onChange: "onchange",
      },
    })(props),

  /**
   * @param {{
   *   id: string,
   *   name: string,
   *   onChange?: Function,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  select: (props) =>
    htmlElementFactory({
      tagName: "select",
      requiredAttrs: {
        id: "id",
        name: "name",
      },
      optionalAttrs: {
        onChange: "onchange",
      },
    })(props),

  /**
   * @param {{
   *   id?: string,
   *   value?: string,
   *   text: string,
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  option: (props) =>
    htmlElementFactory({
      tagName: "option",
      requiredAttrs: {
        text: "innerText",
      },
      optionalAttrs: {
        id: "id",
        value: "value",
      },
    })(props),

  /**
   * @param {{
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  header: (props) => htmlElementFactory({ tagName: "header" })(props),

  /**
   * @param {{
   *   className?: string
   *   children?: NodeChildren
   * }} props
   */
  main: (props) => htmlElementFactory({ tagName: "main" })(props),

  /**
   * @param {{
   *   className?: string
   *   children?: HTMLElement | HTMLElement[]
   * }} props
   */
  footer: (props) => htmlElementFactory({ tagName: "footer" })(props),
};

//
// Rendering
//

renderApp();

function renderApp() {
  /** @type {HTMLDivElement | null} */
  const root = document.querySelector("div#appRoot");
  if (!root) return;
  root.innerHTML = "";
  root.appendChildren(App());
}

//
// Routing
//

/**
 * @param {{
 *   defRoute: () => HTMLElement | HTMLElement[],
 *   routes: {
 *     [path: string]: () => HTMLElement | HTMLElement[],
 *   }
 * }} props
 */
function Router(props) {
  const currPath = window.location.pathname;
  const currRoute = props.routes[currPath] ?? props.defRoute;
  return currRoute();
}

/**
 * @param {string} path
 */
function routerNavigate(path) {
  window.history.pushState({ path }, "", path);
  renderApp();
}

window.onpopstate = renderApp;

/**
 * @param {{
 *   href: string,
 *   text: string,
 *   className?: string
 * }} props
 */
function RouterLink(props) {
  const Link = html.a(props);
  Link.onclick = (e) => {
    e.preventDefault();
    routerNavigate(props.href);
  };
  return Link;
}

//
// Components
//

function App() {
  return [
    Router({
      defRoute: () => ErrorPage(),
      routes: {
        [routerLinks.root]: () => ProductListPage(),
        [routerLinks.productForm]: () => ProductAddPage(),
      },
    }),
    AppFooter(),
  ];
}

function AppFooter() {
  return html.footer({
    children: html.p({ text: "test assignment" }),
  });
}

function ErrorPage() {
  document.title = "Not found";

  function Header() {
    const Heading = html.h3({ text: "Not found", className: "heading" });
    return html.header({ children: Heading });
  }

  function Main() {
    const Link = RouterLink({ href: routerLinks.root, text: "To Homepage" });
    const Heading = html.h3({ children: Link });
    return html.main({ children: Heading });
  }

  return [Header(), Main()];
}

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
        appState.ProductListPage.error = "Failed to load products";
      })
      .finally(renderApp);
  }

  function handleRefresh() {
    appState.ProductListPage.loading = true;
    renderApp();
  }

  function handleDelete() {
    const ids = [];

    /** @type {NodeListOf<HTMLInputElement>} */
    const toDelete = document.querySelectorAll("input.delete-checkbox:checked");
    if (toDelete.length < 1) return;
    toDelete.forEach((el) => ids.push(Number(el.value)));

    fetch(apiUrl + "delete/", {
      method: "POST", // "DELETE", hosting provider blocks DELETE method
      body: JSON.stringify(ids),
    })
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
    const Heading = html.h3({ text: "Product List", className: "heading" });

    const RefresBtn = html.button({
      text: "Refresh",
      className: "btn",
      onClick: handleRefresh,
    });
    const Middle = html.div({ className: "middle", children: RefresBtn });

    const Add = RouterLink({
      href: routerLinks.productForm,
      text: "ADD",
      className: "btn",
    });
    const Delete = html.button({
      text: "MASS DELETE",
      className: "btn",
      onClick: handleDelete,
    });
    const Buttons = html.div({ className: "right", children: [Add, Delete] });

    return html.header({ children: [Heading, Middle, Buttons] });
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
    return html.main({ children: content() });
  }

  function Error() {
    return html.h3({ text: "Error: " + appState.ProductListPage.error });
  }

  function Loading() {
    return html.h3({ text: "Loading..." });
  }

  function Empty() {
    return html.h3({ text: "No products" });
  }

  function ProductsGrid() {
    const products = appState.ProductListPage.data
      .sort((a, b) => b.id - a.id)
      .map((p) => Product({ product: p }));

    return html.div({ className: "productsGrid", children: products });
  }

  /**
   * @param {{
   *   product: {
   *     id: string,
   *     sku: string,
   *     name: string,
   *     price: number,
   *     type: "DVD" | "Furniture" | "Book",
   *     size?: number,
   *     height?: number,
   *     width?: number,
   *     length?: number,
   *     weight?: number
   *   }
   * }} props
   */
  function Product(props) {
    const p = props.product;

    const checkId = `checkbox${p.id}`;
    const Check = html.input({
      id: checkId,
      name: checkId,
      value: p.id,
      type: "checkbox",
      className: "delete-checkbox",
    });
    const Checklabel = html.label({
      htmlFor: checkId,
      text: `Delete product with ID ${p.id}`,
      className: "delete-checkbox-label",
    });

    const Sku = html.div({ text: p.sku });
    const Name = html.div({ text: p.name });
    const Price = html.div({ text: "$ " + p.price });
    const Type = html.div({ text: p.type });

    const descriptions = {
      DVD: (p) => `Size: ${p.size} MB`,
      Book: (p) => `Weight: ${p.weight} KG`,
      Furniture: (p) => `Dimensions: ${p.height}x${p.width}x${p.length} CM`,
    };
    const Details = html.div({ text: descriptions[p.type](p) });

    return html.div({
      className: "product",
      children: [Check, Checklabel, Sku, Name, Price, Type, Details],
    });
  }

  return [Header(), Main()];
}

function ProductAddPage() {
  document.title = "Product Add";

  const formId = "product_form";
  const categories = ["DVD", "Furniture", "Book"];

  function handleCategoryChange(e) {
    const category = e.target.value;
    document.querySelectorAll(".category").forEach((el) => el.remove());

    /** @type {HTMLFormElement | null} */
    const form = document.querySelector(`form#${formId}`);
    if (form) form.appendChildren(categoryFields[category]());
  }

  function handleSendForm() {
    /** @type {HTMLFormElement | null} */
    const form = document.querySelector(`form#${formId}`);
    form?.onchange;
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
              /** @type {HTMLDivElement | null} */
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

  /** @param {string} id */
  function clearError(id) {
    return () => {
      /** @type {HTMLDivElement | null} */
      let errorDiv = document.querySelector(`[data-form-error=${id}]`);
      if (errorDiv) errorDiv.innerText = "";
    };
  }

  /**
   * @param {{
   *   id: string,
   *   label: string,
   *   placeholder?: string,
   *   className?: string,
   *   pattern?: string,
   *   title?: string
   * }} props
   */
  function TextInput(props) {
    const Input = html.input({
      id: props.id,
      name: props.id,
      type: "text",
      className: props.className,
      placeholder: props.placeholder,
      pattern: props.pattern,
      title: props.title,
      required: true,
      onChange: clearError(props.id),
    });

    return FormSection({
      inputId: props.id,
      label: props.label,
      children: Input,
      className: props.className,
    });
  }

  /**
   * @param {{
   *   id: string,
   *   label: string,
   *   placeholder?: string,
   *   className?: string,
   *   title?: string
   * }} props
   */
  function NumberInput(props) {
    const Input = html.input({
      id: props.id,
      name: props.id,
      type: "number",
      className: props.className,
      placeholder: props.placeholder,
      required: true,
      min: 0,
      step: 0.01,
      title: props.title,
      onChange: clearError(props.id),
    });

    return FormSection({
      inputId: props.id,
      label: props.label,
      children: Input,
      className: props.className,
    });
  }

  /**
   * @param {{
   *   id: string,
   *   name: string,
   *   label: string,
   *   options: string[]
   * }} props
   */
  function SelectInput(props) {
    const Input = html.select({
      id: props.id,
      name: props.name,
      onChange: handleCategoryChange,
      children: props.options.map((option) =>
        html.option({
          id: option,
          value: option,
          text: option,
        })
      ),
    });

    return FormSection({
      inputId: props.id,
      label: props.label,
      children: Input,
    });
  }

  /**
   * @param {{
   *   inputId: string,
   *   label: string,
   *   className?: string
   *   children: HTMLElement | HTMLElement[]
   * }} props
   */
  function FormSection(props) {
    const Label = html.label({
      htmlFor: props.inputId,
      text: props.label,
      className: props.className,
    });

    const InputError = html.div({ className: "form-error" });
    InputError.dataset.formError = props.inputId;

    const InputDiv = html.div({
      className: "form-input",
      children: [props.children, InputError],
    });
    if (props.className) InputDiv.classList.add(props.className);

    return [Label, InputDiv];
  }

  const categoryFields = {
    DVD: () => [
      html.div({
        className: "category description",
        text: "Please, provide size",
      }),
      NumberInput({
        id: "size",
        label: "Size (MB)",
        placeholder: "Size 0.00",
        className: "category",
      }),
    ],

    Furniture: () => [
      html.div({
        className: "category description",
        text: "Please, provide dimensions",
      }),
      NumberInput({
        id: "height",
        label: "Height (CM)",
        placeholder: "Height 0.00",
        className: "category",
      }),
      NumberInput({
        id: "width",
        label: "Width (CM)",
        placeholder: "Width 0.00",
        className: "category",
      }),
      NumberInput({
        id: "length",
        label: "Length (CM)",
        placeholder: "Length 0.00",
        className: "category",
      }),
    ],

    Book: () => [
      html.div({
        className: "category description",
        text: "Please, provide weight",
      }),
      NumberInput({
        id: "weight",
        label: "Weight (KG)",
        placeholder: "Weight 0.00",
        className: "category",
      }),
    ],
  };

  function Header() {
    const Heading = html.h3({ text: "Product Add", className: "heading" });

    const Save = html.button({
      text: "Save",
      className: "btn",
      onClick: handleSendForm,
    });
    const Cancel = RouterLink({
      href: routerLinks.productList,
      text: "Cancel",
      className: "btn",
    });
    const Buttons = html.div({ className: "right", children: [Save, Cancel] });

    return html.header({ children: [Heading, Buttons] });
  }

  function Main() {
    const SkuField = TextInput({
      id: "sku",
      label: "SKU",
      placeholder: "Product SKU",
      pattern: "[a-zA-Z0-9]{1,100}",
      title: "Only letters and numbers, no spaces, up to 100 characters",
    });
    const NameField = TextInput({
      id: "name",
      label: "Name",
      placeholder: "Product Name",
      pattern: "[\\w\\d()-_., ]{1,250}",
      title: "Letters, numbers, spaces and: ()-_.,",
    });
    const PriceField = NumberInput({
      id: "price",
      label: "Price",
      placeholder: "Product Price $0.00",
    });
    const TypeSwitch = SelectInput({
      id: "productType",
      name: "type",
      label: "Type Switch",
      options: categories,
    });

    const Form = html.form({
      id: formId,
      className: "productForm",
      children: [
        SkuField,
        NameField,
        PriceField,
        TypeSwitch,
        categoryFields[categories[0]](),
      ],
    });
    return html.main({ children: Form });
  }

  return [Header(), Main()];
}
