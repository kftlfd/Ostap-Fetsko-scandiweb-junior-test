import type { NodeElement, RenderConfig } from "./types";

export function appendChildren(element: HTMLElement, children: NodeElement) {
  if (children instanceof Array) {
    children.forEach((node) => appendChildren(element, node));
  } else {
    element.appendChild(children);
  }
}

const renderConfig: RenderConfig = {
  rootId: "",
  component: () => [],
};

export function render() {
  const root: HTMLDivElement | null = document.querySelector(
    "div#" + renderConfig.rootId
  );
  if (!root)
    throw new Error(`App root 'div#${renderConfig.rootId}' not found.`);
  root.innerHTML = "";
  appendChildren(root, renderConfig.component());
}

export function renderRoot(rootId: string, component: () => NodeElement) {
  renderConfig.rootId = rootId;
  renderConfig.component = component;
  window.onpopstate = render;
  render();
}
