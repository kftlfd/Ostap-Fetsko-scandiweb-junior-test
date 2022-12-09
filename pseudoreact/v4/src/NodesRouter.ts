import Nodes from "./Nodes";
import { renderApp } from ".";

export const Router: Nodes.Component = (props: {
  defRoute: () => Nodes.NodeElement;
  routes: {
    [path: string]: () => Nodes.NodeElement;
  };
}) => {
  const currPath = window.location.pathname;
  const currRoute = props.routes[currPath] ?? props.defRoute;
  return currRoute();
};

export function routerNavigate(path: string) {
  window.history.pushState({ path }, "", path);
  renderApp();
}

export const RouterLink: Nodes.Component = (
  props: {
    href: string;
    text: string;
    className?: string;
  },
  children
) => {
  const Link = Nodes.a(props, children);
  Link.onclick = (e) => {
    e.preventDefault();
    routerNavigate(props.href);
  };
  return [Link];
};
