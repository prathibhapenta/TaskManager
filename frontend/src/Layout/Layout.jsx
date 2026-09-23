import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="right-side">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="main-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default Layout;