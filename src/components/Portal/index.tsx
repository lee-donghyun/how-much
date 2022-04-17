import { FC } from "react";
import { createPortal } from "react-dom";

const Portal: FC = ({ children }) => {
  const root = document.getElementById("portal") as HTMLDivElement;
  return createPortal(children, root);
};

export default Portal;
