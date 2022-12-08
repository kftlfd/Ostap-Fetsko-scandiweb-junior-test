import Nodes from "./Nodes";
import { Router, RouterLink } from "./NodesRouter";
import { ProductList } from "./ProductList";
import { ProductForm } from "./ProductForm";

export const routerLinks: { [path: string]: string } = {
  root: "/",
  productList: "/",
  productForm: "/add-product",
};

export function App(): Nodes.NodeElement {
  return [
    Router({
      defRoute: () => ErrorPage(),
      routes: {
        [routerLinks.root]: () => ProductList(),
        [routerLinks.productForm]: () => ProductForm(),
      },
    }),
    AppFooter(),
  ];
}

function AppFooter(): Nodes.NodeElement {
  return Nodes.footer({ children: Nodes.p({ text: "some madness" }) });
}

function ErrorPage() {
  document.title = "Not found";

  function Header(): Nodes.NodeElement {
    const Heading = Nodes.h3({ text: "Not found", className: "heading" });
    return Nodes.header({ children: Heading });
  }

  function Main(): Nodes.NodeElement {
    const Link = RouterLink({ href: routerLinks.root, text: "To Homepage" });
    const Heading = Nodes.h3({ children: Link });
    return Nodes.main({ children: Heading });
  }

  return [Header(), Main()];
}
