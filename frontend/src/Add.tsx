import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { addQuery } from "./api";

type ProductType = "DVD" | "Furniture" | "Book";

type FormData = {
  sku: string;
  name: string;
  price: number;
  type: ProductType;
  size?: number;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
};

export default function Add() {
  const navigate = useNavigate();
  const [productType, setProductType] = useState<ProductType>("DVD");
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
      price: form.priceField.value,
      type: productType,
    };

    switch (productType) {
      case "DVD":
        data.size = form.sizeField.value;
        break;
      case "Furniture":
        data.width = form.widthField.value;
        data.height = form.heightField.value;
        data.length = form.lengthField.value;
        break;
      case "Book":
        data.weight = form.weightField.value;
        break;
    }

    console.log(data);
    addQuery(data)
      .then(() => navigate("/"))
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
      </main>
    </>
  );
}

function Form(props: {
  productType: ProductType;
  formRef: React.RefObject<HTMLFormElement>;
  setProductType: (s: ProductType) => void;
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
