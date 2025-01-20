import { ReactNode } from "react";

export default function Layout({ children, modal }: Readonly<{ children: ReactNode, modal: ReactNode }>) {
  return (
    <div>
      {children}
	  {modal}
	  <div id="modal-root"></div>
    </div>
  );
}
