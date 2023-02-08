export type NodeElement = HTMLElement | NodeElement[];

export interface Component<Props> {
  (props: Props, children?: NodeElement): NodeElement;
}

export type RenderConfig = {
  rootId: string;
  component: () => NodeElement;
};

export type State = { [k: string]: any };

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type DefaultProps = {
  id?: string;
  className?: string;
  dataset?: { [attr: string]: string };
};
