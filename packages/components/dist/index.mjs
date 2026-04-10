import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { jsx } from 'react/jsx-runtime';

/* @nirman/components — निर्माण Design System */

var NirmanContext = createContext(null);
function NirmanProvider({
  children,
  defaultTheme = "light",
  defaultDensity = "default",
  defaultBrand = "nirman",
  rootElement
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [density, setDensity] = useState(defaultDensity);
  const [brand, setBrand] = useState(defaultBrand);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  }, []);
  useEffect(() => {
    const root = rootElement || document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-density", density);
    root.setAttribute("data-brand", brand);
    return () => {
      root.removeAttribute("data-theme");
      root.removeAttribute("data-density");
      root.removeAttribute("data-brand");
    };
  }, [theme, density, brand, rootElement]);
  useEffect(() => {
    if (defaultTheme) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    if (mq.matches) setTheme("dark");
    return () => mq.removeEventListener("change", handler);
  }, [defaultTheme]);
  return /* @__PURE__ */ jsx(
    NirmanContext.Provider,
    {
      value: { theme, setTheme, toggleTheme, density, setDensity, brand, setBrand },
      children
    }
  );
}
function useNirman() {
  const ctx = useContext(NirmanContext);
  if (!ctx) {
    throw new Error(
      "useNirman() must be used within a <NirmanProvider>. Wrap your app root with <NirmanProvider> to use Nirman theme context."
    );
  }
  return ctx;
}

export { NirmanProvider, useNirman };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map