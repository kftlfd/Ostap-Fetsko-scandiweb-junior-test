import Nodes from "./Nodes";
import { renderApp } from ".";

export function Router(props: {
  defRoute: () => Nodes.NodeElement;
  routes: {
    [path: string]: () => Nodes.NodeElement;
  };
}) {
  const currPath = window.location.pathname;
  const currRoute = props.routes[currPath] ?? props.defRoute;
  return currRoute();
}

export function routerNavigate(path: string) {
  window.history.pushState({ path }, "", path);
  renderApp();
}

export function RouterLink(props: {
  href: string;
  text: string;
  className?: string;
}) {
  const Link = Nodes.a(props);
  Link.onclick = (e) => {
    e.preventDefault();
    routerNavigate(props.href);
  };
  return Link;
}
