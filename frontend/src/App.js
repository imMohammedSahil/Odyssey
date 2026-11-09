import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import IntroPage from "./pages/IntroPage";
import LoginPage from "./pages/LoginPage";
import UploadOrder from "./pages/UploadOrder";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";

import PrintPage from "./pages/PrintPage";
import Writing from "./pages/Writing";
import Correction from "./pages/Correction";
import Paper from "./pages/Paper";
import Measuring from "./pages/Measuring";
import Office from "./pages/Office";
import StationeryPage from "./pages/StationeryPage";
import ReceiptPage from "./pages/ReceiptPage";
import AdminIntroPage from "./pages/AdminIntroPage";
import RitualOfferingPage from "./pages/RitualOfferingPage";

import ProtectedRoute from "./components/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ritual-offering" element={<RitualOfferingPage />} />

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <UploadOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/printing"
        element={
          <ProtectedRoute allowedRole="student">
            <PrintPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/writing"
        element={
          <ProtectedRoute allowedRole="student">
            <Writing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stationery/correction"
        element={
          <ProtectedRoute allowedRole="student">
            <Correction />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stationery/paper"
        element={
          <ProtectedRoute allowedRole="student">
            <Paper />
          </ProtectedRoute>
        }
      />

      <Route
        path="/paper"
        element={
          <ProtectedRoute allowedRole="student">
            <Paper />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stationery/measuring"
        element={
          <ProtectedRoute allowedRole="student">
            <Measuring />
          </ProtectedRoute>
        }
      />

      <Route
        path="/measuring"
        element={
          <ProtectedRoute allowedRole="student">
            <Measuring />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stationery/office"
        element={
          <ProtectedRoute allowedRole="student">
            <Office />
          </ProtectedRoute>
        }
      />

      <Route
        path="/office"
        element={
          <ProtectedRoute allowedRole="student">
            <Office />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stationery/:type"
        element={
          <ProtectedRoute allowedRole="student">
            <StationeryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRole="student">
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="student">
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment"
        element={
          <ProtectedRoute allowedRole="student">
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receipt"
        element={
          <ProtectedRoute allowedRole="student">
            <ReceiptPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin-intro"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminIntroPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}

export default App;
