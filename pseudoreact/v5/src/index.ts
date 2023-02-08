import Nodes from "nodes";
import { App } from "./App";
import "./index.scss";

Nodes.renderRoot("appRoot", () => App({}));
