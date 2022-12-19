import Nodes from "./Nodes";
import { App } from "./App";
import "./index.scss";

Nodes.renderRoot("appRoot", () => App({}));
