import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CalciteLoader } from "@esri/calcite-components-react";
import { SiteSelectionProvider } from "./contexts/SiteSelectionContext";
const SiteSelectionApp = lazy(() => import("./pages/SiteSelectionApp"));
const Configure = lazy(() => import("./pages/site-selection/Configure"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <SiteSelectionProvider>
      <BrowserRouter basename="/app/">
        <Suspense fallback={<CalciteLoader />}>
          <Routes>
            {/* <Route index element={<Homepage />} /> */}
            <Route
              // path="site-selection"
              element={
                  <SiteSelectionApp />
              }
            >
              <Route index element={<Navigate replace to="configure" />} />
              <Route
                path="configure"
                element={
                  <Suspense fallback={<CalciteLoader />}>
                    <Configure />
                  </Suspense>
                }
              />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SiteSelectionProvider>
  );
}

export default App;
