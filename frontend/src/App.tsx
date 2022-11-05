import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import List from "./List";
import Add from "./Add";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/index.html" element={<Navigate to="/" />} />
        <Route path="/add-product" element={<Add />} />
        <Route path="*" element={<Error />} />
      </Routes>

      <footer>Scandiweb Test Assignment</footer>
    </BrowserRouter>
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
          <Link to="/">Go home</Link>
        </h3>
      </main>
    </>
  );
}
