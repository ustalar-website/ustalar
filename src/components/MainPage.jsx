import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../profil-navbar";
import MainProfil from "../main-profil";

export default function MasterProfilePage() {
  const { masterId } = useParams();

  if (!masterId) {
    return <div>Xəta: Master ID tapılmadı</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar masterId={masterId} />
      <MainProfil masterId={masterId} />
    </div>
  );
}