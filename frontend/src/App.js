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
      size: 34, // Compact and agile per user request
      morph: 0.35,
      morphSpeed: 0.45,
      wobble: 0.85,
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
  const [drain, setDrain] = useState(0);

  useEffect(() => {
    setDrain(0);
  }, [pathname]);

  useEffect(() => {
    if (!pathname.startsWith("/payment")) return;
    const onDrain = (e) => {
      if (typeof e.detail?.drain === "number") {
        setDrain(e.detail.drain);
      }
    };
    window.addEventListener("odyssey_cursor_drain", onDrain);
    return () => window.removeEventListener("odyssey_cursor_drain", onDrain);
  }, [pathname]);

  // When on payment page, modulate color, shine, size, and wobble based on proximity to Grim Reaper
  let activeColor = cfg.color;
  let activeShine = cfg.shine ?? 1;
  let activeSize = cfg.size || 42;
  let activeWobble = cfg.wobble ?? 0.8;
  let activeStretch = cfg.stretch ?? 0.4;

  if (pathname.startsWith("/payment") && drain > 0) {
    // Lerp from Fiery Crimson #FF2A1B (255, 42, 27) to Lifeless Ashen Tombstone Grey #4E585E (78, 88, 94)
    const t = Math.min(1, Math.max(0, drain));
    const r = Math.round(255 + (78 - 255) * t);
    const g = Math.round(42 + (88 - 42) * t);
    const b = Math.round(27 + (94 - 27) * t);
    activeColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    activeShine = Math.max(0.06, 1.0 - t * 0.92); // Dims to dead matte as life leaves
    activeSize = Math.max(22, 34 - t * 10); // Shrinks from 34 to 24 when drained
    activeWobble = Math.max(0.2, 0.85 - t * 0.65); // Stiffens as vitality is siphoned
    activeStretch = Math.max(0.18, 0.52 - t * 0.32);
  }

  return (
    <BlobCursor
      key={pathname}
      material={cfg.material || "chrome"}
      color={activeColor}
      blend={cfg.blend || "normal"}
      size={activeSize}
      morph={cfg.morph ?? 0}
      morphSpeed={cfg.morphSpeed ?? 0.4}
      depth={1}
      trail={cfg.trail ?? 12}
      lag={cfg.lag ?? 0.35}
      goo={cfg.goo ?? 1}
      stretch={activeStretch}
      wobble={activeWobble}
      drip={cfg.drip ?? 0}
      shine={activeShine}
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
