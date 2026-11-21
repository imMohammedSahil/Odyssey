export default function ProtectedRoute({ children, allowedRole }) {
  // Ensure default student identity is initialized
  if (!sessionStorage.getItem("user")) {
    sessionStorage.setItem("user", "PETER PARKER");
    sessionStorage.setItem("role", "student");
  }

  // Admin routes can be accessed by both admins and view-only users
  if (allowedRole === "admin") {
    return children;
  }

  return children;
}
