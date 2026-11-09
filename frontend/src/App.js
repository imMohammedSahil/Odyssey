import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import IntroPage from "./pages/IntroPage";
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
import BlobCursor from "./components/BlobCursor";

const getCursorColor = (pathname) => {
  // 1. Intro Screen
  if (pathname === "/") return "#FF70A6"; // Brain Pink

  // 2. The 6 Requisition Aisle Pages
  if (pathname.startsWith("/printing")) return "#00E599"; // Electric Emerald (matches #019E70 Print Lab)
  if (pathname.startsWith("/writing")) return "#45B89E"; // Seafoam Jade (matches Writing Weaponry)
  if (pathname.startsWith("/paper") || pathname.startsWith("/stationery/paper")) return "#FF3B47"; // Electric Crimson (matches Paper Reams)
  if (pathname.startsWith("/measuring") || pathname.startsWith("/stationery/measuring")) return "#F56234"; // Electric Amber (matches Measuring & Drafting)
  if (pathname.startsWith("/ritual-offering")) return "#BE2E2E"; // Occult Crimson Blood (matches Raven Altar)
  if (pathname.startsWith("/student")) return "#9DE869"; // Slime Green (matches Basecamp Desk 04)

  // Other Campus Operations
  if (pathname.startsWith("/stationery/correction")) return "#FFA012"; // Pumpkin Orange
  if (pathname.startsWith("/office") || pathname.startsWith("/stationery/office")) return "#C89F72"; // Desert Sand Bronze
  if (pathname.startsWith("/stationery")) return "#00E599";
  if (pathname.startsWith("/payment")) return "#FFA84A"; // Gothic Chapel Lantern Gold
  if (pathname.startsWith("/receipt")) return "#FF70A6"; // Raven Receipt Pink
  if (pathname.startsWith("/cart")) return "#FF70A6"; // Cart Pink
  if (pathname.startsWith("/profile")) return "#45B89E"; // Seafoam
  if (pathname.startsWith("/admin")) return "#7C5CFC"; // Admin Violet
  return "#FF70A6";
};

function GlobalBlobCursor() {
  const { pathname } = useLocation();
  const color = getCursorColor(pathname);

  return (
    <BlobCursor
      key={pathname}
      material="chrome"
      color={color}
      blend="normal"
      size={42}
      morph={0}
      morphSpeed={0.4}
      depth={1}
      trail={12}
      lag={0.35}
      goo={1}
      stretch={0.4}
      wobble={0.8}
      drip={0}
      shine={1}
      splash={true}
      splashCount={6}
      splashSpeed={0.5}
      splashSize={0.5}
      splashGravity={0}
      regrow={0.5}
      shadow={false}
      hideCursor={true}
    />
  );
}

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
      <GlobalBlobCursor />
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<Navigate to="/student" replace />} />
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
