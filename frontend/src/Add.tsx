import { FC, forwardRef, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { ProductInfo, ProductCategory } from "./api";
import { productCategories, addProduct, InvalidFormError } from "./api";
import { Header, Main } from "./Layout";

type Choose<T, O> = { [P in keyof O]: O[P] extends T ? P : never }[keyof O];
type Override<O, T> = { [P in keyof O]: T };

type FormData = Omit<ProductInfo, "id">;

type FormFields = Required<Omit<FormData, "type">>;
type FormTextField = Choose<string, FormFields>;
type FormNumberField = Choose<number, FormFields>;

type FormErrors = Override<Partial<FormData>, string>;

type FormEl = HTMLFormElement & Override<FormData, { value: string }>;

type AddState = {
  error: null | string;
  category: ProductCategory;
  formErrors: FormErrors;
};

export default function Add() {
  const navigate = useNavigate();

  const [state, setState] = useState<AddState>({
    error: null,
    category: "DVD",
    formErrors: {},
  });

  const formRef = useRef<FormEl>(null);

  useEffect(() => {
    document.title = "Product Add";
  }, []);

  const handleChangeCategory = (newValue: ProductCategory) => {
    setState((prev) => ({ ...prev, category: newValue }));
  };

  const handleSubmit = () => {
    const form = formRef.current;
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
      .then(() => navigate("/"))
      .catch((err: Error) => {
        if (err instanceof InvalidFormError) {
          setState((prev) => ({ ...prev, formErrors: err.getErrors() }));
        } else {
          setState((prev) => ({ ...prev, error: "Error: " + err.message }));
          console.error(err);
        }
      });
  };

  return (
    <>
      <Header
        heading="Product Add"
        buttons={
          <>
            <button className="btn" onClick={handleSubmit}>
              Save
            </button>
            <Link to="/" className="btn">
              Cancel
            </Link>
          </>
        }
      />

      <Main>
        {state.error && <h3>{state.error}</h3>}
        <ProductForm
          ref={formRef}
          category={state.category}
          onCategoryChange={handleChangeCategory}
          formErrors={state.formErrors}
        />
      </Main>
    </>
  );
}

function InputTextField(props: {
  field: FormTextField;
  label: string;
  options?: {
    required?: boolean;
    placeholder?: string;
    pattern?: string;
    title?: string;
  };
  error?: string;
}) {
  return (
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

        {props.error && <div className="formError">{props.error}</div>}
      </div>
    </>
  );
}

function InputNumberField(props: {
  field: FormNumberField;
  label: string;
  options?: {
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    defVal?: number;
    title?: string;
  };
  error?: string;
}) {
  return (
    <>
      <label htmlFor={props.field}>{props.label}</label>

      <div className="formInput">
        <input
          id={props.field}
          name={props.field}
          type="number"
          placeholder={props.options?.placeholder}
          min={props.options?.min ?? 0}
          max={props.options?.max}
          step={props.options?.step ?? 0.01}
          defaultValue={props.options?.defVal}
          title={props.options?.title}
          required={props.options?.required ?? true}
        />

        {props.error && <div className="formError">{props.error}</div>}
      </div>
    </>
  );
}

function CategorySwitch(props: {
  value: ProductCategory;
  onChange: (newValue: ProductCategory) => void;
  error?: string;
}) {
  return (
    <>
      <label htmlFor="productType">Type Switcher</label>

      <div className="formInput">
        <select
          id="productType"
          name="type"
          defaultValue={props.value}
          onChange={(e) => props.onChange(e.target.value as ProductCategory)}
        >
          {productCategories.map((id: ProductCategory) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>

        {props.error && <div className="formError">{props.error}</div>}
      </div>
    </>
  );
}

type CategorySpecificFields = FC<{ formErrors?: FormErrors }>;

const DVDCategoryFields: CategorySpecificFields = ({ formErrors }) => (
  <>
    <div className="categoryDescription">Please, provide size</div>
    <InputNumberField
      field="size"
      label="Size (MB)"
      options={{ title: "Please, provide size", placeholder: "Size 0.00" }}
      error={formErrors?.size}
    />
  </>
);

const FurnitureCategoryFields: CategorySpecificFields = ({ formErrors }) => (
  <>
    <div className="categoryDescription">Please, provide dimensions</div>
    <InputNumberField
      field="height"
      label="Height (CM)"
      options={{
        title: "Please, provide height",
        placeholder: "Height 0.00",
      }}
      error={formErrors?.height}
    />
    <InputNumberField
      field="width"
      label="Width (CM)"
      options={{
        title: "Please, provide width",
        placeholder: "Width 0.00",
      }}
      error={formErrors?.width}
    />
    <InputNumberField
      field="length"
      label="Length (CM)"
      options={{
        title: "Please, provide length",
        placeholder: "Length 0.00",
      }}
      error={formErrors?.length}
    />
  </>
);

const BookCategoryFields: CategorySpecificFields = ({ formErrors }) => (
  <>
    <div className="categoryDescription">Please, provide weight</div>
    <InputNumberField
      field="weight"
      label="Weight (KG)"
      options={{
        title: "Please, provide weight",
        placeholder: "Weight 0.00",
      }}
      error={formErrors?.weight}
    />
  </>
);

const categoryFields: Record<ProductCategory, CategorySpecificFields> = {
  DVD: DVDCategoryFields,
  Furniture: FurnitureCategoryFields,
  Book: BookCategoryFields,
};

const ProductForm = forwardRef<
  FormEl,
  {
    category: ProductCategory;
    onCategoryChange: (newVal: ProductCategory) => void;
    formErrors?: FormErrors;
  }
>((props, ref) => {
  const CategoryFields = categoryFields[props.category];

  return (
    <form id="product_form" className="productForm" ref={ref}>
      <InputTextField
        field="sku"
        label="SKU"
        options={{
          placeholder: "Product SKU",
          pattern: "[\\w]{1,100}",
          title:
            "Please use only a-zA-Z0-9_ without spaces (up to 100 characters)",
        }}
        error={props.formErrors?.sku}
      />
      <InputTextField
        field="name"
        label="Name"
        options={{
          placeholder: "Product Name",
          pattern: "[a-zA-Z0-9!@#$%&*()-_,.:; ]{1,250}",
          title:
            "Allowed characters: a-zA-Z0-9!@#$%&*()-_,.:; and spaces (up to 250 characters)",
        }}
        error={props.formErrors?.name}
      />
      <InputNumberField
        field="price"
        label="Price"
        options={{ placeholder: "Product price $0.00" }}
        error={props.formErrors?.price}
      />

      <CategorySwitch
        value={props.category}
        onChange={props.onCategoryChange}
        error={props.formErrors?.type}
      />

      <CategoryFields formErrors={props.formErrors} />
    </form>
  );
});
