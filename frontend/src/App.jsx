import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Service from "./pages/Service";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import DHome from "./pages/DHome";
import List from "./pages/List";
import EditProfile from "./pages/EditProfile";
import Appointments from "./pages/Appointments";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CircleChevronUp } from "lucide-react";
import VerifyServicePayPageStripe from "../VerifyServicePayPageStripe";
import VerifyPayPageStripe from "./pages/VerifyPayPageStripe";



/* ---------------- Scroll To Top ---------------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

/* ---------------- Scroll Button ---------------- */
const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-4 bottom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center 
      bg-emerald-600 text-white shadow-lg transition-all duration-300 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
      hover:scale-110 hover:shadow-xl`}
      title="Go to top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
};

/* ---------------- App ---------------- */
const App = () => {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);

  return (
    <>
      <ScrollToTop />

      <div className="overflow-x-hidden bg-white text-gray-900">
        {/* ✅ Global Toast */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/services" element={<Service />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/contact" element={<Contact />} />

          {/* Doctor Admin */}
          <Route path="/doctor-admin/login" element={<Login />} />
          <Route path="/doctor-admin/:id" element={<DHome />} />
          <Route
            path="/doctor-admin/:id/appointments"
            element={<List />}
          />
          <Route
            path="/doctor-admin/:id/profile/edit"
            element={<EditProfile />}
          />

          {/* User */}
          <Route path="/appointments" element={<Appointments />} />

           {/* Payment */}
             <Route path="/appointment/success" element={<VerifyPayPageStripe />} />
            <Route path="/appointment/cancel" element={<VerifyPayPageStripe />} />
             <Route
            path="/service-appointment/success"
            element={<VerifyServicePayPageStripe />}
          />
          <Route
            path="/service-appointment/cancel"
            element={<VerifyServicePayPageStripe />}
          />

        </Routes>
      </div>

      <ScrollButton />
    </>
  );
};

export default App;