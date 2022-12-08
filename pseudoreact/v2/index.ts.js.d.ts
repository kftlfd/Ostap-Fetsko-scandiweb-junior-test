type NodeChild = HTMLElement | HTMLElement[];
type NodeChildren = NodeChild | NodeChild[];

interface HTMLElement {
  appendChildren(children: NodeChildren): HTMLElement;
}
