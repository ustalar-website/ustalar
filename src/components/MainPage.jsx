import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../profil-navbar";
import MainProfil from "../main-profil";

export default function MainPage() {

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <div className="">
      <Navbar />
      <MainProfil />
    </div>
  );
}
