import { Routes, Route } from "react-router-dom";

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
import StationeryPage from "./pages/StationeryPage";
import ReceiptPage from "./pages/ReceiptPage";
import AdminIntroPage from "./pages/AdminIntroPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />

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
  );
}

export default App;