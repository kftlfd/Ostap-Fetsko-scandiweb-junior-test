import Nodes from "./Nodes";
import { appState } from ".";
import type { ProductCategory } from "./api";
import { categories, saveProduct } from "./api";
import { RouterLink, routerNavigate } from "./NodesRouter";
import { routerLinks } from "./App";

export function ProductForm(): Nodes.NodeElement {
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

  function Header() {
    const Heading = Nodes.h3({ text: "Product Add", className: "heading" });

    const Save = Nodes.button({
      text: "Save",
      className: "btn",
      onClick: handleSendForm,
    });
    const Cancel = RouterLink({
      href: routerLinks.productList,
      text: "Cancel",
      className: "btn",
    });
    const Buttons = Nodes.div({ className: "right", children: [Save, Cancel] });

    return Nodes.header({ children: [Heading, Buttons] });
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
      onChange: handleCategoryChange,
    });

    const Form = Nodes.form({
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
    return Nodes.main({ children: Form });
  }

  return [Header(), Main()];
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
}

function NumberInput(props: {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  title?: string;
}) {
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
}

function SelectInput(props: {
  id: string;
  name: string;
  label: string;
  options: string[];
  onChange?: Function;
}): Nodes.NodeElement {
  const Input = Nodes.select({
    id: props.id,
    name: props.name,
    onChange: props.onChange,
    children: props.options.map((option) =>
      Nodes.option({
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
}): Nodes.NodeElement {
  const Label = Nodes.label({
    htmlFor: props.inputId,
    text: props.label,
    className: props.className,
  });

  const InputError = Nodes.div({ className: "form-error" });
  InputError.dataset.formError = props.inputId;

  const InputDiv = Nodes.div({
    className: "form-input",
    children: [props.children, InputError],
  });
  if (props.className) InputDiv.classList.add(props.className);

  return [Label, InputDiv];
}
