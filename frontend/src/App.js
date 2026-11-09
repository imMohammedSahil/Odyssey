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

const getCursorConfig = (pathname) => {
  // 1. Basecamp Student Desk 04 (/student) - Comic Zombie & Brain Pink Ambience
  if (pathname.startsWith("/student")) {
    return {
      color: "#FF70A6", // Brain Pink - maximum punch against Slime Green & Void Black
      material: "chrome",
      size: 44,
      wobble: 0.85,
      goo: 1,
      stretch: 0.48,
      trail: 14,
      shine: 1,
      splashSpeed: 0.55,
      splashCount: 7,
    };
  }

  // 2. Intro Screen (/)
  if (pathname === "/") {
    return {
      color: "#FF70A6", // Brain Pink
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 3. Print Lab (/printing) - Deep Emerald Ambience
  if (pathname.startsWith("/printing")) {
    return {
      color: "#00E599", // Electric Mint Emerald
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 4. Writing (/writing)
  if (pathname.startsWith("/writing")) {
    return {
      color: "#45B89E", // Seafoam Jade
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 5. Paper (/paper)
  if (pathname.startsWith("/paper") || pathname.startsWith("/stationery/paper")) {
    return {
      color: "#FF3B47", // Electric Crimson
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 6. Measuring (/measuring)
  if (pathname.startsWith("/measuring") || pathname.startsWith("/stationery/measuring")) {
    return {
      color: "#F56234", // Electric Amber
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 7. Correction & Marking (/stationery/correction) - Twilight Purple & Pumpkin Flame
  if (pathname.startsWith("/stationery/correction") || pathname.startsWith("/correction")) {
    return {
      color: "#FFA012", // Pumpkin Orange
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 8. Office & Desk Utilities (/stationery/office, /office) - Midnight Slate & Desert Bronze
  if (pathname.startsWith("/office") || pathname.startsWith("/stationery/office")) {
    return {
      color: "#C89F72", // Warm Bronze Gold
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 9. Raven Altar (/ritual-offering) - Dark Occult Crypt
  if (pathname.startsWith("/ritual-offering")) {
    return {
      color: "#BE2E2E", // Occult Crimson Blood
      material: "chrome",
      size: 44,
      wobble: 0.85,
      goo: 1,
      stretch: 0.45,
      trail: 13,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 10. Payment Gateway (/payment) - Gothic Chapel Crypt, Fiery Lantern Core & Blood Ruby Chrome
  if (pathname.startsWith("/payment")) {
    return {
      color: "#FF2A1B", // Fiery Lantern Ember / Occult Crimson Ruby
      material: "chrome",
      size: 46,
      morph: 0.35,
      morphSpeed: 0.45,
      wobble: 0.9,
      goo: 1,
      stretch: 0.52,
      trail: 14,
      shine: 1,
      lag: 0.36,
      splashSpeed: 0.62,
      splashCount: 8,
      splashSize: 0.55,
      regrow: 0.45,
    };
  }

  // 11. Cart & Profile (/cart, /profile)
  if (pathname.startsWith("/cart") || pathname.startsWith("/profile")) {
    return {
      color: "#FF70A6", // Brain Pink
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  // 12. Admin (/admin)
  if (pathname.startsWith("/admin")) {
    return {
      color: "#7C5CFC", // Cyber Violet
      material: "chrome",
      size: 42,
      wobble: 0.8,
      goo: 1,
      stretch: 0.4,
      trail: 12,
      shine: 1,
      splashSpeed: 0.5,
      splashCount: 6,
    };
  }

  return {
    color: "#FF70A6",
    material: "chrome",
    size: 42,
    wobble: 0.8,
    goo: 1,
    stretch: 0.4,
    trail: 12,
    shine: 1,
    splashSpeed: 0.5,
    splashCount: 6,
  };
};

function GlobalBlobCursor() {
  const { pathname } = useLocation();
  const cfg = getCursorConfig(pathname);

  return (
    <BlobCursor
      key={pathname}
      material={cfg.material || "chrome"}
      color={cfg.color}
      blend={cfg.blend || "normal"}
      size={cfg.size || 42}
      morph={cfg.morph ?? 0}
      morphSpeed={cfg.morphSpeed ?? 0.4}
      depth={1}
      trail={cfg.trail ?? 12}
      lag={cfg.lag ?? 0.35}
      goo={cfg.goo ?? 1}
      stretch={cfg.stretch ?? 0.4}
      wobble={cfg.wobble ?? 0.8}
      drip={cfg.drip ?? 0}
      shine={cfg.shine ?? 1}
      splash={true}
      splashCount={cfg.splashCount ?? 6}
      splashSpeed={cfg.splashSpeed ?? 0.5}
      splashSize={cfg.splashSize ?? 0.5}
      splashGravity={cfg.splashGravity ?? 0}
      regrow={cfg.regrow ?? 0.5}
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
