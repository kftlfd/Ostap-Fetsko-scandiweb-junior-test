import React from "react";
import type { NavigateFunction } from "react-router-dom";
import { Link } from "react-router-dom";

import type { ProductInfo, ProductCategory } from "./api";
import { productCategories, addProduct, InvalidFormError } from "./api";
import { Header, Main } from "./App";

type Choose<T, O> = { [P in keyof O]: O[P] extends T ? P : never }[keyof O];
type Override<O, T> = { [P in keyof O]: T };

type FormData = Omit<ProductInfo, "id">;

type FormFields = Required<Omit<FormData, "type">>;
type FormTextField = Choose<string, FormFields>;
type FormNumberField = Choose<number, FormFields>;

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

    // trim string fields
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
      .then(() => this.props.navigate("/"))
      .catch((err: Error) => {
        if (err instanceof InvalidFormError) {
          this.setState({ formErrors: err.getErrors() });
        } else {
          this.setState({ error: "Error: " + err.message });
          console.error(err);
        }
      });
  };

  InputTextField = (props: {
    field: FormTextField;
    label: string;
    options?: {
      required?: boolean;
      placeholder?: string;
      pattern?: string;
      title?: string;
    };
  }) => (
    <>
      <label htmlFor={props.field}>{props.label}</label>

      <div className="formInput">
        <input
          id={props.field}
          name={props.field}
          type="text"
          placeholder={props.options?.placeholder}
          pattern={props.options?.pattern}
          title={props.options?.title}
          required={props.options?.required ?? true}
        />

        {this.state.formErrors[props.field] && (
          <div className="formError">{this.state.formErrors[props.field]}</div>
        )}
      </div>
    </>
  );

  InputNumberField = (props: {
    field: FormNumberField;
    label: string;
    options?: {
      required?: boolean;
      min?: number;
      max?: number;
      step?: number;
      defVal?: number;
      title?: string;
    };
  }) => (
    <>
      <label htmlFor={props.field}>{props.label}</label>

      <div className="formInput">
        <input
          id={props.field}
          name={props.field}
          type="number"
          min={props.options?.min}
          max={props.options?.max}
          step={props.options?.step}
          defaultValue={props.options?.defVal}
          title={props.options?.title}
          required={props.options?.required ?? true}
        />

        {this.state.formErrors[props.field] && (
          <div className="formError">{this.state.formErrors[props.field]}</div>
        )}
      </div>
    </>
  );

  CategorySwitch = () => (
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

        {this.state.formErrors["type"] && (
          <div className="formError">{this.state.formErrors["type"]}</div>
        )}
      </div>
    </>
  );

  AddForm = () => (
    <form id="product_form" className="addForm" ref={this.formRef}>
      <this.InputTextField field="sku" label="SKU" />
      <this.InputTextField field="name" label="Name" />
      <this.InputNumberField field="price" label="Price" />

      <this.CategorySwitch />

      {this.categoryFields[this.state.category]()}
    </form>
  );

  categoryFields: CategoryFields = {
    DVD: () => (
      <this.InputNumberField
        field="size"
        label="Size (MB)"
        options={{ title: "Please, provide size" }}
      />
    ),

    Furniture: () => (
      <>
        <this.InputNumberField
          field="width"
          label="Width (CM)"
          options={{ title: "Please, provide width" }}
        />
        <this.InputNumberField
          field="height"
          label="Height (CM)"
          options={{ title: "Please, provide height" }}
        />
        <this.InputNumberField
          field="length"
          label="Length (CM)"
          options={{ title: "Please, provide length" }}
        />
      </>
    ),

    Book: () => (
      <this.InputNumberField
        field="weight"
        label="Weight (KG)"
        options={{ title: "Please, provide weight" }}
      />
    ),
  };

  Error = () => <h3>{this.state.error}</h3>;

  renderHeader = () => (
    <Header
      heading="Product Add"
      buttons={
        <>
          <button className="btn" onClick={this.handleSubmit}>
            Save
          </button>
          <Link to="/" className="btn">
            Cancel
          </Link>
        </>
      }
    />
  );

  renderMain = () => (
    <Main>
      {this.state.error && <this.Error />}
      <this.AddForm />
    </Main>
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
