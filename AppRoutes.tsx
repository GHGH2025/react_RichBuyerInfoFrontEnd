import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import UpdateBuyBox from "./UpdateBuyBox";
import WhatsAppGroupsConfig from "./WhatsAppGroupsConfig";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Update-My-BuyBox" element={<UpdateBuyBox />} />
      <Route path="/whatsapp-groups" element={<WhatsAppGroupsConfig />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;