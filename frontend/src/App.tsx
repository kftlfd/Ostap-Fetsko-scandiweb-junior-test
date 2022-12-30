import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";

const List = React.lazy(() => import("./List"));
const Add = React.lazy(() => import("./Add"));

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
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/index.html" element={<Navigate to="/" />} />
        <Route path="/add-product" element={<Add navigate={navigate} />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
}

const PageLoading = () => (
  <>
    <Header heading="Products" />
    <Main>
      <h3>Loading...</h3>
    </Main>
  </>
);

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
      <span>Products DB</span>
      <span>&bull;</span>
      <a href="https://github.com/kftlfd/productsdb" target={"_blank"}>
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
