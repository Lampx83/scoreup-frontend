import HeroSection from "~/components/HeroSection/index.jsx";
import {Outlet} from "react-router-dom";
import Footer from "~/components/Footer/index.jsx";
import LecturerHeader from "~/components/LecturerComponents/Header/index.jsx";

export default function LayoutAuth() {
  return (
    <>
      <LecturerHeader/>
      <HeroSection/>
      <Outlet/>
      <Footer/>
    </>
  )
}