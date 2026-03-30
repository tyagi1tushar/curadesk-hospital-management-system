import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import Hero from "./pages/Hero";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";



function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  // If user is not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-gradient-to-b from-emerald-50 via-green-50 to-emerald-100 px-4">
        <div className="text-center">

          <p className="text-emerald-800 font-semibold text-lg sm:text-2xl mb-4">
            Please sign in to view this page
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 text-sm rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all duration-300"
            >
              HOME
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return children;
}

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Page */}
        <Route path="/" element={<Hero />} />

        {/* Protected Dashboard */}
        <Route
          path="/h"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/add" element={<RequireAuth><Add /></RequireAuth>} />
        <Route path="/list" element={<RequireAuth><List /></RequireAuth>} />

      </Routes>
    </div>
  );
};

export default App;
