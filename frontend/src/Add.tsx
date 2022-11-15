import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { ProductInfo } from "./api";
import { addProduct } from "./api";

type ProductCategory = ProductInfo["type"];
type FormData = Omit<ProductInfo, "id">;

export default function Add() {
  const navigate = useNavigate();
  const [productType, setProductType] = useState<ProductCategory>("DVD");
  const [formErrors, setFormErrors] = useState({});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    document.title = "Product Add";
  }, []);

  function submitForm() {
    const form = formRef.current;
    if (!form) return;

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
      .catch((err) => console.error(err));
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
          setProductType={setProductType}
        />
        <div>
          <pre>{JSON.stringify(formErrors)}</pre>
        </div>
      </main>
    </>
  );
}

function Form(props: {
  productType: ProductCategory;
  formRef: React.RefObject<HTMLFormElement>;
  setProductType: (s: ProductCategory) => void;
}) {
  return (
    <form id="product_form" ref={props.formRef} className="addForm">
      <label htmlFor="skuField">SKU</label>
      <input id="sku" name="skuField" type="text" />

      <label htmlFor="nameField">Name</label>
      <input id="name" name="nameField" type="text" />

      <label htmlFor="priceField">Price</label>
      <input id="price" name="priceField" type="number" min={0} step={0.01} />

      <label htmlFor="productType">Type Switcher</label>
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

      {props.productType === "DVD" && (
        <>
          <label htmlFor="sizeField">Size (MB)</label>
          <input id="size" name="sizeField" type="number" min={0} step={0.1} />
        </>
      )}

      {props.productType === "Furniture" && (
        <>
          <label htmlFor="heightField">Hight (CM)</label>
          <input
            id="height"
            name="heightField"
            type="number"
            min={0}
            step={0.1}
          />

          <label htmlFor="widthField">Width (CM)</label>
          <input
            id="width"
            name="widthField"
            type="number"
            min={0}
            step={0.1}
          />

          <label htmlFor="lengthField">Length (CM)</label>
          <input
            id="length"
            name="lengthField"
            type="number"
            min={0}
            step={0.1}
          />
        </>
      )}

      {props.productType === "Book" && (
        <>
          <label htmlFor="weightField">Weight (KG)</label>
          <input
            id="weight"
            name="weightField"
            type="number"
            min={0}
            step={0.1}
          />
        </>
      )}
    </form>
  );
}
