import React from "react";
import { Outlet } from "react-router-dom";

function MainLayoutAuth() {
  return (
    <div>
      <div style={{ backgroundColor: "pink" }}>
        <div>Layout Auth</div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayoutAuth;
