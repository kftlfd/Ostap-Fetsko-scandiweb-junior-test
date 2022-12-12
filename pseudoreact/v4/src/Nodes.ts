export * as default from "./Nodes";

export type NodeElement = HTMLElement | HTMLElement[] | NodeElement[];

export interface Component<Props> {
  (props: Props, children?: NodeElement): NodeElement;
}

// ********************************************************
// *
// *   Rendering
// *
// ********************************************************

export function appendChildren(element: HTMLElement, children: NodeElement) {
  if (children instanceof Array) {
    children.forEach((node) => appendChildren(element, node));
  } else {
    element.appendChild(children);
  }
}

const renderConfig: {
  rootId: string;
  component: () => NodeElement;
} = {
  rootId: "",
  component: () => [],
};

function render() {
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

// ********************************************************
// *
// *   State
// *
// ********************************************************

type State = { [k: string]: any };
const state: State = {};

function setState<S extends State>(newState: S) {
  Object.keys(newState).forEach((stateName) => {
    state[stateName] = {
      ...state[stateName],
      ...newState[stateName],
    };
  });
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export function configureState<S extends State>(initialState: S) {
  setState(initialState);

  const dispatch = (newState: RecursivePartial<S>) => {
    setState(newState);
    render();
  };

  return { state: state as S, dispatch };
}

// ********************************************************
// *
// *   Routing
// *
// ********************************************************

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

// ********************************************************
// *
// *   HTML elements
// *
// ********************************************************

type DefaultProps = {
  id?: string;
  className?: string;
  dataset?: { [attr: string]: string };
};

function htmlElementFactory<
  El extends HTMLElement,
  Props extends { [propName: string]: any }
>(schema: {
  tagName: string;
  requiredAttrs?: {
    [propName: string]: string;
  };
  optionalAttrs?: {
    [propName: string]: string;
  };
}) {
  const reqAttrs = schema.requiredAttrs ?? {};
  const optAttrs = schema.optionalAttrs ?? {};

  function elementFactory(
    props: Props & DefaultProps,
    children?: NodeElement
  ): El {
    const Element = document.createElement(schema.tagName);

    Object.keys(reqAttrs).forEach((propName) => {
      const htmlAttr = reqAttrs[propName];
      // @ts-ignore
      Element[htmlAttr] = props[propName];
    });

    Object.keys(optAttrs).forEach((propName) => {
      const htmlAttr = optAttrs[propName];
      if (props[propName] != null && props[propName] != undefined) {
        // @ts-ignore
        Element[htmlAttr] = props[propName];
      }
    });

    if (props.id) Element.id = props.id;
    if (props.className) Element.className = props.className;
    if (props.dataset) {
      Object.keys(props.dataset).forEach(
        (attr) => (Element.dataset[attr] = props.dataset?.[attr])
      );
    }
    if (children) appendChildren(Element, children);

    return Element as El;
  }

  return elementFactory;
}

export const div = htmlElementFactory<
  HTMLDivElement,
  {
    text?: string;
  }
>({
  tagName: "div",
  optionalAttrs: {
    text: "innerText",
  },
});

export const p = htmlElementFactory<
  HTMLParagraphElement,
  {
    text?: string;
  }
>({
  tagName: "p",
  optionalAttrs: {
    text: "innerText",
  },
});

export const a = htmlElementFactory<
  HTMLAnchorElement,
  {
    href: string;
    text: string;
  }
>({
  tagName: "a",
  requiredAttrs: {
    href: "href",
    text: "innerText",
  },
});

export const button = htmlElementFactory<
  HTMLButtonElement,
  {
    text: string;
    onClick: Function;
  }
>({
  tagName: "button",
  requiredAttrs: {
    text: "innerText",
    onClick: "onclick",
  },
});

export const h3 = htmlElementFactory<
  HTMLHeadingElement,
  {
    text?: string;
  }
>({
  tagName: "h3",
  optionalAttrs: {
    text: "innerText",
  },
});

export const form = htmlElementFactory<HTMLFormElement, {}>({
  tagName: "form",
});

export const label = htmlElementFactory<
  HTMLLabelElement,
  {
    text: string;
    htmlFor: string;
  }
>({
  tagName: "label",
  requiredAttrs: {
    text: "innerText",
    htmlFor: "htmlFor",
  },
});

export const input = htmlElementFactory<
  HTMLInputElement,
  {
    name: string;
    type: "text" | "number" | "checkbox";
    value?: string;
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    title?: string;
    onChange?: Function;
  }
>({
  tagName: "input",
  requiredAttrs: {
    name: "name",
    type: "type",
  },
  optionalAttrs: {
    value: "value",
    required: "required",
    placeholder: "placeholder",
    min: "min",
    step: "step",
    pattern: "pattern",
    title: "title",
    onChange: "onchange",
  },
});

export const select = htmlElementFactory<
  HTMLSelectElement,
  {
    name: string;
    onChange?: Function;
  }
>({
  tagName: "select",
  requiredAttrs: {
    name: "name",
  },
  optionalAttrs: {
    onChange: "onchange",
  },
});

export const option = htmlElementFactory<
  HTMLOptionElement,
  {
    text: string;
    value?: string;
  }
>({
  tagName: "option",
  requiredAttrs: {
    text: "innerText",
  },
  optionalAttrs: {
    value: "value",
  },
});

export const img = htmlElementFactory<
  HTMLImageElement,
  {
    src: string;
    width?: number;
    height?: number;
  }
>({
  tagName: "img",
  requiredAttrs: {
    src: "src",
  },
  optionalAttrs: {
    width: "width",
    height: "height",
  },
});

export const header = htmlElementFactory<HTMLElement, {}>({
  tagName: "header",
});

export const main = htmlElementFactory<HTMLElement, {}>({ tagName: "main" });

export const footer = htmlElementFactory<HTMLElement, {}>({
  tagName: "footer",
});
