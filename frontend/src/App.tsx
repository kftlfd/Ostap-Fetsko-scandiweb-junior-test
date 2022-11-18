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
      <Router />
      <footer>Scandiweb Test Assignment</footer>
    </BrowserRouter>
  );
}

function Router() {
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

function Error() {
  return (
    <>
      <header>
        <h1 className="heading">Not found</h1>
      </header>

      <main>
        <h3>
          <Link to="/">To Homepage</Link>
        </h3>
      </main>
    </>
  );
}
