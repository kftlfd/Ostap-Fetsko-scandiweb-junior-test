import Nodes, { Router, RouterLink } from "nodes";
import { ProductList } from "./ProductList";
import { ProductForm } from "./ProductForm";

export const routerLinks: { [path: string]: string } = {
  root: "/",
  productList: "/",
  productForm: "/add-product",
};

export const App: Nodes.Component<{}> = () => {
  return [
    Router({
      defRoute: () => ErrorPage({}),
      routes: {
        [routerLinks.root]: () => ProductList({}),
        [routerLinks.productForm]: () => ProductForm({}),
      },
    }),
    AppFooter({}),
  ];
};

const AppFooter: Nodes.Component<{}> = () => {
  return Nodes.footer({}, [Nodes.p({ text: "some madness, but it's fun" })]);
};

const ErrorPage: Nodes.Component<{}> = () => {
  document.title = "Not found";

  return [
    Nodes.header({}, [Nodes.h3({ text: "Not found", className: "heading" })]),

    Nodes.main({}, [
      Nodes.h3({}, [
        RouterLink({ href: routerLinks.root, text: "To Homepage" }),
      ]),
    ]),
  ];
};
