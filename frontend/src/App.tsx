import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import List from "./List";
import Add from "./Add";

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <Footer />
    </BrowserRouter>
  );
}

function AppRouter() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/index.html" element={<Navigate to="/" />} />
      <Route path="/add-product" element={<Add navigate={navigate} />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export function Header(props: {
  heading: string;
  middle?: React.ReactNode;
  buttons?: React.ReactNode;
}) {
  return (
    <header>
      <h1 className="heading">{props.heading}</h1>

      {props.middle && <div className="middle">{props.middle}</div>}

      {props.buttons && <div className="buttons">{props.buttons}</div>}
    </header>
  );
}

export function Main(props: { children: React.ReactNode }) {
  return <main>{props.children}</main>;
}

function Footer(props: {}) {
  return (
    <footer>
      <span>Scandiweb Test Assignment</span>
      <span>&bull;</span>
      <a href="mailto:o.fetsko@gmail.com">Ostap Fetsko</a>
      <span>&bull;</span>
      <a href="https://github.com/kftlfd" target={"_blank"}>
        GitHub
      </a>
    </footer>
  );
}

function Error() {
  return (
    <>
      <Header heading="Not found" />

      <Main>
        <h3>
          <Link to="/">To Homepage</Link>
        </h3>
      </Main>
    </>
  );
}
