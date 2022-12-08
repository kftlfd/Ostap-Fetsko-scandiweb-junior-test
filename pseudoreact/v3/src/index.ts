type NodeChildren = HTMLElement | HTMLElement[] | NodeChildren[];

interface HTMLElement {
  appendChildren(children: NodeChildren): HTMLElement;
}

HTMLElement.prototype.appendChildren = function (children) {
  if (children instanceof Array) {
    children.forEach((node) => this.appendChildren(node));
    return this;
  } else {
    return this.appendChild(children);
  }
};

//
// Config
//

const apiUrl = "/api/";

const appState: {
  ProductListPage: {
    data: any[];
    loading: boolean;
    error: string | null;
  };
} = {
  ProductListPage: {
    data: [],
    loading: true,
    error: null,
  },
};

const categories = ["DVD", "Furniture", "Book"] as const;
type ProductCategory = typeof categories[number];

const routerLinks: { [path: string]: string } = {
  root: "/",
  productList: "/",
  productForm: "/add-product",
};

//
// Base HTML Components
//

function htmlElementFactory<
  El extends HTMLElement,
  Props extends { [propName: string]: any }
>(schema: {
  tagName: string;
  requiredAttrs?: {
    [propName: string]: string;
  };
  optionalAttrs?: {
    [propName: string]: string;
  };
}) {
  const reqAttrs = schema.requiredAttrs ?? {};
  const optAttrs = schema.optionalAttrs ?? {};

  function elementFactory(
    props: Props & {
      className?: string;
      children?: NodeChildren;
    }
  ): El {
    const Element = document.createElement(schema.tagName);

    Object.keys(reqAttrs).forEach((propName) => {
      const htmlAttr = reqAttrs[propName];
      // @ts-ignore
      Element[htmlAttr] = props[propName];
    });

    Object.keys(optAttrs).forEach((propName) => {
      const htmlAttr = optAttrs[propName];
      if (props[propName] != null && props[propName] != undefined) {
        // @ts-ignore
        Element[htmlAttr] = props[propName];
      }
    });

    if (props.className) Element.className = props.className;
    if (props.children) Element.appendChildren(props.children);

    return Element as El;
  }

  return elementFactory;
}

const html = {
  div: htmlElementFactory<
    HTMLDivElement,
    {
      text?: string;
    }
  >({
    tagName: "div",
    optionalAttrs: {
      text: "innerText",
    },
  }),

  p: htmlElementFactory<
    HTMLParagraphElement,
    {
      text?: string;
    }
  >({
    tagName: "p",
    optionalAttrs: {
      text: "innerText",
    },
  }),

  a: htmlElementFactory<
    HTMLAnchorElement,
    {
      href: string;
      text: string;
    }
  >({
    tagName: "a",
    requiredAttrs: {
      href: "href",
      text: "innerText",
    },
  }),

  button: htmlElementFactory<
    HTMLButtonElement,
    {
      text: string;
      onClick: Function;
    }
  >({
    tagName: "button",
    requiredAttrs: {
      text: "innerText",
      onClick: "onclick",
    },
  }),

  h3: htmlElementFactory<
    HTMLHeadingElement,
    {
      text?: string;
    }
  >({
    tagName: "h3",
    optionalAttrs: {
      text: "innerText",
    },
  }),

  form: htmlElementFactory<
    HTMLFormElement,
    {
      id?: string;
    }
  >({
    tagName: "form",
    optionalAttrs: {
      id: "id",
    },
  }),

  label: htmlElementFactory<
    HTMLLabelElement,
    {
      text: string;
      htmlFor: string;
    }
  >({
    tagName: "label",
    requiredAttrs: {
      text: "innerText",
      htmlFor: "htmlFor",
    },
  }),

  input: htmlElementFactory<
    HTMLInputElement,
    {
      name: string;
      type: "text" | "number" | "checkbox";
      id?: string;
      value?: string;
      required?: boolean;
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
      pattern?: string;
      title?: string;
      onChange?: Function;
    }
  >({
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
  }),

  select: htmlElementFactory<
    HTMLSelectElement,
    {
      id: string;
      name: string;
      onChange?: Function;
    }
  >({
    tagName: "select",
    requiredAttrs: {
      id: "id",
      name: "name",
    },
    optionalAttrs: {
      onChange: "onchange",
    },
  }),

  option: htmlElementFactory<
    HTMLOptionElement,
    {
      text: string;
      id?: string;
      value?: string;
    }
  >({
    tagName: "option",
    requiredAttrs: {
      text: "innerText",
    },
    optionalAttrs: {
      id: "id",
      value: "value",
    },
  }),

  header: htmlElementFactory<HTMLElement, {}>({ tagName: "header" }),

  main: htmlElementFactory<HTMLElement, {}>({ tagName: "main" }),

  footer: htmlElementFactory<HTMLElement, {}>({ tagName: "footer" }),
};

//
// Rendering
//

renderApp();

function renderApp() {
  const root: HTMLDivElement | null = document.querySelector("div#appRoot");
  if (!root) return;
  root.innerHTML = "";
  root.appendChildren(App());
}

//
// Routing
//

function Router(props: {
  defRoute: () => NodeChildren;
  routes: {
    [path: string]: () => NodeChildren;
  };
}) {
  const currPath = window.location.pathname;
  const currRoute = props.routes[currPath] ?? props.defRoute;
  return currRoute();
}

function routerNavigate(path: string) {
  window.history.pushState({ path }, "", path);
  renderApp();
}

window.onpopstate = renderApp;

function RouterLink(props: { href: string; text: string; className?: string }) {
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
    const ids: number[] = [];

    const toDelete: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      "input.delete-checkbox:checked"
    );
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

  type Product = {
    id: string;
    sku: string;
    name: string;
    price: number;
    type: "DVD" | "Furniture" | "Book";
    size?: number;
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
  };
  function Product(props: { product: Product }) {
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

    const descriptions: {
      [category in ProductCategory]: (p: Product) => string;
    } = {
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

  function findProductForm() {
    const form: HTMLFormElement | null = document.querySelector(
      `form#${formId}`
    );
    return form;
  }

  function handleCategoryChange(e: any) {
    const category = e.target.value as ProductCategory;
    document.querySelectorAll(".category").forEach((el) => el.remove());

    const form = findProductForm();
    if (form) form.appendChildren(categoryFields[category]());
  }

  function handleSendForm() {
    const form = findProductForm();
    if (!form || !form.reportValidity()) return;

    const formData = new FormData(form);
    const data: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((val, key) => (data[key] = val));
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(data),
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
              let errorDiv: HTMLDivElement | null = document.querySelector(
                `[data-form-error=${field}]`
              );
              if (errorDiv) errorDiv.innerText = errors[field];
            });
          });
        }
      })
      .catch((err) => console.error(err));
  }

  function clearError(id: string) {
    return () => {
      let errorDiv: HTMLDivElement | null = document.querySelector(
        `[data-form-error=${id}]`
      );
      if (errorDiv) errorDiv.innerText = "";
    };
  }

  function TextInput(props: {
    id: string;
    label: string;
    placeholder?: string;
    className?: string;
    pattern?: string;
    title?: string;
  }) {
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

  function NumberInput(props: {
    id: string;
    label: string;
    placeholder?: string;
    className?: string;
    title?: string;
  }) {
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

  function SelectInput(props: {
    id: string;
    name: string;
    label: string;
    options: string[];
  }) {
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

  function FormSection(props: {
    inputId: string;
    label: string;
    className?: string;
    children: HTMLElement | HTMLElement[];
  }) {
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

  const categoryFields: {
    [category in ProductCategory]: () => NodeChildren;
  } = {
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
      options: categories.map((x) => x),
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
