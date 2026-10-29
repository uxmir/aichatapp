import React, { ReactNode } from "react";
import SideBar from "./SideBar";
const layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
     <SideBar/>
      <main className="ml-64 p-5 w-full">{children}</main>
    </div>
  );
};

export default layout;

