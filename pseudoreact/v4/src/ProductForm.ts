import Nodes from "./Nodes";
import { appState } from ".";
import type { ProductCategory } from "./api";
import { categories, saveProduct } from "./api";
import { RouterLink, routerNavigate } from "./NodesRouter";
import { routerLinks } from "./App";

export const ProductForm: Nodes.Component = () => {
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
    if (form) Nodes.appendChildren(form, categoryFields[category]());
  }

  function handleSendForm() {
    const form = findProductForm();
    if (!form || !form.reportValidity()) return;

    const formData = new FormData(form);
    const data: { [key: string]: FormDataEntryValue } = {};
    formData.forEach((val, key) => (data[key] = val));
    saveProduct(data)
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

  const categoryFields: {
    [category in ProductCategory]: () => Nodes.NodeElement;
  } = {
    DVD: () => [
      Nodes.div({
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
      Nodes.div({
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
      Nodes.div({
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

  const Header: Nodes.Component = () => {
    return Nodes.header({}, [
      Nodes.h3({ text: "Product Add", className: "heading" }),
      Nodes.div({ className: "right" }, [
        Nodes.button({
          text: "Save",
          className: "btn",
          onClick: handleSendForm,
        }),
        RouterLink({
          href: routerLinks.productList,
          text: "Cancel",
          className: "btn",
        }),
      ]),
    ]);
  };

  const Main: Nodes.Component = () => {
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
      onChange: handleCategoryChange,
    });

    return Nodes.main({}, [
      Nodes.form({ id: formId, className: "productForm" }, [
        SkuField,
        NameField,
        PriceField,
        TypeSwitch,
        categoryFields[categories[0]](),
      ]),
    ]);
  };

  return [Header(), Main()];
};

function clearError(id: string) {
  return () => {
    let errorDiv: HTMLDivElement | null = document.querySelector(
      `[data-form-error=${id}]`
    );
    if (errorDiv) errorDiv.innerText = "";
  };
}

const TextInput: Nodes.Component = (props: {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  pattern?: string;
  title?: string;
}) => {
  const Input = Nodes.input({
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
};

const NumberInput: Nodes.Component = (props: {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  title?: string;
}) => {
  const Input = Nodes.input({
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
};

const SelectInput: Nodes.Component = (props: {
  id: string;
  name: string;
  label: string;
  options: string[];
  onChange?: Function;
}) => {
  const Input = Nodes.select(
    {
      id: props.id,
      name: props.name,
      onChange: props.onChange,
    },
    props.options.map((option) =>
      Nodes.option({
        id: option,
        value: option,
        text: option,
      })
    )
  );

  return FormSection({
    inputId: props.id,
    label: props.label,
    children: Input,
  });
};

const FormSection: Nodes.Component = (props: {
  inputId: string;
  label: string;
  className?: string;
  children: HTMLElement | HTMLElement[];
}) => {
  const InputError = Nodes.div({ className: "form-error" });
  InputError.dataset.formError = props.inputId;

  return [
    Nodes.label({
      htmlFor: props.inputId,
      text: props.label,
      className: props.className,
    }),
    Nodes.div({ className: "form-input " + (props.className ?? "") }, [
      props.children,
      InputError,
    ]),
  ];
};
