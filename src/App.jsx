import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import CartPanel from "./components/cart/CartPanel";
import HomePage from "./pages/HomePage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import CheckoutPage from "./pages/CheckoutPage";
import SplashScreen from "./components/ui/SplashScreen";

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const location = useLocation();

  // Verificar si el usuario está logueado al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Verificar si ya se mostró el splash en esta sesión de pestaña
    const splashShown = sessionStorage.getItem("splashShown");
    if (!splashShown) {
      setShowSplash(true);
      // Mostrar splash por 1 segundo solo la primera vez
      const timer = setTimeout(() => {
        setShowSplash(false);
        setLoading(false);
        sessionStorage.setItem("splashShown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Rutas públicas (no requieren autenticación)
  const isPublicRoute = [
    "/login",
    "/login/register",
    "/login/forgotpassword",
  ].includes(location.pathname);

  // Componente de protección de rutas
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <SplashScreen />;
    }

    return user ? children : <Navigate to="/login" replace />;
  };

  // Redirigir usuarios autenticados desde ciertas rutas públicas
  const PublicRoute = ({ children }) => {
    if (
      ["/login", "/login/register", "/login/forgotpassword"].includes(
        location.pathname
      ) &&
      user
    ) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  if (loading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <CartProvider>
      <div className="App">
        {/* Mostrar Header solo si no estamos en rutas de login */}
        {!["/login", "/login/register", "/login/forgotpassword"].includes(
          location.pathname
        ) && <Header user={user} onLogout={handleLogout} />}

        {/* <CartPanel /> */}
        <main>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login onLogin={handleLogin} />
                </PublicRoute>
              }
            />
            <Route
              path="/login/register"
              element={
                <PublicRoute>
                  <Register onLogin={handleLogin} />
                </PublicRoute>
              }
            />
            <Route
              path="/login/forgotpassword"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* Ruta catch-all para rutas no válidas */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>

        {/* Mostrar Footer solo si no estamos en rutas de login */}
        {!["/login", "/login/register", "/login/forgotpassword"].includes(
          location.pathname
        ) && <Footer />}
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
