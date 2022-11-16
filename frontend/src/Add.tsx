import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { ProductInfo } from "./api";
import { addProduct } from "./api";

type ProductCategory = ProductInfo["type"];
type FormData = Omit<ProductInfo, "id">;
type Override<T, O> = { [P in keyof T]: O };
type FormErrors = Override<Partial<FormData>, string>;

export default function Add() {
  const navigate = useNavigate();
  const [error, setError] = useState<null | string>(null);
  const [productType, setProductType] = useState<ProductCategory>("DVD");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    document.title = "Product Add";
  }, []);

  function submitForm() {
    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data: FormData = {
      sku: form.skuField.value,
      name: form.nameField.value,
      price: Number(form.priceField.value),
      type: productType,
    };

    switch (productType) {
      case "DVD":
        data.size = Number(form.sizeField.value);
        break;
      case "Furniture":
        data.width = Number(form.widthField.value);
        data.height = Number(form.heightField.value);
        data.length = Number(form.lengthField.value);
        break;
      case "Book":
        data.weight = Number(form.weightField.value);
        break;
    }

    // console.log(data);
    addProduct(data)
      .then((res) => {
        if (!res) navigate("/");
        else setFormErrors(res);
      })
      .catch((err: Error) => {
        setError(err.message);
        console.error(err);
      });
  }

  return (
    <>
      <header>
        <h1 className="heading">Product Add</h1>
        <div className="buttons">
          <button className="btn" onClick={submitForm}>
            Save
          </button>
          <Link to="/" className="btn">
            Cancel
          </Link>
        </div>
      </header>

      <main>
        <Form
          productType={productType}
          formRef={formRef}
          formErrors={formErrors}
          setProductType={setProductType}
        />
        {error && <h3>{error}</h3>}
      </main>
    </>
  );
}

function Form(props: {
  productType: ProductCategory;
  formRef: React.RefObject<HTMLFormElement>;
  formErrors: FormErrors;
  setProductType: (s: ProductCategory) => void;
}) {
  return (
    <form id="product_form" ref={props.formRef} className="addForm">
      <label htmlFor="skuField">SKU</label>
      <div className="formInput">
        <input id="sku" name="skuField" type="text" required />
        {props.formErrors.sku && (
          <div className="formError">{props.formErrors.sku}</div>
        )}
      </div>

      <label htmlFor="nameField">Name</label>
      <div className="formInput">
        <input id="name" name="nameField" type="text" required />
        {props.formErrors.name && (
          <div className="formError">{props.formErrors.name}</div>
        )}
      </div>

      <label htmlFor="priceField">Price</label>
      <div className="formInput">
        <input
          id="price"
          name="priceField"
          type="number"
          min={0}
          step={0.01}
          required
        />
        {props.formErrors.price && (
          <div className="formError">{props.formErrors.price}</div>
        )}
      </div>

      <label htmlFor="productType">Type Switcher</label>
      <div className="formInput">
        {props.formErrors.type && (
          <div className="formError">{props.formErrors.type}</div>
        )}
        <select id="productType" name="productType" defaultValue="DVD">
          <option value="DVD" onClick={() => props.setProductType("DVD")}>
            DVD
          </option>
          <option
            value="Furniture"
            onClick={() => props.setProductType("Furniture")}
          >
            Furniture
          </option>
          <option value="Book" onClick={() => props.setProductType("Book")}>
            Book
          </option>
        </select>
      </div>

      {props.productType === "DVD" && (
        <>
          <label htmlFor="sizeField">Size (MB)</label>
          <div className="formInput">
            <input
              id="size"
              name="sizeField"
              type="number"
              min={0}
              step={0.1}
              required
            />
            {props.formErrors.size && (
              <div className="formError">{props.formErrors.size}</div>
            )}
          </div>
        </>
      )}

      {props.productType === "Furniture" && (
        <>
          <label htmlFor="heightField">Hight (CM)</label>
          <div className="formInput">
            <input
              id="height"
              name="heightField"
              type="number"
              min={0}
              step={0.01}
              required
            />
            {props.formErrors.height && (
              <div className="formError">{props.formErrors.height}</div>
            )}
          </div>

          <label htmlFor="widthField">Width (CM)</label>
          <div className="formInput">
            <input
              id="width"
              name="widthField"
              type="number"
              min={0}
              step={0.01}
              required
            />
            {props.formErrors.width && (
              <div className="formError">{props.formErrors.width}</div>
            )}
          </div>

          <label htmlFor="lengthField">Length (CM)</label>
          <div className="formInput">
            <input
              id="length"
              name="lengthField"
              type="number"
              min={0}
              step={0.01}
              required
            />
            {props.formErrors.length && (
              <div className="formError">{props.formErrors.length}</div>
            )}
          </div>
        </>
      )}

      {props.productType === "Book" && (
        <>
          <label htmlFor="weightField">Weight (KG)</label>
          <div className="formInput">
            <input
              id="weight"
              name="weightField"
              type="number"
              min={0}
              step={0.01}
              required
            />
            {props.formErrors.weight && (
              <div className="formError">{props.formErrors.weight}</div>
            )}
          </div>
        </>
      )}
    </form>
  );
}
