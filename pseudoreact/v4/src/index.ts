import "./index.scss";
import Nodes from "./Nodes";
import { App } from "./App";

export const appState: {
  ProductListPage: {
    data: any[];
    loading: boolean;
    error: string | null;
  };
} = {
  ProductListPage: {
    data: [],
    loading: true,
    error: null,
  },
};

export const renderApp = Nodes.Renderer("appRoot", App);
window.onpopstate = renderApp;
renderApp();
