import type { NodeElement, Component } from "./types";
import { render } from "./rendering";
import { a } from "./elements";

export function routerNavigate(path: string) {
  window.history.pushState({ path }, "", path);
  render();
}

export const Router: Component<{
  defRoute: () => NodeElement;
  routes: {
    [path: string]: () => NodeElement;
  };
}> = (props) => {
  const currPath = window.location.pathname;
  const currRoute = props.routes[currPath] ?? props.defRoute;
  return currRoute();
};

export const RouterLink: Component<{
  href: string;
  text: string;
  className?: string;
}> = (props, children) => {
  const Link = a(props, children);
  Link.onclick = (e) => {
    e.preventDefault();
    routerNavigate(props.href);
  };
  return [Link];
};
