import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import React from "react";

export default function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
