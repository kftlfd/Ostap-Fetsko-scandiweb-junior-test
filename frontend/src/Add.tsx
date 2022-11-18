import React from "react";
import type { NavigateFunction } from "react-router-dom";
import { Link } from "react-router-dom";

import type { ProductInfo, ProductCategory } from "./api";
import { productCategories, addProduct } from "./api";

type FormData = Omit<ProductInfo, "id">;

type FormFields = Required<Omit<FormData, "type">>;
type Choose<T, O> = { [P in keyof O]: O[P] extends T ? P : never }[keyof O];
type FormTextField = Choose<string, FormFields>;
type FormNumberField = Choose<number, FormFields>;

type Override<O, T> = { [P in keyof O]: T };
type FormErrors = Override<Partial<FormData>, string>;

type FormEl = HTMLFormElement & Override<FormData, { value: string }>;

type CategoryFields = { [P in ProductCategory]: () => React.ReactNode };

type AddProps = {
  navigate: NavigateFunction;
};

type AddState = {
  error: null | string;
  category: ProductCategory;
  formErrors: FormErrors;
};

export default class Add extends React.Component<AddProps, AddState> {
  formRef: React.RefObject<FormEl>;

  constructor(props: AddProps) {
    super(props);
    this.state = {
      error: null,
      category: "DVD",
      formErrors: {},
    };
    this.formRef = React.createRef();
  }

  componentDidMount(): void {
    document.title = "Product Add";
  }

  handleSubmit = () => {
    const form = this.formRef.current;
    if (!form) return;

    // sanitize
    form.sku.value = form.sku.value.trim();
    form.name.value = form.name.value.trim();

    // validate
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fd = new FormData(form);
    const data = Object.fromEntries(fd);

    addProduct(data)
      .then((res) => {
        if (!res) this.props.navigate("/");
        else this.setState({ formErrors: res });
      })
      .catch((err: Error) => {
        this.setState({ error: "Error: " + err.message });
        console.error(err);
      });
  };

  getTextField = (
    field: FormTextField,
    label: string,
    options: {
      required?: boolean;
      placeholder?: string;
      pattern?: string;
      title?: string;
    } = {
      required: true,
    }
  ) => (
    <>
      <label htmlFor={field}>{label}</label>

      <div className="formInput">
        <input
          id={field}
          name={field}
          type="text"
          {...(options.placeholder && { placeholder: options.placeholder })}
          {...(options.pattern && { pattern: options.pattern })}
          {...(options.title && { title: options.title })}
          {...(options.required && { required: options.required })}
        />

        {this.state.formErrors[field] && (
          <div className="formError">{this.state.formErrors[field]}</div>
        )}
      </div>
    </>
  );

  getNumberField = (
    field: FormNumberField,
    label: string,
    options: {
      required?: boolean;
      min?: number;
      max?: number;
      step?: number;
      defVal?: number;
      title?: string;
    } = {
      min: 0,
      step: 0.01,
      required: true,
    }
  ) => (
    <>
      <label htmlFor={field}>{label}</label>

      <div className="formInput">
        <input
          id={field}
          name={field}
          type="number"
          {...(options.min && { min: options.min })}
          {...(options.max && { max: options.max })}
          {...(options.step && { step: options.step })}
          {...(options.defVal && { defaultValue: options.defVal })}
          {...(options.title && { title: options.title })}
          {...(options.required && { required: true })}
        />

        {this.state.formErrors[field] && (
          <div className="formError">{this.state.formErrors[field]}</div>
        )}
      </div>
    </>
  );

  getCategoryOptions = () => (
    <>
      <label htmlFor="productType">Type Switcher</label>

      <div className="formInput">
        <select
          id="productType"
          name="type"
          defaultValue={productCategories[0]}
        >
          {productCategories.map((id: ProductCategory) => (
            <option
              key={id}
              value={id}
              onClick={() => this.setState({ category: id })}
            >
              {id}
            </option>
          ))}
        </select>

        {this.state.formErrors.type && (
          <div className="formError">{this.state.formErrors.type}</div>
        )}
      </div>
    </>
  );

  renderForm = () => (
    <form id="product_form" className="addForm" ref={this.formRef}>
      {this.getTextField("sku", "SKU")}
      {this.getTextField("name", "Name")}
      {this.getNumberField("price", "Price")}

      {this.getCategoryOptions()}

      {this.categoryFields[this.state.category]()}
    </form>
  );

  categoryFields: CategoryFields = {
    DVD: () =>
      this.getNumberField("size", "Size (MB)", {
        title: "Please, provide size",
      }),

    Furniture: () => (
      <>
        {this.getNumberField("width", "Width (CM)", {
          title: "Please, provide width",
        })}
        {this.getNumberField("height", "Height (CM)", {
          title: "Please, provide height",
        })}
        {this.getNumberField("length", "Length (CM)", {
          title: "Please, provide length",
        })}
      </>
    ),

    Book: () =>
      this.getNumberField("weight", "Weight (KG)", {
        title: "Please, provide weight",
      }),
  };

  renderHeader = () => (
    <header>
      <h1 className="heading">Product Add</h1>

      <div className="buttons">
        <button className="btn" onClick={this.handleSubmit}>
          Save
        </button>

        <Link to="/" className="btn">
          Cancel
        </Link>
      </div>
    </header>
  );

  renderMain = () => (
    <main>
      {this.renderForm()}

      {this.state.error && <h3>{this.state.error}</h3>}
    </main>
  );

  render(): React.ReactNode {
    return (
      <>
        {this.renderHeader()}
        {this.renderMain()}
      </>
    );
  }
}
