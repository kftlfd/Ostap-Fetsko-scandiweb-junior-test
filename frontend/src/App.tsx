import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Footer, Header, Main } from "./Layout";

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
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/index.html" element={<Navigate to="/" />} />
        <Route path="/add-product" element={<Add />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
}

function PageLoading() {
  return (
    <>
      <Header heading="Products" />
      <Main>
        <h3>Loading...</h3>
      </Main>
    </>
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
