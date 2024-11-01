import { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Component_Generic from "./Component_Generic";

export function useAppNavigate() {
  let navigate = useNavigate();

  return (path: string, newTab = false) => {
    // Changed default to false for internal navigation
    if (path.startsWith("http") || path.startsWith("https")) {
      window.location.href = path; // Navigate to the external URL
    } else {
      // Internal URL
      if (newTab) {
        window.open(window.location.origin + path, "_blank");
      } else {
        navigate(path);
      }
    }
  };
}

export const Component_App_Router = ({ data }: Props_Component_Rendered) => {
  const [pages, setPages] = useState<Data_Component_Generic[]>();
  const [structuralComponents, setStructuralComponents] =
    useState<Data_Component_Generic[]>();

  const initializeInfrastructure = () => {
    let children_pages: Data_Component_Generic[] = [];
    let children_structural_components: Data_Component_Generic[] = [];

    data.json.content.children?.map((child: Data_Component_Generic) => {
      if (child && child.enabled) {
        if (child.key_component === "page") children_pages.push(child);
        else children_structural_components.push(child);
      }
    });

    setPages(children_pages);
    setStructuralComponents(children_structural_components);
  };

  useEffect(() => {
    initializeInfrastructure();
  }, []);

  return (
    <>
      {structuralComponents?.map(
        (component: Data_Component_Generic, index: number) => {
          return <Component_Generic key={index} data={component} />;
        }
      )}
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {pages?.map((page: Data_Component_Generic, index: number) => {
              const path = `/${page.content.key_page}`;
              return (
                <Route
                  key={path + index}
                  path={path}
                  element={<Component_Generic key={path} data={page} />}
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};
