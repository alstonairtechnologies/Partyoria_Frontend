import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createContext } from "react";

interface UserTypeContext {
  isVendor: boolean;
  setIsVendor: (isVendor: boolean) => void;
}

export const UserTypeContext = createContext<UserTypeContext>({
  isVendor: false,
  setIsVendor: () => {},
});

const container = document.getElementById("root")!;
let root = (container as any)._reactRoot;
if (!root) {
  root = createRoot(container);
  (container as any)._reactRoot = root;
}
root.render(<App />);
