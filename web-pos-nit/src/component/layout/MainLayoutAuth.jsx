import React from "react";
import { Outlet } from "react-router-dom";

function MainLayoutAuth() {
  return (
    <div>
      <div style={{ backgroundColor: "pink", padding: 15 }}>
        <div>Layout Auth</div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayoutAuth;
