import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import UpdateBuyBox from "./UpdateBuyBox"; // <- create this page component

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Existing form (same as now) */}
      <Route path="/" element={<App />} />

      {/* NEW: update request page (email + phone + “Get link via Email”) */}
      <Route path="/Update-My-BuyBox" element={<UpdateBuyBox />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;