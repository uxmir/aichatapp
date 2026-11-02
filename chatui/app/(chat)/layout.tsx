import React, { ReactNode } from "react";
import SideBar from "./SideBar";
const layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
     <SideBar/>
      <main className="md:ml-64 w-full">{children}</main>
    </div>
  );
};

export default layout;

